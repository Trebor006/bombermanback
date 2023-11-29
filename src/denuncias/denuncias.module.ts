import { Module } from '@nestjs/common';
import { DenunciasService } from './denuncias.service';
import { DenunciasController } from './denuncias.controller';
import { OpenaiService } from '../components/openai/openai.service';
import { DropboxClientService } from '../components/dropbox-client/dropbox-client.service';
import { ClarifaiService } from '../components/clarifai/clarifai.service';
import { ConfigService } from '@nestjs/config';
import { PromptsService } from './prompts.service';
import { DenunciasValidatorService } from './denuncias.validator.service';
import { BufferUtilService } from '../common/utils/buffer-util/buffer-util.service';
import { HashCodeService } from '../common/utils/hash-code/hash-code.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Denuncia, DenunciaSchema } from '../schemas/denuncia.schema';
import { TipoSolicitudService } from '../configurationsresources/tipo-solicitudes/tipo-solicitud.service';
import {
  TipoSolicitud,
  TipoSolicitudSchema,
} from '../schemas/tipo-solicitud.schema';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Notificaciones.name, schema: NotificacionesSchema },
      { name: TokenDispositivo.name, schema: TokenDispositivoSchema },
      { name: Denuncia.name, schema: DenunciaSchema },
      { name: TipoSolicitud.name, schema: TipoSolicitudSchema },
      { name: Departamento.name, schema: DepartamentoSchema },
      { name: FilePart.name, schema: FilePartSchema },
    ]),
  ],
  controllers: [DenunciasController],
  providers: [
    DenunciasService,
    DenunciasValidatorService,
    PromptsService,
    OpenaiService,
    DropboxClientService,
    ClarifaiService,
    ConfigService,
    BufferUtilService,
    HashCodeService,
    TipoSolicitudService,
    DepartamentosService,
    NotificacionesService,
  ],
})
export class DenunciasModule {}
