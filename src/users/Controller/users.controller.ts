import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import fs from 'fs';
import { UserService } from '../Service/users.service';
import { CreateUserDto } from '../DTOs/user.dto';
// import { UpdateRegisterDto } from '../DTOs/update-register-dto';
import { ResponseWrapper } from '../WrapperClasses/response.wrapper';
import generateOTP from '../Middleware/otp.middleware';
import { JwtAuthGuard } from '../Middleware/verifyToken.middleware';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../DTOs/userUpdate.dto';

@ApiTags('users')
@Controller('register')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async findAll(@Req() req: any): Promise<ResponseWrapper<any>> {
    console.log('🔥 Inside findAll() | Authenticated User:', req.user);
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string, @Req() req: any): Promise<ResponseWrapper<any>> {
    console.log('🔑 Authorization header from Swagger:', req.headers.authorization);
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto }) // 👈 tells Swagger what body to expect
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseWrapper<any>> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseWrapper<any>> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async remove(@Param('id') id: string): Promise<ResponseWrapper<any>> {
    return this.userService.remove(id);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'zohaib123' },
        password: { type: 'string', example: 'P@ssw0rd' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() body: { fullName: string; password: string }) {
    const { fullName, password } = body;
    return await this.userService.login(fullName, password); // Return wrapped dynamic response
  }

  // @Post('firebase-login')
  // async loginWithFirebase(
  //   @Body('idToken') idToken: string,
  // ): Promise<ResponseWrapper<any>> {
  //   return this.userService.loginWithFirebase(idToken);
  // }

  @Post('sendOTP')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send OTP to user email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'zohaib@example.com' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async OTP(
    @Body() { email }: { email: string },
  ): Promise<ResponseWrapper<any>> {
    const otpi = generateOTP;
    const otp = otpi.generateOTP();
    return this.userService.sendOTP(email, otp);
  }

  @Post('forgotpassword')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        otp: { type: 'string', example: '123456' },
        password: { type: 'string', example: 'NewP@ssw0rd' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or request' })
  async forgotPassword(
    @Body() body: { otp: string; password: string },
  ): Promise<ResponseWrapper<any>> {
    const { otp, password } = body;
    return this.userService.forgotPassword(otp, password);
  }
}
