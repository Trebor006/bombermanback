import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BomberCarTokensDocument = HydratedDocument<BomberCarTokens>;

@Schema()
export class BomberCarTokens {
  @Prop({ required: true })
  bomberCarId: string;

  @Prop({ required: true })
  bomberId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const BomberCarTokensSchema =
  SchemaFactory.createForClass(BomberCarTokens);
