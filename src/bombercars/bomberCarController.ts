import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BomberCarsService } from './bomberCars.service';
import { CreateBombercarDto } from './dto/create-bombercar.dto';
import { UpdateBombercarPositionDto } from './dto/update-bombercar-position.dto';
import { BindTokenBombercarDto } from './dto/bind-token-bombercar.dto';
import { BombercarEmergencySolvedDto } from './dto/bombercar-emergency-solved.dto';

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
    console.log('current-position ' + bomberCarId);

    const bombercarhistory =
      await this.bomberCarsService.currentPosition(bomberCarId);

    return bombercarhistory;
  }

  @Post('register-token')
  async bindToken(@Body() bindTokenBombercarDto: BindTokenBombercarDto) {
    console.log('bindToken ' + JSON.stringify(bindTokenBombercarDto));

    return await this.bomberCarsService.bindToken(bindTokenBombercarDto);
  }

  @Get('revisar-asignacion')
  revisarEmergenciaAsignada(@Query('bomberCarId') bomberCarId: string) {
    return this.bomberCarsService.revisarAsignacion(bomberCarId);
  }

  @Post('emergencia-solucionada')
  emergenciaSolucionada(
    @Body() bombercarEmergencySolvedDto: BombercarEmergencySolvedDto,
  ) {
    return this.bomberCarsService.emergenciaSolucionada(
      bombercarEmergencySolvedDto.bomberCarId,
    );
  }
}
