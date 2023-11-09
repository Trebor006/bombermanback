import { Injectable } from '@nestjs/common';
import { CreateTipoSolicitudDto } from './dto/create-tipo-solicitud.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';
import { TipoSolicitud } from '../../schemas/tipo-solicitud.schema';
import { TipoDenuncia } from '../../common/dto/tipo-denuncia';
import { DepartamentosService } from '../departamentos/departamentos.service';

@Injectable()
export class TipoSolicitudService {
  constructor(
    @InjectModel(TipoSolicitud.name)
    private tipoDenunciaModel: Model<TipoSolicitud>,
    private hashCodeService: HashCodeService,
    private departamentosService: DepartamentosService,
  ) {}

  async registrar(createTipoDenunciaDto: CreateTipoSolicitudDto) {
    const tipoDenuncia = await this.tipoDenunciaModel
      .findOne({
        nombre: createTipoDenunciaDto.nombre,
      })
      .exec();

    if (tipoDenuncia != null) {
      throw new Error(
        'No se puede registrar debido a que ya existe un tipo solicitud con ese nombre',
      );
    }

    createTipoDenunciaDto.id = this.hashCodeService.generarHashCode(
      createTipoDenunciaDto,
    );
    createTipoDenunciaDto.createdAt = new Date();

    const tipoDenunciaRepository = new this.tipoDenunciaModel(
      createTipoDenunciaDto,
    );
    const tipoDenunciaSaved = await tipoDenunciaRepository.save();

    return tipoDenunciaSaved;
  }

  async obtenerRegistros() {
    // const departamentos = await this.departamentosService.obtenerRegistros();

    const tipoDenuncias = await this.tipoDenunciaModel.find().exec();

    // tipoDenuncias.forEach((tipoDenuncia) => {
    //   const departamento = departamentos.find(
    //     (departamento) => departamento.id === tipoDenuncia.departamento,
    //   );
    //
    //   if (departamento) {
    //     // Realizar las operaciones que necesites con el departamento encontrado
    //     console.log(departamento);
    //     tipoDenuncia.departamento = departamento.nombre;
    //   }
    // });

    return tipoDenuncias;
  }

  async obtenerRegistrosFiltrados(departamento: string) {
    const tipoDenuncias = await this.tipoDenunciaModel
      .find({ departamento })
      .exec();
    const departamentos = await this.departamentosService.obtenerRegistros();

    // tipoDenuncias.forEach((tipoDenuncia) => {
    //   const departamento = departamentos.find(
    //     (departamento) => departamento.id === tipoDenuncia.departamento,
    //   );
    //
    //   if (departamento) {
    //     // Realizar las operaciones que necesites con el departamento encontrado
    //     console.log(departamento);
    //     tipoDenuncia.departamento = departamento.nombre;
    //   }
    // });

    return tipoDenuncias;
  }

  async mapToTipoDenuncia(): Promise<TipoDenuncia[]> {
    const denuncias = await this.obtenerRegistros();

    //todo fix this
    // const tiposDenuncias = denuncias.map((denuncia) => ({
    //   tipo: denuncia.nombre,
    //   color: denuncia.color,
    // }));

    const tiposDenuncias = [];

    return tiposDenuncias;
  }

  async buscar(id: string) {
    const tipoDenuncia = await this.tipoDenunciaModel
      .findOne({
        id: id,
      })
      .exec();

    return tipoDenuncia;
  }
}
