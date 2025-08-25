export class ResponseWrapper<T> {
    statusCode: number;
    message: string;
    data: T;
    token?: string;
  
    constructor(statusCode: number, message: string, data: T,  token?: string) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      if (token) {
        this.token = token;
      }
    }
  }
  