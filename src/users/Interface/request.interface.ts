import { Request } from 'express';
import { User } from '../Entity/user.schema'; // Adjust the path if needed

export interface CustomRequest extends Request {
  user?: User;
}