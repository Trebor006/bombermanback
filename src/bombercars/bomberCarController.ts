import { Body, Controller, Get, Post } from '@nestjs/common';
import { BomberCarsService } from './bomberCars.service';
import { CreateBombercarDto } from './dto/create-bombercar.dto';
import { UpdateBombercarPositionDto } from './dto/update-bombercar-position.dto';

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

  @Post('assign')
  assign(@Body() createBomberCarDto: CreateBombercarDto) {
    return this.bomberCarsService.create(createBomberCarDto);
  }

  @Get('obtenerSugerencia')
  obtenerSugerencia() {
    return this.bomberCarsService.obtenerSugerencia();
  }

  @Get()
  findAll() {
    return '';
  }
}
