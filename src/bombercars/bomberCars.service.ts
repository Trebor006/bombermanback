import { Injectable } from '@nestjs/common';
import { CreateBombercarDto } from './dto/create-bombercar.dto';
import { HashCodeService } from '../common/utils/hash-code/hash-code.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BomberCar } from '../schemas/bomberCarSchema';
import { UpdateBombercarPositionDto } from './dto/update-bombercar-position.dto';
import { BomberCarPosition } from '../schemas/bomber-car-position.schema';
import { BomberCarPositionHistory } from '../schemas/bomber-car-position-history.schema';
import { PromptsService } from '../emergencias/prompts.service';
import { OpenaiService } from '../components/openai/openai.service';

@Injectable()
export class BomberCarsService {
  constructor(
    private hashCodeService: HashCodeService,
    private promptsService: PromptsService,
    private openaiService: OpenaiService,
    @InjectModel(BomberCar.name) private bomberCarModel: Model<BomberCar>,
    @InjectModel(BomberCarPosition.name)
    private bomberCarPositionModel: Model<BomberCarPosition>,
    @InjectModel(BomberCarPositionHistory.name)
    private BomberCarPositionHistoryModel: Model<BomberCarPositionHistory>,
  ) {}

  async create(createBomberCarDto: CreateBombercarDto) {
    createBomberCarDto.createdAt = new Date();
    createBomberCarDto.id =
      this.hashCodeService.generarHashCode(createBomberCarDto);

    const newBomberCar = new this.bomberCarModel(createBomberCarDto);
    const bomberCarSaved = await newBomberCar.save();

    return bomberCarSaved;
  }

  async updateposition(
    updateBomberCarUbicacionDto: UpdateBombercarPositionDto,
  ) {
    this.moveToHistoryAndDelete(updateBomberCarUbicacionDto.bomberCarId);

    updateBomberCarUbicacionDto.createdAt = new Date();
    const newBomberCarPosition = new this.bomberCarPositionModel(
      updateBomberCarUbicacionDto,
    );
    const bomberCarPositionSaved = await newBomberCarPosition.save();

    return bomberCarPositionSaved;
  }

  async moveToHistoryAndDelete(bomberCarId: string) {
    try {
      // Buscar el documento actual en bomberCarPositionModel por bomberCarId
      const currentBomberCarPosition =
        await this.bomberCarPositionModel.findOne({ bomberCarId });

      if (currentBomberCarPosition) {
        // Crear un nuevo documento en BomberCarPositionHistory con los datos del documento actual
        const bomberCarPositionHistory = new this.BomberCarPositionHistoryModel(
          currentBomberCarPosition.toObject(),
        );

        // Guardar el nuevo documento en BomberCarPositionHistory
        await bomberCarPositionHistory.save();

        // Eliminar el documento actual en bomberCarPositionModel
        await this.bomberCarPositionModel.deleteOne({ bomberCarId });

        return bomberCarPositionHistory; // Devolver el documento copiado a BomberCarPositionHistory
      } else {
        throw new Error(
          `No se encontró ninguna ubicación para la bomberCar con ID: ${bomberCarId}`,
        );
      }
    } catch (error) {
      // Manejar errores aquí
      console.error('Error al mover a historial y eliminar:', error);
      throw error;
    }
  }

  async obtenerSugerencia() {
    const currentPositions = await this.bomberCarPositionModel.find();

    const parsedList = this.parsearBomberCars(currentPositions);

    this.verificarImagenCorrespondeTipoEmergencia(parsedList, {
      lat: -17.344215,
      lon: -63.358794,
    });
  }

  parsearBomberCars(bomberCars: BomberCarPosition[]): [] {
    const parsedData = [];

    for (const bomberCar of bomberCars) {
      const parsedBomberCar = {
        id: bomberCar.bomberCarId,
        position: {
          lat: bomberCar.lat,
          lon: bomberCar.lon,
        },
      };
      parsedData.push(parsedBomberCar);
    }

    // @ts-ignore
    return parsedData;
  }

  private async verificarImagenCorrespondeTipoEmergencia(
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

  async listar() {
    const bomberCars = await this.bomberCarModel.find();
    return bomberCars;
  }

  async buscar(id: string) {
    const bombercar = await this.bomberCarModel
      .findOne({
        id: id,
      })
      .exec();

    return bombercar;
  }
}
