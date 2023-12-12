import { Injectable } from '@nestjs/common';
import { CreateBomberDto } from './dto/create-bomber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';
import * as CryptoJS from 'crypto-js';
import { Bomber } from '../../schemas/bomberSchema';
import { LoginBomberDto } from './dto/login-bomber.dto';
import { BomberPassword } from '../../schemas/bomberPassword';
import { PasswordupdatersService } from '../../passwordupdaters/passwordupdaters.service';
import { UpdatePasswordBomberDto } from './dto/update-password-bomber.dto';

@Injectable()
export class BombersService {
  constructor(
    @InjectModel(Bomber.name)
    private bomberModel: Model<Bomber>,
    @InjectModel(BomberPassword.name)
    private bomberPasswordModel: Model<BomberPassword>,
    private hashCodeService: HashCodeService,
    private passwordupdatersService: PasswordupdatersService,
  ) {}

  async create(createFuncionarioDto: CreateBomberDto) {
    const bomber = await this.bomberModel
      .findOne({
        ci: createFuncionarioDto.ci,
      })
      .exec();

    if (bomber != null) {
      // throw new Error(
      //   'No se puede registrar debido a que ya existe un bomber con ese ci',
      // );
    }

    createFuncionarioDto.id =
      this.hashCodeService.generarHashCode(createFuncionarioDto);
    createFuncionarioDto.createdAt = new Date();

    const bomberRepository = new this.bomberModel(createFuncionarioDto);
    const bomberSaved = await bomberRepository.save();

    this.passwordupdatersService.generarNuevaContrasena(
      bomberSaved.id,
      createFuncionarioDto.correo,
    );

    return bomberSaved;
  }

  async findAll() {
    const bombers = await this.bomberModel.find().exec();

    return bombers;
  }

  async buscar(id: string) {
    const bomber = await this.bomberModel
      .findOne({
        id: id,
      })
      .exec();

    return bomber;
  }

  async login(loginFuncionarioDto: LoginBomberDto) {
    const bomber = await this.bomberModel
      .findOne({
        correo: loginFuncionarioDto.email,
        // ci: loginFuncionarioDto.password,
      })
      .exec();

    if (bomber != null) {
      const pass = await this.bomberPasswordModel.findOne({
        bomberId: bomber.id,
        password: loginFuncionarioDto.password,
      });

      if (pass != null) {
        // const departamentos = await this.departamentosService.obtenerRegistros();
        // const departamento = departamentos.find(
        //   (departamento) => departamento.id === bomber.departamento,
        // );

        return {
          success: true,
          data: {
            id: bomber.id,
            apellido: bomber.apellido,
            celular: bomber.celular,
            ci: bomber.ci,
            correo: bomber.correo,
            nombre: bomber.nombre,
            bomberCarId: bomber.bomberCarId,
            createdAt: bomber.createdAt,
          },
        };
      }
    }

    return {
      success: false,
    };
  }

  private encriptar(password: string) {
    return CryptoJS.SHA256(password).toString();
  }

  async actualizarContrasena(updatePasswordBomberDto: UpdatePasswordBomberDto) {
    const bomber = await this.bomberModel
      .findOne({
        correo: updatePasswordBomberDto.correo,
      })
      .exec();

    if (bomber != null) {
      const bomberId = bomber.id;

      const pass = await this.bomberPasswordModel.findOne({
        bomberId: bomber.id,
        password: updatePasswordBomberDto.contrasenaActualEncriptada,
      });

      if (pass != null) {
        this.bomberPasswordModel.deleteOne({
          bomberId: bomber.id,
          password: updatePasswordBomberDto.contrasenaActualEncriptada,
        });

        const data = {
          bomberId,
          password: updatePasswordBomberDto.nuevaContrasenaEncriptada,
          createdAt: new Date(),
        };
        const model = new this.bomberPasswordModel(data);
        const newSaved = await model.save();

        if (newSaved != null) {
          return {
            success: true,
          };
        }
      }
    }

    return {
      success: false,
    };
  }
}
