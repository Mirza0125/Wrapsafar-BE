import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../Entity/user.schema';
import { CreateUserDto } from '../DTOs/user.dto';
import { UserServiceInterface } from '../Interface/user.interface';
import { ResponseWrapper } from '../WrapperClasses/response.wrapper';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../Middleware/emailService';
import { OTPData } from '../Middleware/otp.middleware';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {}

  // Find all users
  async findAll(): Promise<ResponseWrapper<any>> {
    const result = await this.userModel.find().exec();
    if (!result || result.length === 0) {
      throw new UnauthorizedException('No record found.');
    }
    return new ResponseWrapper(200, 'Success', result);
  }

  // Find a single user by ID
  async findOne(id: string): Promise<ResponseWrapper<any>> {
    const result = await this.userModel.findById(id).exec();
    if (!result) {
      throw new UnauthorizedException('No record found with the provided ID');
    }
    return new ResponseWrapper(200, 'Success', result);
  }

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<ResponseWrapper<any>> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    createUserDto.password = hashedPassword;

    const newUser = new this.userModel(createUserDto);
    const savedResult = await newUser.save();
    console.log("data==>", savedResult)

    if (!savedResult) {
      throw new UnauthorizedException('User not registered.');
    }
    return new ResponseWrapper(201, 'User created successfully', savedResult);
  }

  // Remove a user
  async remove(id: string): Promise<ResponseWrapper<any>> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new UnauthorizedException('No record found with the provided ID');
    }
    return new ResponseWrapper(200, 'Success', result);
  }

  // Login
  async login(fullName: string, password: string): Promise<ResponseWrapper<any>> {
    const result = await this.userModel.findOne({ fullName }).exec();
    if (!result || !(await bcrypt.compare(password, result.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: result.fullName, sub: result._id };
    const access_token = jwt.sign(
      payload,
      process.env.JWT_VERIFICATION_TOKEN_SECRET || 'fallback_secret',
      { expiresIn: '1h' },
    );

    return new ResponseWrapper(200, 'Login successful', result, access_token);
  }

  // Send OTP
  async sendOTP(email: string, otp: OTPData): Promise<ResponseWrapper<any>> {
    const result = await this.userModel.findOne({ email }).exec();
    if (!result) {
      throw new ResponseWrapper(400, `No user found for email: ${email}`, null);
    }

    await this.userModel.updateOne({ email }, { otp: otp.otp_code }).exec();
    return await this.emailService.sendResetPasswordEmail(email, otp.otp_code);
  }

  // Forgot Password
  async forgotPassword(otp: string, password: string): Promise<ResponseWrapper<any>> {
    const data = await this.userModel.findOne({ otp }).exec();
    if (!data) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await this.userModel.updateOne(
      { otp },
      { password: hashedPassword, otp: null }, // clear OTP after use
    ).exec();

    return new ResponseWrapper(200, 'Password reset successful', result);
  }
}
