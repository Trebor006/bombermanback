import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BomberDocument = HydratedDocument<Bomber>;

@Schema()
export class Bomber {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  celular: string;

  @Prop({ required: true })
  ci: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  bomberCarId: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const BomberSchema = SchemaFactory.createForClass(Bomber);
