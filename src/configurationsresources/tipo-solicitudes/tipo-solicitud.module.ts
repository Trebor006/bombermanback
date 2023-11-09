import { Module } from '@nestjs/common';
import { TipoSolicitudService } from './tipo-solicitud.service';
import { TipoSolicitudController } from './tipo-solicitud.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';
import {
  TipoSolicitud,
  TipoSolicitudSchema,
} from '../../schemas/tipo-solicitud.schema';
import { DepartamentosService } from '../departamentos/departamentos.service';
import {
  Departamento,
  DepartamentoSchema,
} from '../../schemas/departamento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TipoSolicitud.name, schema: TipoSolicitudSchema },
      { name: Departamento.name, schema: DepartamentoSchema },
    ]),
  ],
  controllers: [TipoSolicitudController],
  providers: [TipoSolicitudService, DepartamentosService, HashCodeService],
})
export class TipoSolicitudModule {}
