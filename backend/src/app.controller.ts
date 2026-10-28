import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check that the API is running' })
  @ApiResponse({
    status: 200,
    description: 'API health response.',
    schema: { type: 'string', example: 'Hello World!' },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
