import { Request } from 'express';
import { Vehicle } from '../Entity/vehicle.schema'; // Adjust the path if needed

export interface CustomRequest extends Request {
  user?: Vehicle;
}