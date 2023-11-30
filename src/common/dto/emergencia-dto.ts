export class EmergenciaDto {
  _id: string;
  correo: string;
  titulo: string;
  descripcion: string;
  tipoEmergencia: string;
  colorMarker: string;
  estado: string;
  imagenesUrls: string[];
  lon: string;
  lat: string;
  createdAt: string;
}
