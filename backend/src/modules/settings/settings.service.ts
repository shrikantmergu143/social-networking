import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateCredentialsDto, UpdateSettingsDto } from './dto/update-settings.dto';
import { UserSettings } from './entities/user-settings.entity';

const DEFAULT_SETTINGS = {
  isProfileVisible: true, incognitoMode: false, showOnlineStatus: true,
  showDistance: true, showAge: true, pushNotifications: true,
  emailNotifications: false, matchAlerts: true, messageAlerts: true,
  isPremium: false, premiumTier: 'none', theme: 'light',
};

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserSettings) private readonly settings: Repository<UserSettings>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  private async getOrCreate(userId: string) {
    let entity = await this.settings.findOne({ where: { userId } });
    if (!entity) entity = await this.settings.save(this.settings.create({ userId, settings: DEFAULT_SETTINGS }));
    return entity;
  }

  async get(userId: string) {
    const [entity, user] = await Promise.all([
      this.getOrCreate(userId),
      this.users.findOne({ where: { id: userId } }),
    ]);
    if (!user) throw new NotFoundException('Account not found.');
    return {
      ...entity.settings,
      isPrivate: user.isPrivate,
      credentials: { email: user.email, phone: user.phoneNumber || '', emailVerified: user.isVerified, phoneVerified: false },
    };
  }

  async update(userId: string, dto: UpdateSettingsDto) {
    const entity = await this.getOrCreate(userId);
    const { isPrivate, ...settingsUpdate } = dto;
    entity.settings = { ...entity.settings, ...settingsUpdate };
    if (isPrivate !== undefined) await this.users.update({ id: userId }, { isPrivate });
    await this.settings.save(entity);
    return this.get(userId);
  }

  async updateCredentials(userId: string, dto: UpdateCredentialsDto) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Account not found.');
    if (dto.email && dto.email !== user.email) {
      const existing = await this.users.findOne({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email address is already in use.');
      user.email = dto.email;
      user.isVerified = false;
    }
    if (dto.phone !== undefined) user.phoneNumber = dto.phone;
    await this.users.save(user);
    return { email: user.email, phone: user.phoneNumber || '', emailVerified: user.isVerified, phoneVerified: false };
  }

  async verify(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Account not found.');
    user.isVerified = true;
    await this.users.save(user);
    return { isVerified: true };
  }
}
