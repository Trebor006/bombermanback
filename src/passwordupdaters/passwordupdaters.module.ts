import { Module } from '@nestjs/common';
import { PasswordupdatersService } from './passwordupdaters.service';
import { MailService } from '../mail/mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BomberPassword,
  BomberPasswordSchema,
} from '../schemas/bomberPassword';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BomberPassword.name, schema: BomberPasswordSchema },
    ]),
  ],
  providers: [PasswordupdatersService, MailService],
})
export class PasswordupdatersModule {}
