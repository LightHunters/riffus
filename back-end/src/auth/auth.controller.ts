import { Controller, Get, UseGuards, Req, HttpStatus, HttpCode, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  private readonly JWT_COOKIE_NAME = 'jwt';
  private readonly JWT_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };

  private setJwtCookie(res: Response, token: string): void {
    res.cookie(this.JWT_COOKIE_NAME, token, this.JWT_COOKIE_OPTIONS);
  }

  private clearJwtCookie(res: Response): void {
    res.clearCookie(this.JWT_COOKIE_NAME);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: any) {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @HttpCode(HttpStatus.OK)
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const result = await this.authService.googleLogin(req);
    if (result.access_token) { this.setJwtCookie(res, result.access_token); }
    return res.json(result);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    const user = await this.authService.signup(signupDto.email, signupDto.password, signupDto.name);
    this.setJwtCookie(res, user.access_token);
    return res.json(user);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
    const user = await this.authService.signin(signinDto.email, signinDto.password);
    this.setJwtCookie(res, user.access_token);
    return res.json(user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response) {
    this.clearJwtCookie(res);
    const result = this.authService.logout();
    return res.json(result);
  }
}
