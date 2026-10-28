import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('stories')
@UseGuards(JwtAuthGuard)
@ApiTags('Stories')
@ApiBearerAuth('JWT-auth')
export class StoriesController {
  constructor(private readonly stories: StoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List stories available to the user' })
  @ApiResponse({
    status: 200,
    description: 'Unexpired story groups with per-item view state.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          userId: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
          userName: 'Jordan Lee',
          userAvatar: '',
          isVerified: false,
          hasUnseenStories: true,
          stories: [
            {
              id: 'b6f80f10-961a-4518-bb24-c9258cfbc6d8',
              mediaUrl: 'https://cdn.example.com/story.jpg',
              mediaType: 'image',
              durationSeconds: 5,
              timestamp: '2026-10-28T12:00:00.000Z',
              viewed: false,
            },
          ],
        },
      ],
    },
  })
  list(@Req() request: any) {
    return this.stories.list(request.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a story' })
  @ApiResponse({
    status: 201,
    description: 'Created story item.',
    schema: {
      example: {
        id: 'b6f80f10-961a-4518-bb24-c9258cfbc6d8',
        storyId: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
        mediaUrl: 'https://cdn.example.com/story.jpg',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Weekend views',
        timestamp: '2026-10-28T12:00:00.000Z',
      },
    },
  })
  create(@Req() request: any, @Body() body: CreateStoryDto) {
    return this.stories.create(request.user.id, body);
  }

  @Post(':itemId/view')
  @ApiOperation({ summary: 'Record a story view' })
  @ApiResponse({
    status: 201,
    description: 'Story view recorded.',
    schema: { example: { viewed: true } },
  })
  view(
    @Req() request: any,
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
  ) {
    return this.stories.view(request.user.id, itemId);
  }
}
