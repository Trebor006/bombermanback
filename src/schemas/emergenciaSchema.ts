import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ComentarioDto } from '../common/dto/comentario-dto';

export type EmergenciaDocument = HydratedDocument<Emergencia>;

@Schema()
export class Emergencia {
  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: false })
  titulo: string;

  @Prop({ required: false })
  descripcion: string;

  @Prop({ required: false })
  tipoEmergencia: string;

  @Prop({ required: false })
  estado: string;

  @Prop({ required: false })
  lon: string;

  @Prop({ required: false })
  lat: string;

  @Prop({ required: false })
  audioUrl: string;

  @Prop({ required: false })
  imagenesUrls: string[];

  @Prop({ required: false })
  comentarios: ComentarioDto[];

  @Prop({ required: true })
  createdAt: Date;
}

export const EmergenciaSchema = SchemaFactory.createForClass(Emergencia);
