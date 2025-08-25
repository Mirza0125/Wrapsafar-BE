import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  role: string;

  @Prop({ default: '' })
  resetToken: string;

  @Prop({ default: '123456' })
  otp: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
