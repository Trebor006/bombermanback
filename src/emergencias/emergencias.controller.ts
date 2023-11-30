import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmergenciasService } from './emergencias.service';
import { CrearEmergenciaRequestDto } from './dto/crear-emergencia.request.dto';
import { EmergenciasValidatorService } from './emergencias.validator.service';
import { CancelarEmergenciaRequestDto } from './dto/cancelar-emergencia.request.dto';
import { ActualizarEstadoEmergenciaRequestDto } from './dto/actualizar-estado-emergencia.request.dto';
import { AgregarComentarioEmergenciaRequestDto } from './dto/agregar-comentario-emergencia.request.dto';
import { ActualizarDepartamentoEmergenciaRequestDto } from './dto/actualizar-departamento-emergencia.request.dto';
import { SyncFilePartRequestDto } from './dto/sync-filepart.request.dto';
import { JoinFilePartRequestDto } from './dto/join-filepart.request.dto';

@Controller('emergencias')
export class EmergenciasController {
  constructor(
    private readonly emergenciasService: EmergenciasService,
    private readonly emergenciasValidatorService: EmergenciasValidatorService,
  ) {}

  convertirCadenaAArray(cadena: string): string[] {
    return JSON.parse(cadena.replace(/\\/g, ''));
  }

  @Post()
  async crear(@Body() crearEmergenciaDto: CrearEmergenciaRequestDto) {
    crearEmergenciaDto.imagenesList = this.convertirCadenaAArray(
      crearEmergenciaDto.imagenes,
    );

    const result = await this.emergenciasService.crear(crearEmergenciaDto);

    return result;
  }

  @Post('filepart')
  async syncFilePart(@Body() filePartRequestDto: SyncFilePartRequestDto) {
    const result =
      await this.emergenciasService.syncFilePart(filePartRequestDto);

    return result;
  }

  @Post('joinfileparts')
  async joinFilePart(@Body() joinFilePartRequest: JoinFilePartRequestDto) {
    const result =
      await this.emergenciasService.joinFilePart(joinFilePartRequest);

    return result;
  }

  @Get()
  async listarEmergenciasPorUsuario(@Query('usuario') usuario: string) {
    const result =
      await this.emergenciasService.obtenerListaEmergencias(usuario);

    return result;
  }

  @Get('listarall')
  async listarAllEmergencias(
    @Query('estado') estado: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('tipoEmergencia') tipoEmergencia: string,
  ) {
    console.log('estado : ' + estado);
    console.log('fechaInicio : ' + fechaInicio);
    console.log('fechaFin : ' + fechaFin);
    console.log('tipoEmergencia : ' + tipoEmergencia);

    const result = await this.emergenciasService.obtenerAllEmergencias(
      estado,
      fechaInicio,
      fechaFin,
      tipoEmergencia,
    );

    return result;
  }

  @Get('busquedaPaginada')
  async busquedaPaginada(
    @Query('estado') estado: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('tipoEmergencia') tipoEmergencia: string,
    @Query('pagina') pagina: number,
    @Query('porPagina') porPagina: number,
    @Query('ordenadoPor') ordenadoPor: string,
    @Query('ordenadoDir') ordenadoDir: number,
    @Query('departamento') departamento: string,
  ) {
    console.log('estado : ' + estado);
    console.log('fechaInicio : ' + fechaInicio);
    console.log('fechaFin : ' + fechaFin);
    console.log('tipoEmergencia : ' + tipoEmergencia);
    console.log('pagina : ' + pagina);
    console.log('porPagina : ' + porPagina);
    console.log('ordenadoPor : ' + ordenadoPor);
    console.log('ordenadoDir : ' + ordenadoDir);
    console.log('departamento : ' + departamento);

    const result = await this.emergenciasService.obtenerEmergenciasPaginadas(
      estado,
      fechaInicio,
      fechaFin,
      tipoEmergencia,
      pagina,
      porPagina,
      ordenadoPor,
      ordenadoDir,
      departamento,
    );

    return result;
  }

  @Get('buscar')
  async buscar(@Query('id') id: string) {
    console.log('id : ' + id);

    const result = await this.emergenciasService.buscar(id);

    return result;
  }

  @Get('listarportipo')
  async listarEmergenciasPorGruposTipoEmergencia() {
    const result =
      await this.emergenciasService.obtenerListaEmergenciasPorTipo();

    return result;
  }

  @Post('cancelar')
  async cancelarEmergencia(
    @Body() cancelarEmergenciaRequestDto: CancelarEmergenciaRequestDto,
  ) {
    const result = await this.emergenciasService.cancelar(
      cancelarEmergenciaRequestDto,
    );

    return result;
  }

  @Post('actualizarEstado')
  async actualizarEstado(
    @Query('id') id: string,
    @Body()
    actualizarEstadoEmergenciaRequestDto: ActualizarEstadoEmergenciaRequestDto,
  ) {
    const result = await this.emergenciasService.actualizarEstadoEmergencia(
      id,
      actualizarEstadoEmergenciaRequestDto,
    );

    return result;
  }

  @Post('agregarComentario')
  async agregarComentario(
    @Query('id') id: string,
    @Body()
    agregarComentarioEmergenciaRequestDto: AgregarComentarioEmergenciaRequestDto,
  ) {
    const result = await this.emergenciasService.agregarComentarioEmergencia(
      id,
      agregarComentarioEmergenciaRequestDto,
    );

    return result;
  }

  @Post('actualizarDepartamento')
  async actualizarDepartamento(
    @Query('id') id: string,
    @Body()
    ActualizarDepartamentoEmergenciaRequestDto: ActualizarDepartamentoEmergenciaRequestDto,
  ) {
    const result =
      await this.emergenciasService.actualizarDepartamentoEmergencia(
        id,
        ActualizarDepartamentoEmergenciaRequestDto,
      );

    return result;
  }
}
