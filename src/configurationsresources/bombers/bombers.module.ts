import { Module } from '@nestjs/common';
import { BombersService } from './bombers.service';
import { BombersController } from './bombers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Departamento,
  DepartamentoSchema,
} from '../../schemas/departamento.schema';
import { Bomber, BomberSchema } from '../../schemas/bomberSchema';
import { DepartamentosService } from '../departamentos/departamentos.service';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';
import {
  BomberPassword,
  BomberPasswordSchema,
} from '../../schemas/bomberPassword';
import { PasswordupdatersService } from '../../passwordupdaters/passwordupdaters.service';
import { MailService } from '../../mail/mail.service';
import { NotificacionesService } from '../../notificaciones/notificaciones.service';
import {
  Notificaciones,
  NotificacionesSchema,
} from '../../schemas/notificaciones.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bomber.name, schema: BomberSchema },
      { name: BomberPassword.name, schema: BomberPasswordSchema },
      { name: Departamento.name, schema: DepartamentoSchema },
    ]),
  ],
  controllers: [BombersController],
  providers: [
    BombersService,
    HashCodeService,
    DepartamentosService,
    PasswordupdatersService,
    MailService,
  ],
})
export class BombersModule {}
