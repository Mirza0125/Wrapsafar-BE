import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './user.dto';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString({ message: 'fullName must be a string' })
  @IsOptional()
  fullName?: string;

  @IsEmail({}, { message: 'email must be a valid email' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'password must be a string' })
  @IsOptional()
  password?: string;

  @IsString({ message: 'phoneNumber must be a valid phone number' })
  @IsOptional()
  phoneNumber?: string;

  @IsString({ message: 'role must be a string' })
  @IsOptional()
  role?: string;
}
