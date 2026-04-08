import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { SendOtpDto } from './dto/send-otp.dto';
import { GuestLoginDto } from './dto/guest-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserPreferencesDto } from './dto/user-preferences.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { GoogleLoginDto } from './dto/google-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async signup(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.prisma.users.findUnique({
        where: { email: createUserDto.email },
        include: { avatar: { select: { image: true } } },
      });

      if (existingUser) {
        if (existingUser.isDeleted) {
          const updatedUser = await this.prisma.users.update({
            where: { email: createUserDto.email },
            data: {
              isDeleted: false,
              password: await bcrypt.hash(createUserDto.password, 10),
              firstName: createUserDto.firstName,
              lastName: createUserDto.lastName,
              phoneNumber:
                createUserDto.phoneNumber ?? existingUser.phoneNumber,
              fcmToken: createUserDto.fcmToken ?? existingUser.fcmToken,
              avatarId: createUserDto.avatarId ?? existingUser.avatarId,
              availableStamps: createUserDto.availableStamps ?? 0,
              isGuest: false, // ensure it's marked as full user,
            },
            include: { avatar: { select: { image: true } } },
          });

          return {
            ...updatedUser,
            avatarImage: updatedUser.avatar?.image || null,
          };
        }

        throw new ConflictException('User with this email already exists.');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = await this.prisma.users.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
          isDeleted: false,
        },
        include: { avatar: { select: { image: true } } },
      });

      // await this.prisma.userSettings.create({
      //   data: {
      //     userId: newUser.id,
      //     notifications: true,
      //     sound: true,
      //     music: true,
      //   },
      // });

      const { password: _, ...userData } = newUser;
      return {
        jwtToken: newUser.isVerified ? this.generateToken(newUser) : '',
        ...userData,
        avatarImage: newUser.avatar?.image || null,
      };
    } catch (error) {
      console.error('Signup Error:', error);
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email: loginUserDto.email },
        include: {
          avatar: true,
        },
      });

      if (!user || user.isDeleted) {
        throw new UnauthorizedException(
          'Invalid credentials or user does not exist.',
        );
      }

      const isPasswordValid = await bcrypt.compare(
        loginUserDto.password,
        user.password ?? 'NA',
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const { password: _, avatar, ...userData } = user;

      return {
        jwtToken: userData.isVerified ? this.generateToken(userData) : '',
        avatarImage: avatar?.image || null, // Return the avatar image
        ...userData,
      };
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
      });

      if (!user || user.isDeleted) {
        throw new NotFoundException('User not found or already deleted.');
      }

      await this.prisma.$transaction([
        // 1. Soft delete user
        this.prisma.users.update({
          where: { id },
          data: {
            isDeleted: true,
            isVerified: false,
            availableStamps: 0, // 2. Reset stamps
          },
        }),

        // 3. Delete bookmarked questions
        this.prisma.bookmarkedQuestion.deleteMany({
          where: {
            userId: id,
          },
        }),

        // 4. Delete user question history
        this.prisma.userQuestionHistory.deleteMany({
          where: {
            userId: id,
          },
        }),
      ]);

      return 'User successfully deleted.';
    } catch (error) {
      console.error('Delete User Error:', error);
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id, isDeleted: false },
        select: {
          id: true,
          totalQuizPlayed: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          fcmToken: true,
          avatarId: true,
          availableStamps: true,
          isVerified: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          avatar: {
            select: {
              image: true, // Fetch only the avatar image
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        ...user,
        totalPlayQuiz: user.totalQuizPlayed,
        avatarImage: user.avatar?.image || null, // Return avatar image separately
      };
    } catch (error) {
      console.error('Get User By ID Error:', error);
      throw error;
    }
  }

  private generateToken(user: object) {
    const payload = { sub: user };
    return this.jwtService.sign(payload);
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    try {
      const { email } = sendOtpDto;

      // Find user by email
      const user = await this.prisma.users.findUnique({ where: { email } });

      if (!user) {
        throw new NotFoundException('User with this email not found');
      }

      const otp = crypto.randomInt(1000, 9999).toString();
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

      await this.prisma.users.update({
        where: { email },
        data: { otp, otpExpiry },
      });

      await this.sendEmail(email, otp);

      return 'OTP sent successfully to your email!';
    } catch (error) {
      console.error('Get Unique Questions Error:', error);
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email },
        select: { otp: true, otpExpiry: true },
      });

      if (!user || !user.otp || user.otp !== otp) {
        throw new NotFoundException('Invalid OTP.');
      }

      if (user.otpExpiry && new Date() > user.otpExpiry) {
        throw new NotFoundException('OTP has expired.');
      }

      await this.prisma.users.update({
        where: { email },
        data: { isVerified: true },
      });

      return 'OTP verified successfully!';
    } catch (error) {
      console.error('Verify OTP Error:', error);
      throw error;
    }
  }

  private async sendEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: '🔐 Your GK Quiz OTP Code',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #4B0082;">🎓 GK Quiz</h2>
          <p style="font-size: 16px; color: #333;">Hello there!</p>
          <p style="font-size: 16px; color: #333;">
            Your one-time password (OTP) to access your GK Quiz account is:
          </p>
          <div style="font-size: 24px; font-weight: bold; color: #fff; text-align: center; background: #4B0082; padding: 15px; margin: 20px 0; border-radius: 8px;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #666;">⚠️ This code will expire in 10 minutes. Please do not share it with anyone.</p>
          <p style="font-size: 14px; color: #666;">If you didn't request this OTP, you can safely ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #aaa;">Thanks for using GK Quiz!<br>The GK Quiz Team</p>
        </div>
      `,
    };

    console.log('mail options', mailOptions);
    await transporter.sendMail(mailOptions);
  }

  async guestLogin(guestLoginDto: GuestLoginDto) {
    try {
      const { deviceId, firstName } = guestLoginDto;

      let guestUser = await this.prisma.users.findUnique({
        where: { deviceId },
      });

      if (!guestUser) {
        guestUser = await this.prisma.users.create({
          data: {
            deviceId,
            firstName,
            isGuest: true,
            avatarId: 1,
            isVerified: true
          },
        });
      } else {
        guestUser = await this.prisma.users.update({
          where: { deviceId },
          data: {
            firstName,
            isVerified: true,
            isDeleted: false
          },
        });
      }

      const jwtToken = this.generateToken({ id: guestUser.id, deviceId });

      return { jwtToken, ...guestUser };
    } catch (error) {
      console.error('Guest Login Error:', error);
      throw error;
    }
  }

  async forgotPassword(ForgotPasswordDto: ForgotPasswordDto) {
    const { email, otp, newPassword } = ForgotPasswordDto;

    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.otp || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      throw new BadRequestException('OTP has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.users.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiry: null,
      },
    });

    return 'Password changed successfully!';
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: changePasswordDto.userId },
        select: { password: true },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const isMatch = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password ?? 'NA',
      );
      if (!isMatch) {
        throw new BadRequestException('Old password is incorrect.');
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );

      await this.prisma.users.update({
        where: { id: changePasswordDto.userId },
        data: { password: hashedPassword },
      });

      return 'Password changed successfully!';
    } catch (error) {
      console.error('Change Password Error:', error);
      throw error;
    }
  }

  async patchUserPreferences(
    userId: string,
    preferencesDto: Partial<UserPreferencesDto>,
  ) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const updatedPreferences = await this.prisma.userSettings.update({
        where: { userId },
        data: preferencesDto,
      });

      return {
        message: 'User preferences updated successfully!',
        updatedPreferences,
      };
    } catch (error) {
      console.error('Update User Preferences Error:', error);
      throw error;
    }
  }

  async getUserSettings(userId: string) {
    try {
      let userSettings = await this.prisma.userSettings.findUnique({
        where: { userId },
      });

      if (!userSettings) {
        userSettings = await this.prisma.userSettings.create({
          data: {
            userId,
            notifications: true,
            sound: true,
            music: true,
          },
        });
      }

      return userSettings;
    } catch (error) {
      console.error('Get User Settings Error:', error);
      throw error;
    }
  }

  async logoutUser(userId: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      await this.prisma.users.update({
        where: { id: userId },
        data: { fcmToken: null },
      });

      return 'User logged out successfully!';
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  }

  async editProfile(userId: string, editProfileDto: EditProfileDto) {
    try {
      console.log('userId', userId);
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
        include: { avatar: { select: { image: true } } },
      });

      if (!user || user.isDeleted) {
        throw new NotFoundException('User not found or has been deleted.');
      }

      const updatedUser = await this.prisma.users.update({
        where: { id: userId },
        data: {
          firstName: editProfileDto.firstName ?? user.firstName,
          lastName: editProfileDto.lastName ?? user.lastName,
          phoneNumber: editProfileDto.phoneNumber ?? user.phoneNumber,
          avatarId: editProfileDto.avatarId ?? user.avatarId,
          // fcmToken: editProfileDto.fcmToken ?? user.fcmToken,
        },
        include: { avatar: { select: { image: true } } },
      });

      const { password: _, ...userData } = updatedUser;

      return {
        ...userData,
        avatarImage: updatedUser.avatar?.image || null,
      };
    } catch (error) {
      console.error('Edit Profile Error:', error);
      throw error;
    }
  }

  async addStamps(userId: string, count: number, description?: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user || user.isDeleted) {
        throw new NotFoundException('User not found or is deleted.');
      }

      const updatedUser = await this.prisma.users.update({
        where: { id: userId },
        data: {
          availableStamps: { increment: count },
        },
      });

      await this.prisma.stampTransaction.create({
        data: {
          userId,
          type: 'ADD',
          count,
          description: description ?? 'Stamps added',
        },
      });

      return updatedUser.availableStamps;
    } catch (error) {
      console.error('Add Stamps Error:', error);
      throw error;
    }
  }

  async removeStamps(userId: string, count: number, description?: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user || user.isDeleted) {
        throw new NotFoundException('User not found or is deleted.');
      }

      if ((user.availableStamps ?? 0) < count) {
        throw new BadRequestException('Not enough stamps to remove.');
      }

      const updatedUser = await this.prisma.users.update({
        where: { id: userId },
        data: {
          availableStamps: { decrement: count },
        },
      });

      await this.prisma.stampTransaction.create({
        data: {
          userId,
          type: 'REMOVE',
          count,
          description: description ?? 'Stamps removed',
        },
      });

      return updatedUser.availableStamps;
    } catch (error) {
      console.error('Remove Stamps Error:', error);
      throw error;
    }
  }

  async googleEmailLogin(googleLoginDto: GoogleLoginDto) {
    try {
      const { email, firstName } = googleLoginDto;

      let googleUser = await this.prisma.users.findUnique({
        where: { email, },
      });

      if (!googleUser) {
        googleUser = await this.prisma.users.create({
          data: {
            email,
            firstName,
            isGoogleUser: true,
            avatarId: 1,
            isVerified: true
          },
        });
      } else {
        googleUser = await this.prisma.users.update({
          where: { email },
          data: {
            isDeleted: false,
            firstName,
            isVerified: true
          },
        });
      }

      const jwtToken = this.generateToken({
        id: googleUser.id,
        email,
        firstName,
      });

      return { jwtToken, ...googleUser };
    } catch (error) {
      console.error('Google Login Error:', error);
      throw error;
    }
  }
}
