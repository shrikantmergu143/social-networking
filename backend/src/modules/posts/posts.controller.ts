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

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getFeed(@Req() request: Request & { user: { id: string } }) {
    return this.postsService.getFeed(request.user.id);
  }

  @Get('me')
  getOwnPosts(@Req() request: Request & { user: { id: string } }) {
    return this.postsService.getOwnPosts(request.user.id);
  }

  @Post()
  create(
    @Body() dto: UpsertPostDto,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.postsService.create(request.user.id, dto);
  }

  @Patch(':postId')
  update(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Body() dto: UpsertPostDto,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.postsService.update(postId, request.user.id, dto);
  }

  @Delete(':postId')
  remove(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.postsService.remove(postId, request.user.id);
  }

  @Put(':postId/like')
  setLike(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Body() dto: SetPostLikeDto,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.postsService.setLike(postId, request.user.id, dto.isLiked);
  }

  @Put(':postId/save')
  setSave(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Body() dto: SetPostSaveDto,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.postsService.setSave(postId, request.user.id, dto.isSaved);
  }
}
