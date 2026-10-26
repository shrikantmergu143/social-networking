import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppNotification } from './entities/notification.entity';
import { NotificationTargetType, NotificationType } from '../../shared/entity/enum';

@Injectable()
export class NotificationsService {
  constructor(@InjectRepository(AppNotification) private readonly notifications: Repository<AppNotification>) {}

  async list(userId: string) {
    const rows = await this.notifications.find({
      where: { userId },
      relations: { actor: true },
      order: { createdAt: 'DESC' },
      take: 100,
    });
    return rows.map(row => ({
      id: row.id,
      type: row.type,
      actor: {
        id: row.actor?.id ?? '',
        name: row.actor?.fullName ?? 'Aura',
        avatar: row.actor?.avatar ?? '',
        username: row.actor?.username ?? '',
      },
      text: row.text,
      targetId: row.targetId ?? undefined,
      targetType: row.targetType ?? undefined,
      createdAt: row.createdAt.toISOString(),
      isRead: row.isRead,
    }));
  }

  async read(userId: string, notificationId: string) {
    const notification = await this.notifications.findOneBy({ id: notificationId, userId });
    if (!notification) throw new NotFoundException('Notification not found.');
    notification.isRead = true;
    await this.notifications.save(notification);
    return { isRead: true };
  }

  async readAll(userId: string) {
    await this.notifications.update({ userId, isRead: false }, { isRead: true });
    return { updated: true };
  }

  async create(input: {
    userId: string;
    actorId: string;
    type: NotificationType;
    text: string;
    targetId?: string;
    targetType?: NotificationTargetType;
  }) {
    if (input.userId === input.actorId) return;
    await this.notifications.save(this.notifications.create({
      ...input,
      targetId: input.targetId ?? null,
      targetType: input.targetType ?? null,
    }));
  }
}
