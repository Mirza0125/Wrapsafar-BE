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
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>,) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<CustomRequest>();

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('A Bearer token is required for authentication.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Invalid Bearer token format.');
    }

    try {
      const secretKey = process.env.JWT_VERIFICATION_TOKEN_SECRET || '';

      const decodedRegister = jwt.verify(token, secretKey) as jwt.JwtPayload;

      if (!decodedRegister.exp) {
        throw new UnauthorizedException('Invalid token: Missing expiration time.');
      }

      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedRegister.exp < currentTime) {
        throw new UnauthorizedException('Token has expired.');
      }

      const register = await this.userModel.findOne({ email: decodedRegister.email });

      if (!register) {
        throw new UnauthorizedException('Register does not exist.');
      }

      req.user = register;
      return true;

    } catch (err) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
