export class CrearDenunciaRequestDto {
  usuario: string;

  titulo: string;
  descripcion: string;

  tipoDenuncia: string;
  lon: string;
  lat: string;
  audio: string;
  audioUrl: string;
  imagenes: string;
  imagenesList: string[];
}
