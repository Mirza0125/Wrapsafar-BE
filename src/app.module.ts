import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleModule } from './vehicles/vehicles.module';
// import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:3cFjdk8H9N4gjpse@cluster0.uaccghk.mongodb.net/WrapSafar?retryWrites=true&w=majority&appName=Cluster0'),
    UserModule,
    VehicleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
