import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import fs from 'fs';
import { VehicleService } from '../Service/vehicle.service';
import { CreateVehicleDto } from '../DTOs/vehicle.dto';
// import { UpdateRegisterDto } from '../DTOs/update-register-dto';
import { ResponseWrapper } from '../WrapperClasses/response.wrapper';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/users/Middleware/verifyToken.middleware';

@ApiTags('vehicles')
@Controller('vehicle/register')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Register a new vehicle' })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({ status: 201, description: 'Vehicle registered successfully' })
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @Req() req: any
  ): Promise<ResponseWrapper<any>> {
    const userId = req.user.sub || req.user._id;
    return this.vehicleService.create(createVehicleDto, userId);
  }

}
