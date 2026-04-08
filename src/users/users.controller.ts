import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  Req,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GuestLoginDto } from './dto/guest-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserPreferencesDto } from './dto/user-preferences.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { AddStampsDto } from './dto/add-stamps.dto';
import { GoogleLoginDto } from './dto/google-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @Post('guest-login')
  async guestLogin(@Body() guestLoginDto: GuestLoginDto) {
    return this.userService.guestLogin(guestLoginDto);
  }

  @Post('google-login')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    return this.userService.googleEmailLogin(googleLoginDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.userService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.userService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() ForgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(ForgotPasswordDto);
  }

  @Post('change-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(changePasswordDto);
  }

  @Patch(':userId/settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateUserPreferences(
    @Param('userId') userId: string,
    @Body() userPreferencesDto: UserPreferencesDto,
  ) {
    return this.userService.patchUserPreferences(userId, userPreferencesDto);
  }

  @Get(':userId/settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserSettings(@Param('userId') userId: string) {
    return this.userService.getUserSettings(userId);
  }

  @Post(':userId/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logoutUser(@Param('userId') userId: string) {
    return this.userService.logoutUser(userId);
  }

  @Patch(':userId/edit-profile')
  async editProfile(
    @Param('userId') userId: string,
    @Body() editProfileDto: EditProfileDto,
  ) {
    console.log('userId', userId);
    return this.userService.editProfile(userId, editProfileDto);
  }

  @Patch(':userId/add-stamps')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addStamps(
    @Param('userId') userId: string,
    @Body() addStampsDto: AddStampsDto,
  ) {
    return this.userService.addStamps(userId, addStampsDto.count);
  }

  @Patch(':userId/remove-stamps')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removeStamps(
    @Param('userId') userId: string,
    @Body() addStampsDto: AddStampsDto,
  ) {
    return this.userService.removeStamps(userId, addStampsDto.count);
  }
}
