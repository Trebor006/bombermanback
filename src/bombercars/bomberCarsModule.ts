import { Module } from '@nestjs/common';
import { BomberCarsService } from './bomberCars.service';
import { BomberCarController } from './bomberCarController';
import { MongooseModule } from '@nestjs/mongoose';
import { BomberCar, BomberCarSchema } from '../schemas/bomberCarSchema';
import { HashCodeService } from '../common/utils/hash-code/hash-code.service';
import {
  BomberCarPosition,
  BomberCarPositionSchema,
} from '../schemas/bomber-car-position.schema';
import {
  BomberCarPositionHistory,
  BomberCarPositionHistorySchema,
} from '../schemas/bomber-car-position-history.schema';
import { PromptsService } from '../emergencias/prompts.service';
import { OpenaiService } from '../components/openai/openai.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BomberCar.name, schema: BomberCarSchema },
      { name: BomberCarPosition.name, schema: BomberCarPositionSchema },
      {
        name: BomberCarPositionHistory.name,
        schema: BomberCarPositionHistorySchema,
      },
    ]),
  ],
  controllers: [BomberCarController],
  providers: [
    BomberCarsService,
    HashCodeService,
    PromptsService,
    OpenaiService,
  ],
})
export class BomberCarsModule {}
