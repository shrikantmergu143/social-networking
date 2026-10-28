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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
@ApiTags('Uploads')
@ApiBearerAuth('JWT-auth')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a profile, post, or story image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'JPG, PNG, or WebP; maximum 5 MB',
        },
        type: {
          type: 'string',
          enum: ['profile', 'avatar', 'cover', 'post', 'story'],
          example: 'profile',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Uploaded file metadata and its public URL.',
    schema: {
      example: {
        id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
        type: 'profile',
        originalName: 'portrait.jpg',
        url: 'http://localhost:3000/storage/profile/portrait.jpg',
        mimeType: 'image/jpeg',
        size: 245760,
      },
    },
  })
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
  @ApiOperation({ summary: 'List uploaded files' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['profile', 'avatar', 'cover', 'post', 'story'],
    example: 'profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Uploaded file records, newest first.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          type: 'profile',
          originalName: 'portrait.jpg',
          fileName: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1.jpg',
          storagePath: 'storage/profile/portrait.jpg',
          url: 'http://localhost:3000/storage/profile/portrait.jpg',
          mimeType: 'image/jpeg',
          size: 245760,
        },
      ],
    },
  })
  list(@Req() request: UploadRequest, @Query('type') type?: UploadType) {
    if (type && !ALLOWED_UPLOAD_TYPES.includes(type)) {
      throw new BadRequestException('Invalid upload type.');
    }
    return this.uploadService.list(request.user.id, type);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an uploaded file' })
  @ApiResponse({
    status: 200,
    description: 'File deleted.',
    schema: {
      example: { id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1', deleted: true },
    },
  })
  remove(@Param('id') id: string, @Req() request: UploadRequest) {
    return this.uploadService.remove(id, request.user.id);
  }
}
