import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TipoSolicitudDocument = HydratedDocument<TipoSolicitud>;

@Schema()
export class TipoSolicitud {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  status: string;
}

export const TipoSolicitudSchema = SchemaFactory.createForClass(TipoSolicitud);
