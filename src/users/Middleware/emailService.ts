import * as dotenv from 'dotenv';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../Entity/user.schema';
import * as nodemailer from 'nodemailer';
import generateOTP from './otp.middleware';

import { ResponseWrapper } from '../WrapperClasses/response.wrapper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
dotenv.config();

@Injectable()
export class EmailService {
  private nodemailerTransport: any;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.nodemailerTransport = nodemailer.createTransport({
      host: 'smtp.yandex.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.nodemailerTransport.verify((error: any, success: any) => {
      if (error) {
        console.error('SMTP Connection Error:', error);
      } else {
        console.log('SMTP Connection Verified');
      }
    });
  }

  async sendResetPasswordEmail(
    email: string,
    otp: string,
  ): Promise<ResponseWrapper<any>> {
    // const otpi = generateOTP;
    // const otp = otpi.generateOTP();

    if (!email) {
      throw new UnauthorizedException('Email is required');
    }

    // Check if the user exists
    // const user = await this.userModel.findOne({ email });

    // if (!user) {
    //   throw new UnauthorizedException('User not found');
    // }

    // Generate JWT token
    // const payload = { email };
    // const token = this.jwtService.sign(payload, {
    //   secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
    //   expiresIn: parseInt(
    //     process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME || '0',
    //     10,
    //   ),
    // });

    // Save the reset token in the user's record
    // user.resetToken = token;
    // await user.save();

    // Construct the reset URL
    const html = `<div
              class="container"
              style="max-width: 90%; margin: auto; padding-top: 20px"
            >
              <h2>Welcome to the club.</h2>
              <h4>You are officially In ✔</h4>
              <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
              <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
              <p style="margin-top:50px;">If you do not request for verification please do not respond to the mail. You can in turn un subscribe to the mailing list and we will never bother you again.</p>
            </div>`;

    // Send the email
    try {
      const emailResult = await this.nodemailerTransport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Password',
        html,
      });

      return new ResponseWrapper(200, 'Email sent successfully', emailResult);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new UnauthorizedException('Failed to send email');
    }
  }
}
