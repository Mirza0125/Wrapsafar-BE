import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CreateVehicleDto } from '../DTOs/vehicle.dto';
import { VehicleServiceInterface } from '../Interface/vehicle.interface';
import { ResponseWrapper } from '../WrapperClasses/response.wrapper';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from '../Entity/vehicle.schema';

@Injectable()
export class VehicleService implements VehicleServiceInterface {
  constructor(
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<Vehicle>,
  ) { }

  // Create a new vehicle
  async create(createVehicleDto: CreateVehicleDto, userId: string): Promise<ResponseWrapper<any>> {

    const newVehicle = new this.vehicleModel({...createVehicleDto, user: userId});
    
    const savedResult = await newVehicle.save();

    if (!savedResult) {
      throw new UnauthorizedException('Vehicle not registered.');
    }
    return new ResponseWrapper(201, 'Vehicle created successfully', savedResult);
  }

}
