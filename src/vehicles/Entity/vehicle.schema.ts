import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/users/Entity/user.schema";

@Schema({ timestamps: true })
export class Vehicle extends Document {

  @Prop({ required: true, unique: true })
  vehicleNumber: string;

  @Prop({ required: true })
  vehicleOwner: string;

  @Prop({ required: true })
  licenseNumber: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
