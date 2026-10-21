import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join, relative, extname } from 'path';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { UploadFile, UploadType } from './entities/upload-file.entity';

export interface UploadInput {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly storageRoot = join(process.cwd(), 'storage');

  constructor(
    @InjectRepository(UploadFile)
    private readonly uploadRepository: Repository<UploadFile>,
  ) {}

  async save(
    file: UploadInput,
    userId: string,
    type: UploadType,
    request: { protocol: string; get(name: string): string },
  ) {
    const date = new Date().toISOString().slice(0, 10);
    const extension = extname(file.originalname).toLowerCase();
    const fileName = `${randomUUID()}${extension}`;
    const directory = join(this.storageRoot, type, userId, date);
    const absolutePath = join(directory, fileName);

    await mkdir(directory, { recursive: true });
    await writeFile(absolutePath, file.buffer);

    const storagePath = relative(process.cwd(), absolutePath).replaceAll('\\', '/');
    const upload = this.uploadRepository.create({
      userId,
      type,
      originalName: file.originalname,
      fileName,
      storagePath,
      url: `${request.protocol}://${request.get('host')}/${storagePath}`,
      mimeType: file.mimetype,
      size: file.size,
    });

    try {
      return await this.uploadRepository.save(upload);
    } catch (error) {
      await rm(absolutePath, { force: true });
      throw error;
    }
  }

  list(userId: string, type?: UploadType) {
    return this.uploadRepository.find({
      where: type ? { userId, type } : { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string, userId: string) {
    const upload = await this.uploadRepository.findOne({ where: { id, userId } });
    if (!upload) throw new NotFoundException('Upload file not found.');

    await rm(join(process.cwd(), upload.storagePath), { force: true });
    await this.uploadRepository.remove(upload);
    return { id, deleted: true };
  }
}
