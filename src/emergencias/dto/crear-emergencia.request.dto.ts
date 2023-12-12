export class CrearEmergenciaRequestDto {
  token: string;
  usuario: string;

  titulo: string;
  descripcion: string;

  tipoEmergencia: string;
  lon: string;
  lat: string;
  audio: string;
  audioUrl: string;
  imagenes: string;
  imagenesList: string[];
}
