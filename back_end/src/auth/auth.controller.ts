import { Controller, Get, UseGuards, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: any) {
    // Guard handles the redirect
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @HttpCode(HttpStatus.OK)
  async googleAuthCallback(@Req() req: any) {
    return this.authService.googleLogin(req);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout() {
    return { message: 'Logged out successfully' };
  }
}
