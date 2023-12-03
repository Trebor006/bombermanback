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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bomber.name, schema: BomberSchema },
      { name: BomberPassword.name, schema: BomberPasswordSchema },
      { name: Departamento.name, schema: DepartamentoSchema },
    ]),
  ],
  controllers: [BombersController],
  providers: [BombersService, HashCodeService, DepartamentosService],
})
export class BombersModule {}
