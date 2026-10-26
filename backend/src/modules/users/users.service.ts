import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserFollow } from './entities/user-follow.entity';
import { Post } from '../posts/entities/post.entity';
import { UserBlock } from './entities/user-block.entity';
import { SavedProfile } from './entities/saved-profile.entity';
import { UserReport } from './entities/user-report.entity';
import { UserFollowRequest } from './entities/user-follow-request.entity';
import { ReportUserDto } from './dto/user-action.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationTargetType, NotificationType } from '../../shared/entity/enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserFollow) private readonly follows: Repository<UserFollow>,
    @InjectRepository(UserFollowRequest) private readonly followRequestsRepository: Repository<UserFollowRequest>,
    @InjectRepository(UserBlock) private readonly blocks: Repository<UserBlock>,
    @InjectRepository(SavedProfile) private readonly saved: Repository<SavedProfile>,
    @InjectRepository(UserReport) private readonly reports: Repository<UserReport>,
    private readonly notifications: NotificationsService,
  ) {}

  async search(userId: string, query: string) {
    const term = query.trim();
    if (term.length < 2) return [];
    const users = await this.users.find({
      where: [
        { fullName: ILike(`%${term}%`), id: Not(userId) },
        { username: ILike(`%${term}%`), id: Not(userId) },
      ],
      take: 30,
      order: { fullName: 'ASC' },
    });
    return Promise.all(users.map(user => this.toProfile(user, userId)));
  }

  async getProfile(userId: string, viewerId: string) {
    const user = await this.users.findOne({
      where: { id: userId },
      relations: { photos: true, interests: true, lifestyle: true },
    });
    if (!user) throw new NotFoundException('Profile not found.');
    return this.toProfile(user, viewerId);
  }

  async following(userId: string) {
    const rows = await this.follows.find({
      where: { followerId: userId },
      relations: { following: true },
      order: { createdAt: 'DESC' },
    });
    return Promise.all(rows.map(row => this.toProfile(row.following, userId)));
  }

  async followers(userId: string) {
    const rows = await this.follows.find({
      where: { followingId: userId },
      relations: { follower: true },
      order: { createdAt: 'DESC' },
    });
    return Promise.all(rows.map(row => this.toProfile(row.follower, userId)));
  }

  async setFollow(followerId: string, followingId: string, shouldFollow: boolean) {
    if (followerId === followingId) throw new BadRequestException('You cannot follow yourself.');
    const target = await this.users.findOneBy({ id: followingId });
    if (!target) throw new NotFoundException('User not found.');
    const existing = await this.follows.findOneBy({ followerId, followingId });
    if (shouldFollow && !existing) {
      if (target.isPrivate) return this.requestFollow(followerId, followingId);
      await this.follows.save(this.follows.create({ followerId, followingId }));
      await this.notifications.create({
        userId: followingId,
        actorId: followerId,
        type: NotificationType.FOLLOW,
        text: 'started following you',
        targetId: followerId,
        targetType: NotificationTargetType.PROFILE,
      });
    } else if (!shouldFollow && existing) {
      await this.follows.delete({ id: existing.id });
    }
    if (!shouldFollow) {
      await this.followRequestsRepository.delete({ requesterId: followerId, targetId: followingId });
    }

    return { isFollowing: shouldFollow, requestPending: false };
  }

  async followRequests(userId: string) {
    const rows = await this.followRequestsRepository.find({
      where: { targetId: userId },
      relations: { requester: { photos: true, interests: true, lifestyle: true } },
      order: { createdAt: 'DESC' },
    });
    return Promise.all(rows.map(row => this.toProfile(row.requester, userId)));
  }

  async respondToFollowRequest(userId: string, requesterId: string, accept: boolean) {
    const request = await this.followRequestsRepository.findOneBy({ requesterId, targetId: userId });
    if (!request) throw new NotFoundException('Follow request not found.');
    await this.followRequestsRepository.remove(request);
    if (accept) {
      const existing = await this.follows.findOneBy({ followerId: requesterId, followingId: userId });
      if (!existing) await this.follows.save(this.follows.create({ followerId: requesterId, followingId: userId }));
      await this.notifications.create({
        userId: requesterId,
        actorId: userId,
        type: NotificationType.FOLLOW_ACCEPTED,
        text: 'accepted your follow request',
        targetId: userId,
        targetType: NotificationTargetType.PROFILE,
      });
    }
    return { accepted: accept };
  }

  async cancelFollowRequest(requesterId: string, targetId: string) {
    const request = await this.followRequestsRepository.findOneBy({ requesterId, targetId });
    if (request) await this.followRequestsRepository.remove(request);
    return { requestPending: false };
  }

  private async requestFollow(requesterId: string, targetId: string) {
    const existing = await this.followRequestsRepository.findOneBy({ requesterId, targetId });
    if (!existing) {
      await this.followRequestsRepository.save(this.followRequestsRepository.create({ requesterId, targetId }));
      await this.notifications.create({
        userId: targetId,
        actorId: requesterId,
        type: NotificationType.FOLLOW_REQUEST,
        text: 'requested to follow you',
        targetId: requesterId,
        targetType: NotificationTargetType.PROFILE,
      });
    }
    return { isFollowing: false, requestPending: true };
  }

  async removeFollower(userId: string, followerId: string) {
    await this.follows.delete({ followerId, followingId: userId });
    return { removed: true };
  }

  async savedProfiles(userId: string) {
    const rows = await this.saved.find({
      where: { userId },
      relations: { profile: { photos: true, interests: true, lifestyle: true } },
      order: { createdAt: 'DESC' },
    });
    return Promise.all(rows.map(row => this.toProfile(row.profile, userId)));
  }

  async setSavedProfile(userId: string, profileId: string, isSaved: boolean) {
    if (userId === profileId) throw new BadRequestException('You cannot save your own profile.');
    if (!(await this.users.findOneBy({ id: profileId }))) throw new NotFoundException('Profile not found.');
    const existing = await this.saved.findOneBy({ userId, profileId });
    if (isSaved && !existing) await this.saved.save(this.saved.create({ userId, profileId }));
    if (!isSaved && existing) await this.saved.delete({ id: existing.id });
    return { isSaved };
  }

  async blockedProfiles(userId: string) {
    const rows = await this.blocks.find({
      where: { userId },
      relations: { blockedUser: { photos: true, interests: true, lifestyle: true } },
      order: { createdAt: 'DESC' },
    });
    return Promise.all(rows.map(row => this.toProfile(row.blockedUser, userId)));
  }

  async block(userId: string, blockedUserId: string) {
    if (userId === blockedUserId) throw new BadRequestException('You cannot block yourself.');
    if (!(await this.users.findOneBy({ id: blockedUserId }))) throw new NotFoundException('User not found.');
    const existing = await this.blocks.findOneBy({ userId, blockedUserId });
    if (!existing) await this.blocks.save(this.blocks.create({ userId, blockedUserId }));
    await this.follows.delete([
      { followerId: userId, followingId: blockedUserId },
      { followerId: blockedUserId, followingId: userId },
    ]);
    await this.followRequestsRepository.delete([
      { requesterId: userId, targetId: blockedUserId },
      { requesterId: blockedUserId, targetId: userId },
    ]);
    return { blocked: true };
  }

  async unblock(userId: string, blockedUserId: string) {
    await this.blocks.delete({ userId, blockedUserId });
    return { blocked: false };
  }

  async report(reporterId: string, reportedUserId: string, dto: ReportUserDto) {
    if (reporterId === reportedUserId) throw new BadRequestException('You cannot report yourself.');
    if (!(await this.users.findOneBy({ id: reportedUserId }))) throw new NotFoundException('User not found.');
    const report = await this.reports.save(this.reports.create({
      reporterId,
      reportedUserId,
      reason: dto.reason.trim(),
      details: dto.details.trim(),
    }));
    return { id: report.id, status: report.status };
  }

  private async toProfile(user: User, viewerId: string) {
    const [followerCount, followingCount, postCount, isFollowing, viewer] = await Promise.all([
      this.follows.countBy({ followingId: user.id }),
      this.follows.countBy({ followerId: user.id }),
      this.users.manager.getRepository(Post).countBy({ userId: user.id }),
      this.follows.exists({ where: { followerId: viewerId, followingId: user.id } }),
      this.users.findOne({ where: { id: viewerId }, select: { id: true, latitude: true, longitude: true } }),
    ]);
    const birthDate = user.birthDate ? new Date(user.birthDate) : null;
    const age = birthDate
      ? Math.max(0, Math.floor((Date.now() - birthDate.getTime()) / 31557600000))
      : 18;
    const isPrivateFromViewer = user.isPrivate && viewerId !== user.id && !isFollowing;
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      age,
      birthDate: user.birthDate ?? undefined,
      gender: user.gender,
      pronouns: user.pronouns ?? undefined,
      location: user.location ?? '',
      distanceKm: this.distanceKm(viewer?.latitude, viewer?.longitude, user.latitude, user.longitude),
      bio: isPrivateFromViewer ? '' : user.bio,
      avatar: user.avatar ?? '',
      coverImage: isPrivateFromViewer ? '' : user.coverImage ?? '',
      photos: isPrivateFromViewer ? [] : (user.photos ?? []).sort((a, b) => a.displayOrder - b.displayOrder).map(photo => photo.photoUrl),
      interests: isPrivateFromViewer ? [] : (user.interests ?? []).map(item => item.interest),
      relationshipGoal: user.relationshipGoal,
      lifestyle: isPrivateFromViewer ? {} : user.lifestyle ?? {},
      isVerified: user.isVerified,
      isPrivate: user.isPrivate,
      isFollowing,
      hasPendingFollowRequest: await this.followRequestsRepository.exists({
        where: { requesterId: viewerId, targetId: user.id },
      }),
      isOnline: user.isOnline,
      lastActive: user.lastActive?.toISOString() ?? '',
      followerCount,
      followingCount,
      postCount,
    };
  }

  private distanceKm(
    latitude: number | null | undefined,
    longitude: number | null | undefined,
    targetLatitude: number | null | undefined,
    targetLongitude: number | null | undefined,
  ) {
    if (latitude == null || longitude == null || targetLatitude == null || targetLongitude == null) return 0;
    const radians = (degrees: number) => degrees * Math.PI / 180;
    const latitudeDelta = radians(targetLatitude - latitude);
    const longitudeDelta = radians(targetLongitude - longitude);
    const value = Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(radians(latitude)) * Math.cos(radians(targetLatitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
    return Math.round(6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value)));
  }
}
