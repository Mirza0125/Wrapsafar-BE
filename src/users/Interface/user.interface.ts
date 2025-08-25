import { CreateUserDto } from '../DTOs/user.dto';
import { ResponseWrapper } from '../WrapperClasses/response.wrapper';

export interface UserServiceInterface {
  findAll(): Promise<ResponseWrapper<any>>;
  findOne(id: string): Promise<ResponseWrapper<any>>;
  create(createUserDto: CreateUserDto): Promise<ResponseWrapper<any>>; 
  remove(id: string): Promise<ResponseWrapper<any>>;
  login(fullName: string, password:string): Promise<ResponseWrapper<any>>
}
