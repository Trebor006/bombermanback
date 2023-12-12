import { Module } from '@nestjs/common';
import { EmergenciasService } from './emergencias.service';
import { EmergenciasController } from './emergencias.controller';
import { OpenaiService } from '../components/openai/openai.service';
import { DropboxClientService } from '../components/dropbox-client/dropbox-client.service';
import { ClarifaiService } from '../components/clarifai/clarifai.service';
import { ConfigService } from '@nestjs/config';
import { PromptsService } from './prompts.service';
import { EmergenciasValidatorService } from './emergencias.validator.service';
import { BufferUtilService } from '../common/utils/buffer-util/buffer-util.service';
import { HashCodeService } from '../common/utils/hash-code/hash-code.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Emergencia, EmergenciaSchema } from '../schemas/emergenciaSchema';
import { TipoEmergenciaService } from '../configurationsresources/tipo-emergencias/tipo-emergencia.service';
import {
  TipoEmergencia,
  TipoEmergenciaSchema,
} from '../schemas/tipo-emergencia.schema';
import {
  Departamento,
  DepartamentoSchema,
} from '../schemas/departamento.schema';
import { DepartamentosService } from '../configurationsresources/departamentos/departamentos.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { Usuario, UsuarioSchema } from '../schemas/usuario.schema';
import {
  Notificaciones,
  NotificacionesSchema,
} from '../schemas/notificaciones.schema';
import {
  TokenDispositivo,
  TokenDispositivoSchema,
} from '../schemas/tokenDispositivo.schema';
import { FilePart, FilePartSchema } from '../schemas/filePart.schema';
import { BomberCar, BomberCarSchema } from '../schemas/bomberCarSchema';
import {
  BomberCarEmergencia,
  BomberCarEmergenciaSchema,
} from '../schemas/bomberCarEmergenciaSchema';
import {
  BomberCarTokens,
  BomberCarTokensSchema,
} from '../schemas/bomberCarTokensSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Notificaciones.name, schema: NotificacionesSchema },
      { name: BomberCarEmergencia.name, schema: BomberCarEmergenciaSchema },
      { name: BomberCarTokens.name, schema: BomberCarTokensSchema },
      { name: TokenDispositivo.name, schema: TokenDispositivoSchema },
      { name: Emergencia.name, schema: EmergenciaSchema },
      { name: TipoEmergencia.name, schema: TipoEmergenciaSchema },
      { name: Departamento.name, schema: DepartamentoSchema },
      { name: FilePart.name, schema: FilePartSchema },
      { name: BomberCar.name, schema: BomberCarSchema },
    ]),
  ],
  controllers: [EmergenciasController],
  providers: [
    EmergenciasService,
    EmergenciasValidatorService,
    PromptsService,
    OpenaiService,
    DropboxClientService,
    ClarifaiService,
    ConfigService,
    BufferUtilService,
    HashCodeService,
    TipoEmergenciaService,
    DepartamentosService,
    NotificacionesService,
  ],
})
export class EmergenciasModule {}
