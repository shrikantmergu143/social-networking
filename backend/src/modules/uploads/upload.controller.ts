import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequestUser } from '../auth/interfaces/authenticated-request-user.interface';
import { UploadService, UploadInput } from './upload.service';
import { UploadType } from './entities/upload-file.entity';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_UPLOAD_TYPES: UploadType[] = [
  'profile',
  'avatar',
  'cover',
  'post',
  'story',
];

interface UploadRequest extends Request {
  user: AuthenticatedRequestUser;
  protocol: string;
  get(name: string): string;
}

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE, files: 1 },
      fileFilter: (_request, file, callback) => {
        callback(null, ALLOWED_MIME_TYPES.includes(file.mimetype));
      },
    }),
  )
  async upload(
    @UploadedFile() file: UploadInput,
    @Body('type') type: string,
    @Req() request: UploadRequest,
  ) {
    if (!file) {
      throw new BadRequestException(
        'A JPG, PNG, or WebP file up to 5 MB is required.',
      );
    }

    const uploadType = (type || 'profile') as UploadType;
    if (!ALLOWED_UPLOAD_TYPES.includes(uploadType)) {
      throw new BadRequestException(
        `Invalid upload type. Allowed values: ${ALLOWED_UPLOAD_TYPES.join(', ')}.`,
      );
    }

    return this.uploadService.save(file, request.user.id, uploadType, request);
  }

  @Get()
  list(@Req() request: UploadRequest, @Query('type') type?: UploadType) {
    if (type && !ALLOWED_UPLOAD_TYPES.includes(type)) {
      throw new BadRequestException('Invalid upload type.');
    }
    return this.uploadService.list(request.user.id, type);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: UploadRequest) {
    return this.uploadService.remove(id, request.user.id);
  }
}
