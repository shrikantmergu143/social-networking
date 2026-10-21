import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserInterest } from '../users/entities/user-interest.entity';
import { UserLifestyle } from '../users/entities/user-lifestyle.entity';
import { UserPhoto } from '../users/entities/user-photo.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserInterest)
    private readonly interests: Repository<UserInterest>,
    @InjectRepository(UserLifestyle)
    private readonly lifestyles: Repository<UserLifestyle>,
    @InjectRepository(UserPhoto) private readonly photos: Repository<UserPhoto>,
  ) {}

  async update(userId: string, dto: UpdateProfileDto) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Profile not found.');

    Object.assign(user, {
      fullName: dto.fullName ?? user.fullName,
      bio: dto.bio ?? user.bio,
      location: dto.location ?? user.location,
      pronouns: dto.pronouns ?? user.pronouns,
      relationshipGoal: dto.relationshipGoal ?? user.relationshipGoal,
      avatar: dto.avatar ?? user.avatar,
    });
    await this.users.save(user);

    if (dto.lifestyle) {
      const lifestyle = await this.lifestyles.findOne({ where: { userId } });
      await this.lifestyles.save(
        lifestyle
          ? Object.assign(lifestyle, dto.lifestyle)
          : this.lifestyles.create({ userId, ...dto.lifestyle }),
      );
    }
    if (dto.photos) {
      await this.photos.delete({ userId });
      await this.photos.save(
        dto.photos.map((photoUrl, displayOrder) =>
          this.photos.create({ userId, photoUrl, displayOrder }),
        ),
      );
    }
    if (dto.interests) {
      await this.interests.delete({ userId });
      await this.interests.save(
        dto.interests.map((interest) =>
          this.interests.create({ userId, interest }),
        ),
      );
    }
    return this.get(userId);
  }

  get(userId: string) {
    return this.users.findOne({
      where: { id: userId },
      relations: { lifestyle: true, photos: true, interests: true },
    });
  }
}
