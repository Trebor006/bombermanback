import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TipoEmergenciaService } from './tipo-emergencia.service';
import { CreateTipoEmergenciaDto } from './dto/create-tipo-emergencia.dto';

@Controller('tipo-emergencias')
export class TipoEmergenciaController {
  constructor(private readonly tipoEmergenciasService: TipoEmergenciaService) {}

  @Post('registrar')
  crear(@Body() createTipoEmergenciaDto: CreateTipoEmergenciaDto) {
    return this.tipoEmergenciasService.registrar(createTipoEmergenciaDto);
  }

  @Get()
  obtenerRegistros(@Query('lastTimeModified') lastTimeModified: string) {
    return this.tipoEmergenciasService.obtenerRegistros(lastTimeModified);
  }

  @Get('porDepartamento')
  buscarTipoEmergencias(@Query('departamento') departamento: string) {
    return this.tipoEmergenciasService.obtenerRegistrosFiltrados(departamento);
  }

  @Get('buscar')
  async buscar(@Query('id') id: string) {
    const tipoEmergencia = await this.tipoEmergenciasService.buscar(id);

    return tipoEmergencia;
  }
}
