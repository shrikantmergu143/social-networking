import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';

@Controller('stories')
@UseGuards(JwtAuthGuard)
export class StoriesController {
  constructor(private readonly stories: StoriesService) {}

  @Get()
  list(@Req() request: any) {
    return this.stories.list(request.user.id);
  }

  @Post()
  create(@Req() request: any, @Body() body: CreateStoryDto) {
    return this.stories.create(request.user.id, body);
  }

  @Post(':itemId/view')
  view(@Req() request: any, @Param('itemId', new ParseUUIDPipe()) itemId: string) {
    return this.stories.view(request.user.id, itemId);
  }
}
