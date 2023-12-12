import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BomberCarsService } from './bomberCars.service';
import { CreateBombercarDto } from './dto/create-bombercar.dto';
import { UpdateBombercarPositionDto } from './dto/update-bombercar-position.dto';
import { AssignBomberCarDto } from './dto/assign-bombercar.dto';
import { BindTokenBombercarDto } from './dto/bind-token-bombercar.dto';

@Controller('bombercars')
export class BomberCarController {
  constructor(private readonly bomberCarsService: BomberCarsService) {}

  @Post()
  async create(@Body() createBomberCarDto: CreateBombercarDto) {
    const bomberCar = await this.bomberCarsService.create(createBomberCarDto);

    return bomberCar;
  }

  @Post('updateposition')
  async updateposition(
    @Body() updateBomberCarUbicacionDto: UpdateBombercarPositionDto,
  ) {
    const position = await this.bomberCarsService.updateposition(
      updateBomberCarUbicacionDto,
    );

    return position;
  }

  @Get('obtenerSugerencia')
  obtenerSugerencia() {
    return this.bomberCarsService.obtenerSugerencia();
  }

  @Get()
  findAll() {
    return this.bomberCarsService.listar();
  }

  @Get('buscar')
  async buscar(@Query('id') id: string) {
    const bombercar = await this.bomberCarsService.buscar(id);

    return bombercar;
  }

  @Get('position-history')
  async positionHistory(
    @Query('bomberCarId') bomberCarId: string,
    @Query('initialDate') initialDate: string,
  ) {
    const bombercarhistory = await this.bomberCarsService.positionHistory(
      bomberCarId,
      initialDate,
    );

    return bombercarhistory;
  }

  @Get('current-position')
  async currentPosition(@Query('bomberCarId') bomberCarId: string) {
    const bombercarhistory =
      await this.bomberCarsService.currentPosition(bomberCarId);

    return bombercarhistory;
  }

  @Get('register-token')
  async bindToken(@Body() bindTokenBombercarDto: BindTokenBombercarDto) {
    return await this.bomberCarsService.bindToken(bindTokenBombercarDto);
  }
}
