import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

import { UserController } from '../users/Controller/users.controller';
import { UserService } from '../users/Service/users.service';
import { User, UserSchema } from '../users/Entity/user.schema';
import { EmailService } from './Middleware/emailService';
import { NodemailerTransporter } from './Middleware/nodemailerTransport';
import { JwtAuthGuard } from './Middleware/verifyToken.middleware';
import { MongooseModule } from '@nestjs/mongoose';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    EmailService,
    NodemailerTransporter,
    JwtAuthGuard,
    {
      provide: 'NODEMAILER_TRANSPORT',
      useValue: nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      }),
    },
  ],
  exports: [UserService, EmailService, JwtAuthGuard],
})
export class UserModule {}
