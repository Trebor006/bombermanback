import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BombersService } from './bombers.service';
import { CreateBomberDto } from './dto/create-bomber.dto';
import { LoginBomberDto } from './dto/login-bomber.dto';

@Controller('bombers')
export class BombersController {
  constructor(private readonly bombersService: BombersService) {}

  @Post('registrar')
  create(@Body() createFuncionarioDto: CreateBomberDto) {
    return this.bombersService.create(createFuncionarioDto);
  }

  @Get()
  findAll() {
    return this.bombersService.findAll();
  }

  @Get('buscar')
  buscar(@Query('id') id: string) {
    return this.bombersService.buscar(id);
  }

  @Post('login')
  login(@Body() loginFuncionarioDto: LoginBomberDto) {
    console.log('login funcionario!!!');
    return this.bombersService.login(loginFuncionarioDto);
  }
}
