import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'fullName must be a string' })
  @IsNotEmpty({ message: 'fullName should not be empty' })
  fullName: string;

  @IsEmail({}, { message: 'email must be a valid email' })
  @IsNotEmpty({ message: 'email should not be empty' })
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password should not be empty' })
  password: string;

  @IsString({ message: 'phoneNumber must be a valid phone number' })
  @IsNotEmpty({ message: 'phoneNumber should not be empty' })
  phoneNumber: string;

  @IsString({ message: 'role must be a string' })
  @IsNotEmpty({ message: 'role should not be empty' })
  role: string;
}
