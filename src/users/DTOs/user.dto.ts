import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Zohaib Akhter' })
  @IsString({ message: 'fullName must be a string' })
  @IsNotEmpty({ message: 'fullName should not be empty' })
  fullName: string;

  @ApiProperty({ example: 'zohaib@example.com' })
  @IsEmail({}, { message: 'email must be a valid email' })
  @IsNotEmpty({ message: 'email should not be empty' })
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password should not be empty' })
  password: string;

  @ApiProperty({ example: '+923001234567' })
  @IsString({ message: 'phoneNumber must be a valid phone number' })
  @IsNotEmpty({ message: 'phoneNumber should not be empty' })
  phoneNumber: string;

  @ApiProperty({ example: 'user' })
  @IsString({ message: 'role must be a string' })
  @IsNotEmpty({ message: 'role should not be empty' })
  role: string;
}
