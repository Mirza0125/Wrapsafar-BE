import * as crypto from 'crypto';

export interface OTPData {
  otp_code: string;
  expirationTime: number;
}

const OTP_LENGTH = 5;

const generateOTP = (): OTPData => {
  const otp_code: string = crypto
    .randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH)
    .toString();
  const expirationTime: number = addMinutesToDate(new Date(), 1);

  return { otp_code, expirationTime };
};

const checkOTPExpiry = (otp_expiry_time: number): boolean => {
  return new Date().getTime() <= otp_expiry_time;
};

function addMinutesToDate(date: Date, minutes: number): number {
  return date.getTime() + minutes * 60 * 1000;
}

export default { generateOTP, checkOTPExpiry };
