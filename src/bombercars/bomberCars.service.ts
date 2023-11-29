import { Injectable } from '@nestjs/common';
import { CreateBombercarDto } from './dto/create-bombercar.dto';
import { HashCodeService } from '../common/utils/hash-code/hash-code.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BomberCar } from '../schemas/bomberCarSchema';
import { UpdateBombercarPositionDto } from './dto/update-bombercar-position.dto';
import { BomberCarPosition } from '../schemas/bomber-car-position.schema';
import { BomberCarPositionHistory } from '../schemas/bomber-car-position-history.schema';
import { PromptsService } from '../denuncias/prompts.service';
import { OpenaiService } from '../components/openai/openai.service';

@Injectable()
export class BomberCarsService {
  constructor(
    private hashCodeService: HashCodeService,
    private promptsService: PromptsService,
    private openaiService: OpenaiService,
    @InjectModel(BomberCar.name) private ambulanciaModel: Model<BomberCar>,
    @InjectModel(BomberCarPosition.name)
    private ambulanciaPositionModel: Model<BomberCarPosition>,
    @InjectModel(BomberCarPositionHistory.name)
    private AmbulanciaPositionHistoryModel: Model<BomberCarPositionHistory>,
  ) {}

  async create(createAmbulanciaDto: CreateBombercarDto) {
    createAmbulanciaDto.createdAt = new Date();
    createAmbulanciaDto.id =
      this.hashCodeService.generarHashCode(createAmbulanciaDto);

    const newAmbulancia = new this.ambulanciaModel(createAmbulanciaDto);
    const ambulanciaSaved = await newAmbulancia.save();

    return ambulanciaSaved;
  }

  async updateposition(
    updateAmbulanciaUbicacionDto: UpdateBombercarPositionDto,
  ) {
    this.moveToHistoryAndDelete(updateAmbulanciaUbicacionDto.ambulanciaId);

    updateAmbulanciaUbicacionDto.createdAt = new Date();
    const newAmbulanciaPosition = new this.ambulanciaPositionModel(
      updateAmbulanciaUbicacionDto,
    );
    const ambulanciaPositionSaved = await newAmbulanciaPosition.save();

    return ambulanciaPositionSaved;
  }

  async moveToHistoryAndDelete(ambulanciaId: string) {
    try {
      // Buscar el documento actual en ambulanciaPositionModel por ambulanciaId
      const currentAmbulanciaPosition =
        await this.ambulanciaPositionModel.findOne({ ambulanciaId });

      if (currentAmbulanciaPosition) {
        // Crear un nuevo documento en AmbulanciaPositionHistory con los datos del documento actual
        const ambulanciaPositionHistory =
          new this.AmbulanciaPositionHistoryModel(
            currentAmbulanciaPosition.toObject(),
          );

        // Guardar el nuevo documento en AmbulanciaPositionHistory
        await ambulanciaPositionHistory.save();

        // Eliminar el documento actual en ambulanciaPositionModel
        await this.ambulanciaPositionModel.deleteOne({ ambulanciaId });

        return ambulanciaPositionHistory; // Devolver el documento copiado a AmbulanciaPositionHistory
      } else {
        throw new Error(
          `No se encontró ninguna ubicación para la ambulancia con ID: ${ambulanciaId}`,
        );
      }
    } catch (error) {
      // Manejar errores aquí
      console.error('Error al mover a historial y eliminar:', error);
      throw error;
    }
  }

  async obtenerSugerencia() {
    const currentPositions = await this.ambulanciaPositionModel.find();

    const parsedList = this.parsearAmbulancias(currentPositions);

    this.verificarImagenCorrespondeTipoDenuncia(parsedList, {
      lat: -17.344215,
      lon: -63.358794,
    });
  }

  parsearAmbulancias(ambulancias: BomberCarPosition[]): [] {
    const parsedData = [];

    for (const ambulancia of ambulancias) {
      const parsedAmbulancia = {
        id: ambulancia.ambulanciaId,
        position: {
          lat: ambulancia.lat,
          lon: ambulancia.lon,
        },
      };
      parsedData.push(parsedAmbulancia);
    }

    // @ts-ignore
    return parsedData;
  }

  private async verificarImagenCorrespondeTipoDenuncia(
    posiciones: any,
    ubicacionBuscada: any,
  ) {
    const promptVerificacionContenidoImagen =
      this.promptsService.getPromptByCode('VERIFICACION_PUNTO_CERCANO');

    const promptVerificacionImagen = promptVerificacionContenidoImagen
      .replace('{0}', JSON.stringify(posiciones))
      .replace('{1}', JSON.stringify(ubicacionBuscada));

    const resultadoVerificacionImagen =
      await this.openaiService.generateRequest(promptVerificacionImagen);

    console.log('resultadoVerificacionImagen : ' + resultadoVerificacionImagen);

    return resultadoVerificacionImagen;
  }
}
