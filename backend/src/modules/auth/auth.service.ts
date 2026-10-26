import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    const email = dto?.email?.trim?.()?.toLocaleLowerCase?.();
    const existing = await this.users.findOne({ where: { email: email } });
    if (existing)
      throw new ConflictException('An Account with this email already exists');
    const passwordHash = await bcrypt.hash(dto?.password, 12);
    const username = await this.generateUniqueUsername(email);
    const user = this.users.create({
      username,
      fullName: dto.fullName.trim(),
      email,
      phoneNumber: dto.phoneNumber?.trim(),
      passwordHash,
      birthDate: dto.birthDate,
      gender: dto.gender,
    });
    try {
      const saved = await this.users.save(user);
      return this.buildAuthResponse(saved);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException(
          'An account with this email or username already exists',
        );
      }
      throw error;
    }
  }
  async login(dto: LoginDto) {
    const email = dto.email?.trim?.()?.toLowerCase();
    const user = await this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
    // Same message for unknown email and wrong password avoids account enumeration.
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  async getUserDetails(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User account no longer exists');
    return this.toPublicUser(user);
  }
  async logout(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User account no longer exists');
    user.isOnline = false;
    user.lastActive = new Date();
    await this.users.save(user);
    return { loggedOut: true };
  }
  private async generateUniqueUsername(email: string): Promise<string> {
    const base =
      (email.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '')
        .slice(0, 35) || 'user';

    // Random suffix keeps usernames unique without exposing the full email.
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = `${base}-${randomBytes(3).toString('hex')}`.slice(
        0,
        50,
      );
      const exists = await this.users.findOne({
        where: { username: candidate },
      });
      if (!exists) return candidate;
    }
    throw new ConflictException(
      'Could not generate a username; please try again',
    );
  }
  private async buildAuthResponse(user: User) {
    user.isOnline = true;
    user.lastActive = new Date();
    await this.users.save(user);
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
      expiresIn,
      user: this.toPublicUser(user),
    };
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      birthDate: user.birthDate,
      gender: user.gender,
      pronouns: user.pronouns ?? undefined,
      location: user.location ?? '',
      bio: user.bio,
      avatar: user.avatar ?? '',
      coverImage: user.coverImage ?? '',
      relationshipGoal: user.relationshipGoal ?? 'Still figuring it out',
      age: user.birthDate
        ? Math.max(0, Math.floor((Date.now() - new Date(user.birthDate).getTime()) / 31557600000))
        : 18,
      distanceKm: 0,
      photos: [],
      interests: [],
      lifestyle: {},
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
      isVerified: user.isVerified,
      isOnline: user.isOnline,
      lastActive: user.lastActive?.toISOString() ?? '',
    };
  }
}
