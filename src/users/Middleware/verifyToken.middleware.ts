import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../Entity/user.schema';
import * as dotenv from 'dotenv';
import { CustomRequest } from '../Interface/request.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

dotenv.config();

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>,) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<CustomRequest>();

    const authHeader = req.headers.authorization;
    console.log('🔑 Incoming Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Token missing or wrong format');
      throw new UnauthorizedException('A Bearer token is required for authentication.');
    }

    const token = authHeader.split(' ')[1];
    console.log('🟢 Extracted Token:', token);

    try {
      const secretKey = process.env.JWT_VERIFICATION_TOKEN_SECRET || '';
      const decodedRegister = jwt.verify(token, secretKey) as jwt.JwtPayload;

      console.log('✅ Decoded Payload:', decodedRegister);

      const register = await this.userModel.findOne({ email: decodedRegister.email });
      console.log('👤 User from DB:', register);

      if (!register) {
        console.log('❌ No user found for decoded payload');
        throw new UnauthorizedException('Register does not exist.');
      }

      req.user = register;
      console.log('👍 User attached to request:', req.user.fullName);

      return true;
    } catch (err) {
      console.error('🚨 JWT verification failed:', err.message);
      throw new UnauthorizedException('Invalid Token');
    }
  }

}
