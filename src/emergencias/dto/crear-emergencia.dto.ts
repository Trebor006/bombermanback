import { ComentarioDto } from '../../common/dto/comentario-dto';

export class CrearEmergenciaDto {
  hash: string;
  correo: string;

  titulo: string;
  descripcion: string;
  lon: string;
  lat: string;

  tipoEmergencia: string;
  imagenesUrls: string[];
  createdAt: Date;
  estado: string;
  audioUrl: string;
  comentarios: ComentarioDto[];
}
