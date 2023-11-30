import { Injectable } from '@nestjs/common';
import { CreateTipoEmergenciaDto } from './dto/create-tipo-emergencia.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';
import { TipoEmergencia } from '../../schemas/tipo-emergencia.schema';
import { DepartamentosService } from '../departamentos/departamentos.service';

@Injectable()
export class TipoEmergenciaService {
  constructor(
    @InjectModel(TipoEmergencia.name)
    private tipoEmergenciaModel: Model<TipoEmergencia>,
    private hashCodeService: HashCodeService,
    private departamentosService: DepartamentosService,
  ) {}

  async registrar(createTipoEmergenciaDto: CreateTipoEmergenciaDto) {
    const tipoEmergencia = await this.tipoEmergenciaModel
      .findOne({
        nombre: createTipoEmergenciaDto.nombre,
      })
      .exec();

    if (tipoEmergencia != null) {
      throw new Error(
        'No se puede registrar debido a que ya existe un tipo solicitud con ese nombre',
      );
    }

    createTipoEmergenciaDto.id = this.hashCodeService.generarHashCode(
      createTipoEmergenciaDto,
    );
    createTipoEmergenciaDto.createdAt = new Date();
    createTipoEmergenciaDto.updatedAt = createTipoEmergenciaDto.createdAt;
    createTipoEmergenciaDto.status = 'ENABLED';

    const tipoEmergenciaRepository = new this.tipoEmergenciaModel(
      createTipoEmergenciaDto,
    );
    const tipoEmergenciaSaved = await tipoEmergenciaRepository.save();

    return tipoEmergenciaSaved;
  }

  async obtenerRegistros(lastTimeModified: string) {
    let tipoEmergencias = [];
    if (lastTimeModified) {
      const fecha = new Date(lastTimeModified);

      // Si estás usando el formato de fecha y hora con zona horaria en UTC,
      // puedes convertir la fecha a UTC antes de hacer la consulta.
      fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());

      const tipoEmergenciasUpdated = await this.tipoEmergenciaModel
        .find({ updatedAt: { $gte: fecha } })
        .exec();

      tipoEmergencias = tipoEmergenciasUpdated;
    } else {
      tipoEmergencias = await this.tipoEmergenciaModel.find().exec();
    }

    return tipoEmergencias;
  }

  async obtenerRegistrosFiltrados(departamento: string) {
    const tipoEmergencias = await this.tipoEmergenciaModel
      .find({ departamento })
      .exec();
    // const departamentos = await this.departamentosService.obtenerRegistros();

    // tipoEmergencias.forEach((tipoEmergencia) => {
    //   const departamento = departamentos.find(
    //     (departamento) => departamento.id === tipoEmergencia.departamento,
    //   );
    //
    //   if (departamento) {
    //     // Realizar las operaciones que necesites con el departamento encontrado
    //     console.log(departamento);
    //     tipoEmergencia.departamento = departamento.nombre;
    //   }
    // });

    return tipoEmergencias;
  }

  async mapToTipoEmergencia(): Promise<TipoEmergencia[]> {
    // const emergencias = await this.obtenerRegistros(new Date());

    //todo fix this
    // const tiposEmergencias = emergencias.map((emergencia) => ({
    //   tipo: emergencia.nombre,
    //   color: emergencia.color,
    // }));

    const tiposEmergencias = [];

    return tiposEmergencias;
  }

  async buscar(id: string) {
    const tipoEmergencia = await this.tipoEmergenciaModel
      .findOne({
        id: id,
      })
      .exec();

    return tipoEmergencia;
  }
}
