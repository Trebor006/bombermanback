import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FilePartDocument = HydratedDocument<FilePart>;

@Schema()
export class FilePart {
  @Prop({ required: true })
  part: number;

  @Prop({ required: true })
  requestId: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  extension: string;

  @Prop({ required: true })
  data: string;
}

export const FilePartSchema = SchemaFactory.createForClass(FilePart);
