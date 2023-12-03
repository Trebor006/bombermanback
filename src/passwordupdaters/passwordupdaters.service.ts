import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import * as srp from 'secure-random-password';
import * as CryptoJS from 'crypto-js';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { BomberPassword } from '../schemas/bomberPassword';
import { Model } from 'mongoose';

@Injectable()
export class PasswordupdatersService {
  constructor(
    @InjectModel(BomberPassword.name)
    private bomberPasswordModel: Model<BomberPassword>,
    private readonly mailService: MailService,
  ) {}

  async generarNuevaContrasena(bomberId: string, correo: string) {
    const nuevaContrasena = await this.generarContrasena();
    const nuevaContrasenaEncoded = this.encriptar(nuevaContrasena);

    const data = {
      bomberId,
      password: nuevaContrasenaEncoded,
      createdAt: new Date(),
    };
    const model = new this.bomberPasswordModel(data);
    await model.save();

    this.mailService.sendUpdatePasswordMail(
      correo,
      nuevaContrasena,
      'http://localhost:3000/updatepassword?correo=' + correo,
    );
  }

  async generarContrasena(): Promise<string> {
    return srp.randomString({
      length: 8,
    });
  }

  private encriptar(password: string) {
    return CryptoJS.SHA256(password).toString();
  }
}
