import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

type AuthRequest = Request & {
  user: { id: string; email: string };
};

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiResponse({
    status: 201,
    description:
      'Account created; returns a bearer token and public user profile.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        tokenType: 'Bearer',
        expiresIn: '15m',
        user: {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          username: 'avery-1a2b3c',
          fullName: 'Avery Johnson',
          email: 'avery@example.com',
        },
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('login')
  @ApiOperation({ summary: 'Log in and receive an access token' })
  @ApiResponse({
    status: 200,
    description: 'Returns a bearer token and public user profile.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        tokenType: 'Bearer',
        expiresIn: '15m',
        user: {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          username: 'avery-1a2b3c',
          fullName: 'Avery Johnson',
          email: 'avery@example.com',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Public profile for the authenticated user.',
    schema: {
      example: {
        id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
        username: 'avery-1a2b3c',
        fullName: 'Avery Johnson',
        email: 'avery@example.com',
        gender: 'woman',
        location: 'Portland, OR',
        avatar: '',
        coverImage: '',
        isVerified: false,
        isOnline: true,
      },
    },
  })
  me(@Req() req: AuthRequest) {
    return this.authService.getUserDetails(req.user.id);
  }

  @Delete('session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'End the authenticated session' })
  @ApiResponse({
    status: 200,
    description: 'Session ended.',
    schema: { example: { loggedOut: true } },
  })
  logout(@Req() req: AuthRequest) {
    return this.authService.logout(req.user.id);
  }
}
