import { Module } from '@nestjs/common';
import { TipoEmergenciaService } from './tipo-emergencia.service';
import { TipoEmergenciaController } from './tipo-emergencia.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';
import {
  TipoEmergencia,
  TipoEmergenciaSchema,
} from '../../schemas/tipo-emergencia.schema';
import { DepartamentosService } from '../departamentos/departamentos.service';
import {
  Departamento,
  DepartamentoSchema,
} from '../../schemas/departamento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TipoEmergencia.name, schema: TipoEmergenciaSchema },
      { name: Departamento.name, schema: DepartamentoSchema },
    ]),
  ],
  controllers: [TipoEmergenciaController],
  providers: [TipoEmergenciaService, DepartamentosService, HashCodeService],
})
export class TipoEmergenciaModule {}
