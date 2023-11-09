import { Body, Controller, Get, Post } from '@nestjs/common';
import { TipoSolicitudService } from './tipo-solicitud.service';
import { CreateTipoSolicitudDto } from './dto/create-tipo-solicitud.dto';

@Controller('tipo-solicitudes')
export class TipoSolicitudController {
  constructor(private readonly tipoDenunciasService: TipoSolicitudService) {}

  @Post('registrar')
  crear(@Body() createTipoDenunciaDto: CreateTipoSolicitudDto) {
    return this.tipoDenunciasService.registrar(createTipoDenunciaDto);
  }

  @Get()
  obtenerRegistros() {
    return this.tipoDenunciasService.obtenerRegistros();
  }
  //
  // @Get('porDepartamento')
  // buscarTipoDenuncias(@Query('departamento') departamento: string) {
  //   return this.tipoDenunciasService.obtenerRegistrosFiltrados(departamento);
  // }
  //
  // @Get('buscar')
  // async buscar(@Query('id') id: string) {
  //   const tipoDenuncia = await this.tipoDenunciasService.buscar(id);
  //
  //   return tipoDenuncia;
  // }
}
