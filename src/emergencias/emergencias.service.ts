import { Injectable } from '@nestjs/common';
import { CrearEmergenciaRequestDto } from './dto/crear-emergencia.request.dto';
import { OpenaiService } from '../components/openai/openai.service';
import { DropboxClientService } from '../components/dropbox-client/dropbox-client.service';
import { ClarifaiService } from '../components/clarifai/clarifai.service';
import { PromptsService } from './prompts.service';
import { HashCodeService } from '../common/utils/hash-code/hash-code.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Emergencia } from '../schemas/emergenciaSchema';
import { CrearEmergenciaDto } from './dto/crear-emergencia.dto';
import { CancelarEmergenciaRequestDto } from './dto/cancelar-emergencia.request.dto';
import { ErrorResponse } from '../common/dto/base/error-response.dto';
import { ErrorCodes } from '../common/dto/base/ErrorCodes';
import { BaseResponse } from '../common/dto/base/base-response.dto';
import { EmergenciaDto } from '../common/dto/emergencia-dto';
import { TipoEmergenciaService } from '../configurationsresources/tipo-emergencias/tipo-emergencia.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { ActualizarEstadoEmergenciaRequestDto } from './dto/actualizar-estado-emergencia.request.dto';
import { Usuario } from '../schemas/usuario.schema';
import { AgregarComentarioEmergenciaRequestDto } from './dto/agregar-comentario-emergencia.request.dto';
import { ComentarioDto } from '../common/dto/comentario-dto';
import { ActualizarDepartamentoEmergenciaRequestDto } from './dto/actualizar-departamento-emergencia.request.dto';
import { TokenDispositivo } from '../schemas/tokenDispositivo.schema';
import { DepartamentosService } from '../configurationsresources/departamentos/departamentos.service';
import { Departamento } from '../schemas/departamento.schema';
import { TipoEmergencia } from '../schemas/tipo-emergencia.schema';
import { SyncFilePartRequestDto } from './dto/sync-filepart.request.dto';
import { FilePart } from '../schemas/filePart.schema';
import { VerificadorCorreoDto } from '../generador-codigo/dto/verificador-correo.dto';
import { JoinFilePartRequestDto } from './dto/join-filepart.request.dto';
import { BomberCar } from '../schemas/bomberCarSchema';
import { AssignBomberCarDto } from '../bombercars/dto/assign-bombercar.dto';
import { BomberCarEmergencia } from '../schemas/bomberCarEmergenciaSchema';
import { BomberCarTokens } from '../schemas/bomberCarTokensSchema';

@Injectable()
export class EmergenciasService {
  constructor(
    private hashCodeService: HashCodeService,
    private clarifaiService: ClarifaiService,
    private promptsService: PromptsService,
    private openaiService: OpenaiService,
    private dropboxClientService: DropboxClientService,
    private tipoSolicitudService: TipoEmergenciaService,
    private notificacionesService: NotificacionesService,
    private departamentosService: DepartamentosService,
    @InjectModel(Usuario.name) private userModel: Model<Usuario>,
    @InjectModel(Emergencia.name) private emergenciaModel: Model<Emergencia>,
    @InjectModel(FilePart.name) private filePartModel: Model<FilePart>,
    @InjectModel(TokenDispositivo.name)
    private tokenDispositivoModel: Model<TokenDispositivo>,
    @InjectModel(TipoEmergencia.name)
    private tipoEmergenciaModel: Model<TipoEmergencia>,
    @InjectModel(BomberCar.name)
    private bomberCarModel: Model<BomberCar>,
    @InjectModel(BomberCarEmergencia.name)
    private bomberCarEmergenciaModel: Model<BomberCarEmergencia>,
    @InjectModel(BomberCarTokens.name)
    private bomberCarTokenModel: Model<BomberCarTokens>,
  ) {}

  async crear(createEmergenciaDto: CrearEmergenciaRequestDto) {
    const errors: ErrorResponse[] = [];

    const hashGenerated: string =
      this.hashCodeService.generarHashCode(createEmergenciaDto);
    const permitirRegistro: boolean = await this.permitirRegistroPorHash(
      createEmergenciaDto.usuario,
      hashGenerated,
    );
    if (!permitirRegistro) {
      console.log('error hash duplicado : ' + hashGenerated);
      errors.push(
        ErrorResponse.generateError(
          ErrorCodes.ERROR_DENUNCIA_DUPLICADA,
          'La emergencia ya se ha registrado',
        ),
      );
    }

    if (errors.length > 0) {
      return BaseResponse.generateError(
        'Error al registrar la emergencia',
        errors,
      );
    }

    const emergenciaRegistrada = await this.procederRegistroEmergencia(
      createEmergenciaDto,
      hashGenerated,
    );

    return BaseResponse.generateOkResponse(
      'Emergencia registrada satisfactoriamente',
      emergenciaRegistrada,
    );
  }

  async cancelar(cancelarEmergenciaRequestDto: CancelarEmergenciaRequestDto) {
    const emergencia = await this.emergenciaModel
      .findOne({
        correo: cancelarEmergenciaRequestDto.usuario,
        hash: cancelarEmergenciaRequestDto.hash,
      })
      .exec();

    if (emergencia.estado !== 'PENDIENTE') {
      console.log('No se puede cancelar por el estado');
      return Error('No se puede cancelar por el estado');
    }

    emergencia.estado = 'CANCELADO';
    await emergencia.save();

    return true;
  }

  private async validarMaximoEmergencias(
    createEmergenciaDto: CrearEmergenciaRequestDto,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to midnight for comparison

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Get the date for tomorrow

    const emergenciasPorTipo = await this.emergenciaModel
      .find({
        correo: createEmergenciaDto.usuario,
        tipoEmergencia: createEmergenciaDto.tipoEmergencia,
        estado: { $ne: 'CANCELADO' },
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      })
      .exec();

    return emergenciasPorTipo.length < 2;
  }

  private async permitirRegistroPorHash(usuario: string, hash: string) {
    const emergenciasHash = await this.emergenciaModel
      .find({
        correo: usuario,
        hash: hash,
      })
      .exec();

    return emergenciasHash.length == 0;
  }

  // private async verificarImagenesCorrespondeTipoEmergencia(
  //   createEmergenciaDto: CrearEmergenciaRequestDto,
  // ): Promise<boolean> {
  //   const resultados: boolean[] = await Promise.all(
  //     createEmergenciaDto.imagenesList.map((imagen) => {
  //       return this.verificarImagenCorrespondeTipoEmergencia(
  //         createEmergenciaDto.tipoEmergencia,
  //         imagen,
  //       );
  //     }),
  //   );
  //
  //   return resultados.every((resultado) => resultado);
  // }

  private async verificarImagenCorrespondeTipoEmergencia(
    tipoEmergencia: string,
    imagenPrueba: string,
  ) {
    const detalleImagen =
      await this.clarifaiService.recognitionImageDetail(imagenPrueba);
    const promptVerificacionContenidoImagen =
      this.promptsService.getPromptByCode('VERIFICACION_CONTENIDO_IMAGEN');

    const promptVerificacionImagen = promptVerificacionContenidoImagen
      .replace('{0}', tipoEmergencia)
      .replace('{1}', detalleImagen);

    const resultadoVerificacionImagen: boolean = JSON.parse(
      await this.openaiService.generateRequest(promptVerificacionImagen),
    );

    console.log('resultadoVerificacionImagen : ' + resultadoVerificacionImagen);

    return resultadoVerificacionImagen;
  }

  private async procederRegistroEmergencia(
    createEmergenciaDto: CrearEmergenciaRequestDto,
    hash: string,
  ) {
    const imageUrls = await this.dropboxClientService.subirImagenes(
      createEmergenciaDto,
      hash,
    );

    const nuevaEmergenciaDto: CrearEmergenciaDto = new CrearEmergenciaDto();
    nuevaEmergenciaDto.hash = hash;
    nuevaEmergenciaDto.token = createEmergenciaDto.token;
    nuevaEmergenciaDto.correo = createEmergenciaDto.usuario;
    nuevaEmergenciaDto.titulo = createEmergenciaDto.titulo;
    nuevaEmergenciaDto.descripcion = createEmergenciaDto.descripcion;
    nuevaEmergenciaDto.tipoEmergencia = createEmergenciaDto.tipoEmergencia;
    nuevaEmergenciaDto.lon = createEmergenciaDto.lon;
    nuevaEmergenciaDto.lat = createEmergenciaDto.lat;
    nuevaEmergenciaDto.estado = 'PENDIENTE';
    nuevaEmergenciaDto.audioUrl = '';
    nuevaEmergenciaDto.imagenesUrls = imageUrls;
    nuevaEmergenciaDto.createdAt = new Date();
    nuevaEmergenciaDto.comentarios = [];

    const model = new this.emergenciaModel(nuevaEmergenciaDto);
    const emergenciaAlmacenada = await model.save();

    return emergenciaAlmacenada;
  }

  async obtenerListaEmergencias(usuario: string) {
    const emergenciasPorUsuario = await this.emergenciaModel
      .find({
        correo: usuario,
      })
      .exec();

    return emergenciasPorUsuario;
  }

  async obtenerListaEmergenciasPorTipo() {
    const emergenciasPorTipo = await this.emergenciaModel
      .aggregate([
        {
          $group: {
            _id: '$tipoEmergencia',
            total: { $sum: 1 },
            aceptadas: {
              $sum: { $cond: [{ $eq: ['$estado', 'ACEPTADA'] }, 1, 0] },
            },
          },
        },
        { $sort: { aceptadas: -1 } },
      ])
      .exec();

    return emergenciasPorTipo;
  }

  async obtenerAllEmergencias(
    estado: string,
    fechaInicio: string,
    fechaFin: string,
    tipoEmergencia: string,
  ) {
    const emergencias = await this.obtenerAllEmergenciasBD(
      estado,
      fechaInicio,
      fechaFin,
      tipoEmergencia,
    );

    const emergenciasDto = await this.mapearEmergencias(emergencias);

    return emergenciasDto;
  }

  async obtenerAllEmergenciasBD(
    estado: string,
    fechaInicio: string,
    fechaFin: string,
    tipoEmergencia: string,
  ) {
    let query = this.emergenciaModel.find();

    query = query.where('estado').nin(['RECHAZADA', 'CANCELADO', 'PENDIENTE']);

    if (estado) {
      query = query.where('estado', estado);
    }

    if (fechaInicio) {
      // @ts-ignore
      query = query.where('createdAt').gte(new Date(fechaInicio));
    }

    if (fechaFin) {
      const fecha = new Date(fechaFin);

      fecha.setHours(23);
      fecha.setMinutes(59);
      fecha.setSeconds(59);
      fecha.setMilliseconds(999);

      // @ts-ignore
      query = query.where('createdAt').lte(fecha);
    }

    if (tipoEmergencia) {
      query = query.where('tipoEmergencia', tipoEmergencia);
    }

    const emergencias = await query.exec();

    return emergencias;
  }

  async obtenerEmergenciasPaginadas(
    estado: string,
    fechaInicio: string,
    fechaFin: string,
    tipoEmergencia: string,
    pagina: number,
    porPagina: number,
    ordenadoPor: string,
    ordenadoDir: number,
    departamento: string,
  ) {
    const skip = (pagina - 1) * porPagina;

    let query = this.emergenciaModel.find();
    let queryCount = this.emergenciaModel.find();

    if (estado) {
      query = query.where('estado', estado);
      queryCount = queryCount.where('estado', estado);
    }

    if (fechaInicio) {
      // @ts-ignore
      query = query.where('createdAt').gte(new Date(fechaInicio));
      // @ts-ignore
      queryCount = queryCount.where('createdAt').gte(new Date(fechaInicio));
    }

    if (fechaFin) {
      const fecha = new Date(fechaFin);

      fecha.setHours(23);
      fecha.setMinutes(59);
      fecha.setSeconds(59);
      fecha.setMilliseconds(999);

      // @ts-ignore
      query = query.where('createdAt').lte(fecha);
      // @ts-ignore
      queryCount = queryCount.where('createdAt').lte(fecha);
    }

    if (tipoEmergencia) {
      query = query.where('tipoEmergencia', tipoEmergencia);
      queryCount = queryCount.where('tipoEmergencia', tipoEmergencia);
    } else {
      // const tpd = await this.tipoEmergenciaModel.find({ departamento }).exec();
      // const map: string[] = tpd.map((tp) => tp.nombre);
      //
      // query = query.where('tipoEmergencia').in(map);
      // queryCount = queryCount.where('tipoEmergencia').in(map);
    }

    const sortField: string = ordenadoPor;
    const sortQuery: { [key: string]: any } = {};
    sortQuery[sortField] = ordenadoDir;

    const [emergenciasSaved, totalEmergencias] = await Promise.all([
      // query.sort(sortQuery).skip(skip).limit(porPagina).exec(),
      query.skip(skip).limit(porPagina).exec(),
      queryCount.countDocuments().exec(),
    ]);

    const totalPaginas = Math.ceil(totalEmergencias / porPagina);
    const emergencias = await this.mapearEmergencias(emergenciasSaved);
    return { emergencias, totalPaginas };
  }

  private async mapearEmergencias(emergencias): Promise<EmergenciaDto[]> {
    const tiposEmergencias = await this.tipoEmergenciaModel.find();
    return emergencias.map((emergencia) => {
      const tipoEmergenciaEncontrado = tiposEmergencias.find(
        (tipo) => tipo.id === emergencia.tipoEmergencia,
      );

      return {
        _id: emergencia.hash,
        correo: emergencia.correo,
        titulo: emergencia.titulo,
        descripcion: emergencia.descripcion,
        tipoEmergencia: tipoEmergenciaEncontrado?.nombre
          ? tipoEmergenciaEncontrado.nombre
          : '',
        colorMarker: tipoEmergenciaEncontrado ? '' : '', // Obtener el color del tipo de emergencia
        estado: emergencia.estado,
        imagenesUrls: emergencia.imagenesUrls,
        lon: emergencia.lon,
        lat: emergencia.lat,
        createdAt: this.parseDate(emergencia.createdAt),
      };
    });
  }

  parseDate(createdAt: Date): string {
    const fecha = new Date(createdAt);
    const dia = String(fecha.getUTCDate()).padStart(2, '0'); // Día del mes, de 1 a 31.
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Los meses se cuentan de 0 a 11, por lo que sumamos 1.
    const ano = fecha.getUTCFullYear(); // Año (4 dígitos).

    return `${dia}/${mes}/${ano}`;
  }

  async buscar(id: string) {
    const emergencia = await this.emergenciaModel
      .findOne({
        hash: id,
      })
      .exec();
    // const departamentos = await this.departamentosService.obtenerRegistros();
    const tiposEmergencia = await this.tipoEmergenciaModel.find();
    const tipoEmergenciaEncontrado = tiposEmergencia.find(
      (tipo) => tipo.id === emergencia.tipoEmergencia,
    );

    const tipoEmergencia = tipoEmergenciaEncontrado.nombre;

    return {
      _id: emergencia.hash,
      correo: emergencia.correo,
      titulo: emergencia.titulo,
      descripcion: emergencia.descripcion,
      tipoEmergencia: tipoEmergencia,
      estado: emergencia.estado,
      imagenesUrls: emergencia.imagenesUrls,
      audioUrl: emergencia.audioUrl,
      lon: emergencia.lon,
      lat: emergencia.lat,
      createdAt: this.parseDate(emergencia.createdAt),
      comentarios: [],
    };
  }

  async actualizarEstadoEmergencia(
    id: string,
    actualizarEstadoEmergenciaRequestDto: ActualizarEstadoEmergenciaRequestDto,
  ) {
    const emergencia = await this.emergenciaModel.findOne({ hash: id }).exec();
    if (emergencia == null) {
      new Error('No existe la emergencia');
    }

    const estado = actualizarEstadoEmergenciaRequestDto.estado;
    emergencia.estado = estado;
    emergencia.bomberCarId = actualizarEstadoEmergenciaRequestDto.bomberCarId;

    const bomberCarAssigned = await this.bomberCarModel.findOne({
      id: emergencia.bomberCarId,
    });

    console.log('info ' + JSON.stringify(bomberCarAssigned));

    const bomberCarEmergenciaSaved = new this.bomberCarEmergenciaModel({
      bomberCarId: emergencia.bomberCarId,
      emergenciaId: id,
      createdAt: new Date(),
    });
    bomberCarAssigned.status = 'BUSY';
    bomberCarAssigned.save();

    const tokensBombers = await this.bomberCarTokenModel
      .find({
        bomberCarId: emergencia.bomberCarId,
      })
      .exec();

    const tokens = tokensBombers.map((document) => {
      return document.token;
    });

    if (tokens.length > 0) {
      this.notificacionesService.sendNotification(
        tokens,
        'Nueva Emergencia',
        'Proceder al destino' + '....',
        '',
        id,
        '',
      );
    }

    this.notificacionesService.sendNotification(
      [emergencia.token],
      'Emergencia asignada a un equipo, revisa los datos actualizados',
      'Emergencia asignada a un equipo, revisa los datos actualizados' + '....',
      '',
      id,
      '',
    );
    console.log(JSON.stringify(emergencia));

    await bomberCarEmergenciaSaved.save();
  }

  async agregarComentarioEmergencia(
    id: string,
    agregarComentarioEmergenciaRequestDto: AgregarComentarioEmergenciaRequestDto,
  ) {
    const emergencia = await this.emergenciaModel.findOne({ hash: id }).exec();
    if (emergencia == null) {
      new Error('No existe la emergencia');
    }

    const comentario = new ComentarioDto();
    comentario.funcionario = agregarComentarioEmergenciaRequestDto.funcionario;
    comentario.departamento =
      agregarComentarioEmergenciaRequestDto.departamento;
    comentario.comentario = agregarComentarioEmergenciaRequestDto.comentario;
    comentario.accion = 'Comentario';
    comentario.createdAt = new Date();

    emergencia.comentarios.push(comentario);
    await emergencia.save();

    const user = await this.userModel
      .findOne({ correo: emergencia.correo })
      .exec();

    const tokensDocuments = await this.tokenDispositivoModel
      .find({ usuario: emergencia.correo })
      .exec();

    const tokens = await tokensDocuments.map(
      (tokensDocuments) => tokensDocuments.tokenDevice,
    );

    this.notificacionesService.sendNotification(
      tokens,
      'Comentario añadido a Emergencia',
      emergencia.titulo + '....',
      JSON.stringify(emergencia),
      emergencia.hash,
      user.correo,
    );

    console.log(JSON.stringify(emergencia));
  }

  async actualizarDepartamentoEmergencia(
    id: string,
    actualizarDepartamentoEmergenciaRequestDto: ActualizarDepartamentoEmergenciaRequestDto,
  ) {
    const emergencia = await this.emergenciaModel.findOne({ hash: id }).exec();
    if (emergencia == null) {
      new Error('No existe la emergencia');
    }

    emergencia.tipoEmergencia =
      actualizarDepartamentoEmergenciaRequestDto.departamentoNuevo;
    await emergencia.save();

    const user = await this.userModel
      .findOne({ usuario: emergencia.correo })
      .exec();

    const tokensDocuments = await this.tokenDispositivoModel
      .find({ usuario: emergencia.correo })
      .exec();

    const tokens = await tokensDocuments.map(
      (tokensDocuments) => tokensDocuments.tokenDevice,
    );

    this.notificacionesService.sendNotification(
      tokens,
      'Estado de emergencia Actualizado',
      emergencia.titulo + '....',
      JSON.stringify(emergencia),
      emergencia.hash,
      user.correo,
    );

    console.log(JSON.stringify(emergencia));
  }

  private async parseComments(
    comentarios: ComentarioDto[],
    departamentos: Departamento[],
  ): Promise<ComentarioDto[]> {
    comentarios.forEach((comentario) => {
      const departamento = departamentos.find(
        (departamento) => departamento.id === comentario.departamento,
      );

      if (departamento) {
        // Realizar las operaciones que necesites con el departamento encontrado
        console.log(departamento);
        comentario.departamento = departamento.nombre;
      }
    });

    return comentarios;
  }

  async syncFilePart(filePartRequestDto: SyncFilePartRequestDto) {
    const newFilePart = new this.filePartModel(filePartRequestDto);
    const filePartSaved = await newFilePart.save();

    return filePartSaved;
  }

  async joinFilePart(joinFilePartRequestDto: JoinFilePartRequestDto) {
    const fileParts = await this.filePartModel
      .find({ requestId: joinFilePartRequestDto.requestId })
      .sort({ part: 1 })
      .exec();

    let resultadoConcatenado = '';

    fileParts.forEach((documento) => {
      resultadoConcatenado += documento.data;
    });

    const audioUrl = await this.dropboxClientService.subirAudioFile(
      resultadoConcatenado,
      joinFilePartRequestDto.requestId,
    );

    const emergencia = await this.emergenciaModel
      .findOne({ hash: joinFilePartRequestDto.requestId })
      .exec();
    if (emergencia == null) {
      new Error('No existe la emergencia');
    }

    emergencia.audioUrl = audioUrl;
    await emergencia.save();

    this.filePartModel
      .deleteMany({ requestId: joinFilePartRequestDto.requestId })
      .then(() => {
        console.log('Documentos eliminados correctamente');
      })
      .catch((error) => {
        // Manejar errores aquí
        console.error('Error al eliminar documentos:', error);
      });

    return emergencia;
  }
}
