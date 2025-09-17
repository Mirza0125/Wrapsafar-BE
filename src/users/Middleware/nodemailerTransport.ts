import * as dotenv from 'dotenv';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from '../Middleware/emailService';
// import { Register } from '../Entity/register.entity';

dotenv.config({ path: join(__dirname, '../.env') });

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    JwtModule.register({}),
    ConfigModule.forRoot(),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class NodemailerTransporter {}
