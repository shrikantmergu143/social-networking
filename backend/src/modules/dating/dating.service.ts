import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserDatingPreferences } from '../users/entities/user-dating-preferences.entity';
import { UserPhoto } from '../users/entities/user-photo.entity';
import { UserInterest } from '../users/entities/user-interest.entity';
import { UserLifestyle } from '../users/entities/user-lifestyle.entity';
import { UserFollow } from '../users/entities/user-follow.entity';
import { UserFollowRequest } from '../users/entities/user-follow-request.entity';
import { DatingActionRecord } from './entities/dating-action.entity';
import { DatingMatch } from './entities/dating-match.entity';
import { DatingActionType } from '../../shared/entity/enum';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationTargetType, NotificationType } from '../../shared/entity/enum';

@Injectable()
export class DatingService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserDatingPreferences) private readonly preferences: Repository<UserDatingPreferences>,
    @InjectRepository(DatingActionRecord) private readonly actions: Repository<DatingActionRecord>,
    @InjectRepository(DatingMatch) private readonly matchRepository: Repository<DatingMatch>,
    @InjectRepository(UserFollow) private readonly follows: Repository<UserFollow>,
    @InjectRepository(UserFollowRequest) private readonly followRequests: Repository<UserFollowRequest>,
    private readonly notifications: NotificationsService,
  ) {}

  async discover(userId: string) {
    const preferences = await this.preferences.findOneBy({ userId });
    const acted = await this.actions.find({ where: { actorId: userId }, select: { profileId: true } });
    const excluded = [...acted.map(action => action.profileId), userId];
    const allCandidates = await this.users.find({
      where: excluded.length ? { id: In(await this.getCandidateIds(userId, excluded, preferences)) } : {},
      relations: { photos: true, interests: true, lifestyle: true },
      take: 100,
    });
    const candidates = allCandidates.filter?.(user => {
      const age = user.birthDate
        ? Math.floor((Date.now() - new Date(user.birthDate).getTime()) / 31557600000)
        : 18;
      return age >= (preferences?.minAge ?? 18) &&
        age <= (preferences?.maxAge ?? 99) &&
        (!preferences?.intentions?.length || preferences.intentions.includes(user.relationshipGoal)) &&
        (!preferences?.recentlyActiveOnly || Boolean(
          user.lastActive && Date.now() - user.lastActive.getTime() < 7 * 24 * 60 * 60 * 1000
        ));
    });
    const profiles = await Promise.all(candidates.map(user => this.toProfile(user, userId)));
    return profiles.filter?.(profile => profile.distanceKm <= Number(preferences?.maxDistanceKm ?? 50));
  }

  async act(actorId: string, profileId: string, action: 'like' | 'pass' | 'superlike') {
    if (actorId === profileId) throw new BadRequestException('You cannot act on your own profile.');
    if (!Object.values(DatingActionType).includes(action as DatingActionType)) {
      throw new BadRequestException('Invalid dating action.');
    }
    const profile = await this.users.findOneBy({ id: profileId });
    if (!profile) throw new NotFoundException('Profile not found.');
    let record = await this.actions.findOneBy({ actorId, profileId });
    const shouldNotify = record?.action !== action;
    if (record) record.action = action as DatingActionType;
    else record = this.actions.create({ actorId, profileId, action: action as DatingActionType });
    await this.actions.save(record);

    if (shouldNotify && (action === 'like' || action === 'superlike')) {
      await this.notifications.create({
        userId: profileId,
        actorId,
        type: action === 'superlike' ? NotificationType.SUPERLIKE : NotificationType.LIKE,
        text: action === 'superlike' ? 'sent you a Super Like' : 'liked your profile',
        targetId: actorId,
        targetType: NotificationTargetType.PROFILE,
      });
    }

    let match: DatingMatch | null = null;
    if (action !== 'pass') {
      const reciprocal = await this.actions.findOneBy({ actorId: profileId, profileId: actorId });
      if (reciprocal && reciprocal.action !== DatingActionType.PASS) {
        const [userOneId, userTwoId] = [actorId, profileId].sort();
        match = await this.matchRepository.findOneBy({ userOneId, userTwoId });
        if (!match) {
          match = await this.matchRepository.save(this.matchRepository.create({
            userOneId, userTwoId, matchedAt: new Date(), isActive: true,
          }));
          await Promise.all([actorId, profileId].map((userId, index) =>
            this.notifications.create({
              userId,
              actorId: index === 0 ? profileId : actorId,
              type: NotificationType.MATCH,
              text: 'you have a new match',
              targetId: index === 0 ? profileId : actorId,
              targetType: NotificationTargetType.PROFILE,
            })
          ));
        }
      }
    }
    return { action, matched: Boolean(match), matchId: match?.id };
  }

  async matches(userId: string) {
    const rows = await this.matchRepository.find({
      where: [{ userOneId: userId, isActive: true }, { userTwoId: userId, isActive: true }],
      relations: { userOne: true, userTwo: true },
      order: { matchedAt: 'DESC' },
    });
    return Promise.all(rows.map(row => this.toProfile(row.userOneId === userId ? row.userTwo : row.userOne, userId)));
  }

  private async getCandidateIds(userId: string, excluded: string[], preferences: UserDatingPreferences | null) {
    const users = await this.users.find({ select: { id: true, gender: true, isVerified: true, isOnline: true } });
    return users.filter?.(user =>
      !excluded.includes(user.id) &&
      (!preferences?.genderPreferences?.length || preferences.genderPreferences.includes(user.gender)) &&
      (!preferences?.verifiedOnly || user.isVerified) &&
      (!preferences?.onlineOnly || user.isOnline)
    ).map(user => user.id);
  }

  private async toProfile(user: User, viewerId: string) {
    const follows = this.follows;
    const [followerCount, followingCount, isFollowing, viewer] = await Promise.all([
      follows.countBy({ followingId: user.id }),
      follows.countBy({ followerId: user.id }),
      follows.exists({ where: { followerId: viewerId, followingId: user.id } }),
      this.users.findOne({ where: { id: viewerId }, select: { id: true, latitude: true, longitude: true } }),
    ]);
    const age = user.birthDate
      ? Math.max(0, Math.floor((Date.now() - new Date(user.birthDate).getTime()) / 31557600000))
      : 18;
    const isPrivateFromViewer = user.isPrivate && viewerId !== user.id && !isFollowing;
    return {
      id: user.id, username: user.username, fullName: user.fullName, age,
      birthDate: user.birthDate ?? undefined, gender: user.gender, pronouns: user.pronouns ?? undefined,
      location: user.location ?? '', distanceKm: this.distanceKm(viewer?.latitude, viewer?.longitude, user.latitude, user.longitude), bio: isPrivateFromViewer ? '' : user.bio,
      avatar: user.avatar ?? '', coverImage: isPrivateFromViewer ? '' : user.coverImage ?? '',
      photos: isPrivateFromViewer
        ? []
        : (user.photos ?? []).sort((a, b) => a.displayOrder - b.displayOrder).map((photo: UserPhoto) => photo.photoUrl),
      interests: isPrivateFromViewer
        ? []
        : (user.interests ?? []).map((item: UserInterest) => item.interest),
      relationshipGoal: user.relationshipGoal,
      lifestyle: isPrivateFromViewer ? {} : user.lifestyle ?? {},
      isVerified: user.isVerified, isOnline: user.isOnline, lastActive: user.lastActive?.toISOString() ?? '',
      isPrivate: user.isPrivate,
      hasPendingFollowRequest: await this.followRequests.exists({
        where: { requesterId: viewerId, targetId: user.id },
      }),
      followerCount, followingCount, postCount: 0, isFollowing,
    };
  }

  private distanceKm(latitude?: number | null, longitude?: number | null, targetLatitude?: number | null, targetLongitude?: number | null) {
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
