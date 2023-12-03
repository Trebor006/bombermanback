import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { GeneradorCodigoModule } from './generador-codigo/generador-codigo.module';
import { HistorialContrasenaModule } from './historial-contrasena/historial-contrasena.module';
import { ConfigurationsService } from './configurations/configurations.service';
import { ConfigurationsModule } from './configurations/configurations.module';
import { ValidateUserApiModule } from './validate-user-api/validate-user-api.module';
// import { FaceRecognitionService } from './face-recognition/face-recognition.service';
// import { FaceRecognitionModule } from './face-recognition/face-recognition.module';
import { VerificationCodeModule } from './verification-code/verification-code.module';
import {
  Configuraciones,
  ConfiguracionesSchema,
} from './schemas/configuracion.schema';
import { DropboxClientService } from './components/dropbox-client/dropbox-client.service';
import { DropboxApiModule } from './components/dropbox-client/dropbox-api.module';
import { BufferUtilService } from './common/utils/buffer-util/buffer-util.service';
import { ClarifaiModule } from './components/clarifai/clarifai.module';
import { OpenaiModule } from './components/openai/openai.module';
import { DepartamentosModule } from './configurationsresources/departamentos/departamentos.module';
import { TipoEmergenciaModule } from './configurationsresources/tipo-emergencias/tipo-emergencia.module';
import { BombersModule } from './configurationsresources/bombers/bombers.module';
import { NotificacionesService } from './notificaciones/notificaciones.service';
import { FirebaseModule } from 'nestjs-firebase';
import { join } from 'path';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import {
  Notificaciones,
  NotificacionesSchema,
} from './schemas/notificaciones.schema';
import { RequestsModule } from './requests/requests.module';
import { BomberCarsModule } from './bombercars/bomberCarsModule';
import { EmergenciasModule } from './emergencias/emergencias.module';
import { HashCodeService } from './common/utils/hash-code/hash-code.service';
import { PasswordupdatersModule } from './passwordupdaters/passwordupdaters.module';
import { PasswordupdatersService } from './passwordupdaters/passwordupdaters.service';
import { MailService } from './mail/mail.service';
import { BomberPassword, BomberPasswordSchema } from './schemas/bomberPassword';

@Module({
  imports: [
    LoginModule,
    FirebaseModule.forRoot({
      googleApplicationCredential: join(__dirname, '../firebase-admin.json'),
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGODB_URL,
      }),
    }),
    MongooseModule.forFeature([
      { name: Configuraciones.name, schema: ConfiguracionesSchema },
      { name: Notificaciones.name, schema: NotificacionesSchema },
      { name: BomberPassword.name, schema: BomberPasswordSchema },
    ]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT),
          secure: true,
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
          },
        },
        defaults: {
          from: '"Bomberman" al rescate!!',
        },
        template: {
          dir: process.cwd() + '/public/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    GeneradorCodigoModule,
    HistorialContrasenaModule,
    ConfigurationsModule,
    ValidateUserApiModule,
    // FaceRecognitionModule,
    VerificationCodeModule,
    DropboxApiModule,
    ClarifaiModule,
    OpenaiModule,
    EmergenciasModule,
    DepartamentosModule,
    TipoEmergenciaModule,
    BombersModule,
    NotificacionesModule,
    RequestsModule,
    BomberCarsModule,
    PasswordupdatersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    ConfigurationsService,
    // FaceRecognitionService,
    DropboxClientService,
    BufferUtilService,
    HashCodeService,
    NotificacionesService,
    PasswordupdatersService,
    MailService,
  ],
})
export class AppModule {}
