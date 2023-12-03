import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BomberPasswordDocument = HydratedDocument<BomberPassword>;

@Schema()
export class BomberPassword {
  @Prop({ required: true })
  bomberId: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const BomberPasswordSchema =
  SchemaFactory.createForClass(BomberPassword);
