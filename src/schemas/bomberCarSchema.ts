import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BomberCarDocument = HydratedDocument<BomberCar>;

@Schema()
export class BomberCar {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  marca: string;

  @Prop({ required: true })
  modelo: string;

  @Prop({ required: true })
  placa: string;

  @Prop({ required: false })
  token: string;

  @Prop({ required: false })
  status: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const BomberCarSchema = SchemaFactory.createForClass(BomberCar);
