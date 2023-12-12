import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ComentarioDto } from '../common/dto/comentario-dto';

export type BomberCarEmergenciaDocument = HydratedDocument<BomberCarEmergencia>;

@Schema()
export class BomberCarEmergencia {
  @Prop({ required: true })
  bomberCarId: string;

  @Prop({ required: true })
  emergenciaId: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const BomberCarEmergenciaSchema =
  SchemaFactory.createForClass(BomberCarEmergencia);
