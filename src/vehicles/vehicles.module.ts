import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { VehicleController } from '../vehicles/Controller/vehicle.controller';
import { VehicleService } from '../vehicles/Service/vehicle.service';
import { Vehicle, VehicleSchema } from '../vehicles/Entity/vehicle.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/users/Middleware/verifyToken.middleware';
import { User, UserSchema } from 'src/users/Entity/user.schema';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }, { name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [VehicleController],
  providers: [
    VehicleService,
    JwtAuthGuard,
  ],
  exports: [VehicleService, JwtAuthGuard],
})
export class VehicleModule {}
