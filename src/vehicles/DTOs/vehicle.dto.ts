import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 1234 })
  @IsNumber({}, { message: 'vehicleNumber must be a number' })
  @IsNotEmpty({ message: 'vehicleNumber should not be empty' })
  vehicleNumber: number;

  @ApiProperty({ example: 'Jazzy' })
  @IsString({ message: 'vehicleOwner must be a string' })
  @IsNotEmpty({ message: 'vehicleOwner should not be empty' })
  vehicleOwner: string;

  @ApiProperty({ example: 'ABC-1234' })
  @IsString({ message: 'licenseNumber must be a string' })
  @IsNotEmpty({ message: 'licenseNumber should not be empty' })
  licenseNumber: string;
}