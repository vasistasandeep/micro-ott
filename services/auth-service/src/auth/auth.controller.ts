import { Controller, Post, Get, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('profiles')
  async getProfiles(@Headers('x-user-id') userId: string) {
    return this.authService.getProfiles(userId);
  }

  @Post('profiles')
  async createProfile(
    @Headers('x-user-id') userId: string,
    @Body() body: { name: string; languagePreference?: string },
  ) {
    return this.authService.createProfile(userId, body.name, body.languagePreference);
  }

  @Put('profiles/:id')
  async updateProfile(@Param('id') profileId: string, @Body() updates: any) {
    return this.authService.updateProfile(profileId, updates);
  }

  @Delete('profiles/:id')
  async deleteProfile(@Param('id') profileId: string) {
    return this.authService.deleteProfile(profileId);
  }
}
