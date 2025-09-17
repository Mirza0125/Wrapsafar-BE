import { CreateVehicleDto } from '../DTOs/vehicle.dto';
import { ResponseWrapper } from '../WrapperClasses/response.wrapper';

export interface VehicleServiceInterface {
  create(createVehicleDto: CreateVehicleDto, uuserId: string): Promise<ResponseWrapper<any>>; 
}
