import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';
import { SetCommentLikeDto } from './dto/set-comment-like.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiTags('Comments')
@ApiBearerAuth('JWT-auth')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiResponse({
    status: 201,
    description: 'The created comment.',
    schema: {
      example: {
        id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
        postId: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
        userId: 'b6f80f10-961a-4518-bb24-c9258cfbc6d8',
        userName: 'Avery Johnson',
        userAvatar: '',
        userVerified: false,
        text: 'This is such a great photo!',
        createdAt: '2026-10-28T12:00:00.000Z',
        likesCount: 0,
      },
    },
  })
  create(
    @Body() dto: CreateCommentDto,
    @Req() request: Request & { user: { id: string } },
  ) {
    return this.commentsService.create(request.user.id, dto);
  }

  @Put(':commentId/like')
  @ApiOperation({ summary: 'Like or unlike a comment' })
  @ApiResponse({
    status: 200,
    description: 'Updated like state and total likes.',
    schema: { example: { isLiked: true, likesCount: 4 } },
  })
  setLike(
    @Req() request: Request & { user: { id: string } },
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
    @Body() body: SetCommentLikeDto,
  ) {
    return this.commentsService.setLike(
      request.user.id,
      commentId,
      body.isLiked,
    );
  }
}
