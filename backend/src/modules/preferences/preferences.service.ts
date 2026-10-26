import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDatingPreferences } from '../users/entities/user-dating-preferences.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(UserDatingPreferences)
    private readonly preferences: Repository<UserDatingPreferences>,
  ) {}

  async get(userId: string) {
    const preferences = await this.preferences.findOneBy({ userId });
    return preferences ? this.toClientShape(preferences) : {
      genderPreference: [], ageRange: [18, 99], maxDistanceKm: 50, intentions: [],
      verifiedOnly: false, recentlyActiveOnly: false, onlineOnly: false,
    };
  }

  async update(userId: string, payload: UpdatePreferencesDto) {
    const current = await this.preferences.findOneBy({ userId });
    const next = this.toDatabaseShape(payload, current);
    if (next.minAge > next.maxAge) throw new BadRequestException('Minimum age must not exceed maximum age.');
    const saved = await this.preferences.save(
      current ? Object.assign(current, next) : this.preferences.create({ userId, ...next }),
    );
    return this.toClientShape(saved);
  }

  private toDatabaseShape(payload: UpdatePreferencesDto, current?: UserDatingPreferences | null) {
    const range = payload.ageRange;
    return {
      genderPreferences: payload.genderPreference ?? current?.genderPreferences ?? [],
      minAge: Number(range?.[0] ?? current?.minAge ?? 18),
      maxAge: Number(range?.[1] ?? current?.maxAge ?? 99),
      maxDistanceKm: Number(payload.maxDistanceKm ?? current?.maxDistanceKm ?? 50),
      intentions: payload.intentions ?? current?.intentions ?? [],
      verifiedOnly: Boolean(payload.verifiedOnly ?? current?.verifiedOnly ?? false),
      recentlyActiveOnly: Boolean(payload.recentlyActiveOnly ?? current?.recentlyActiveOnly ?? false),
      onlineOnly: Boolean(payload.onlineOnly ?? current?.onlineOnly ?? false),
    };
  }

  private toClientShape(entity: UserDatingPreferences) {
    return {
      genderPreference: entity.genderPreferences,
      ageRange: [entity.minAge, entity.maxAge],
      maxDistanceKm: Number(entity.maxDistanceKm),
      intentions: entity.intentions,
      verifiedOnly: entity.verifiedOnly,
      recentlyActiveOnly: entity.recentlyActiveOnly,
      onlineOnly: entity.onlineOnly,
    };
  }
}
