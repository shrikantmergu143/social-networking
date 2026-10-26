import { Body, Controller, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';
import { SetCommentLikeDto } from './dto/set-comment-like.dto';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body() dto: CreateCommentDto,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.commentsService.create(request.user.id, dto);
  }

  @Put(':commentId/like')
  setLike(
    @Req() request: Request & { user: { id: string } },
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
    @Body() body: SetCommentLikeDto,
  ) {
    return this.commentsService.setLike(request.user.id, commentId, body.isLiked);
  }
}
