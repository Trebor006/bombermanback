import { Body, Controller, Get, Post } from '@nestjs/common';
import { BomberCarsService } from './bomberCars.service';
import { CreateBombercarDto } from './dto/create-bombercar.dto';
import { UpdateBombercarPositionDto } from './dto/update-bombercar-position.dto';

@Controller('bombercars')
export class BomberCarController {
  constructor(private readonly bomberCarsService: BomberCarsService) {}

  @Post()
  async create(@Body() createAmbulanciaDto: CreateBombercarDto) {
    const ambulancia = await this.bomberCarsService.create(createAmbulanciaDto);

    return ambulancia;
  }

  @Post('updateposition')
  async updateposition(
    @Body() updateAmbulanciaUbicacionDto: UpdateBombercarPositionDto,
  ) {
    const position = await this.bomberCarsService.updateposition(
      updateAmbulanciaUbicacionDto,
    );

    return position;
  }

  @Post('assign')
  assign(@Body() createAmbulanciaDto: CreateBombercarDto) {
    return this.bomberCarsService.create(createAmbulanciaDto);
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
