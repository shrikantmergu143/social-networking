import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpsertPostDto, SetPostLikeDto, SetPostSaveDto } from './dto/post.dto';
import { PostsService } from './posts.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiTags('Posts')
@ApiBearerAuth('JWT-auth')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get the authenticated user feed' })
  @ApiResponse({
    status: 200,
    description: 'Feed posts, newest first.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          userId: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
          author: {
            id: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
            name: 'Avery Johnson',
            username: 'avery-1a2b3c',
            avatar: '',
            isVerified: false,
          },
          caption: 'A sunny afternoon by the coast.',
          images: ['https://cdn.example.com/photo.jpg'],
          likesCount: 3,
          commentsCount: 1,
          sharesCount: 0,
          createdAt: '2026-10-28T12:00:00.000Z',
          isLiked: false,
          isSaved: false,
          tags: ['weekend', 'coast'],
          visibility: 'public',
          comments: [],
        },
      ],
    },
  })
  getFeed(@Req() request: Request & { user: { id: string } }) {
    return this.postsService.getFeed(request.user.id);
  }

  @Get('me')
  @ApiOperation({ summary: 'List posts created by the authenticated user' })
  @ApiResponse({
    status: 200,
    description:
      'Posts created by the authenticated user; each item matches the feed post response shape.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          userId: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
          caption: 'A sunny afternoon by the coast.',
          images: [],
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          isLiked: false,
          isSaved: false,
          tags: [],
          visibility: 'public',
          comments: [],
        },
      ],
    },
  })
  getOwnPosts(@Req() request: Request & { user: { id: string } }) {
    return this.postsService.getOwnPosts(request.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({
    status: 201,
    description:
      'The created post, including author, media, counts, and visibility.',
    schema: {
      example: {
        id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
        userId: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
        author: {
          id: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
          name: 'Avery Johnson',
          username: 'avery-1a2b3c',
          avatar: '',
          isVerified: false,
        },
        caption: 'A sunny afternoon by the coast.',
        images: ['https://cdn.example.com/photo.jpg'],
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        createdAt: '2026-10-28T12:00:00.000Z',
        isLiked: false,
        isSaved: false,
        tags: ['weekend', 'coast'],
        visibility: 'public',
        comments: [],
      },
    },
  })
  create(
    @Body() dto: UpsertPostDto,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.postsService.create(request.user.id, dto);
  }

  @Patch(':postId')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the updated post resource; shape matches the create-post response.',
    schema: {
      example: {
        id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
        userId: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
        caption: 'A sunny afternoon by the coast.',
        images: ['https://cdn.example.com/photo.jpg'],
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        isLiked: false,
        isSaved: false,
        tags: ['weekend', 'coast'],
        visibility: 'public',
        comments: [],
      },
    },
  })
  update(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Body() dto: UpsertPostDto,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.postsService.update(postId, request.user.id, dto);
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted.',
    schema: { example: { deleted: true } },
  })
  remove(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.postsService.remove(postId, request.user.id);
  }

  @Put(':postId/like')
  @ApiOperation({ summary: 'Like or unlike a post' })
  @ApiResponse({
    status: 200,
    description: 'Updated like state and total likes.',
    schema: { example: { isLiked: true, likesCount: 12 } },
  })
  setLike(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Body() dto: SetPostLikeDto,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.postsService.setLike(postId, request.user.id, dto.isLiked);
  }

  @Put(':postId/save')
  @ApiOperation({ summary: 'Save or unsave a post' })
  @ApiResponse({
    status: 200,
    description: 'Updated save state.',
    schema: { example: { isSaved: true } },
  })
  setSave(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Body() dto: SetPostSaveDto,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.postsService.setSave(postId, request.user.id, dto.isSaved);
  }
}
