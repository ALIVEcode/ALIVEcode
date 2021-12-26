import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AsScriptService } from './as-script.service';
import { CompileDTO } from './dto/compile.dto';
import axios from 'axios';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { Auth } from '../../utils/decorators/auth.decorator';
import { User } from '../../utils/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { UpdateScriptContentDTO } from './dto/updateScriptContent.dto';

export interface Datatype {
  nul: string;
  entier: string;
  texte: string;
  decimal: string;
  booleen: string;
}

export interface LinterFormatType {
  blocs: string[];
  datatype: Datatype;
  logiques: string[];
  operators: string[];
  fonctions: string[];
  variable: string;
  datatypes_names: string[];
  fin: string;
  fonctions_builtin: string[];
  control_flow: string[];
  const: string;
  modules: string[];
  commands: string[];
}
@Controller('as')
@UseInterceptors(DTOInterceptor)
export class AsScriptController {
  constructor(private readonly asScriptService: AsScriptService) {}

  @Post('compile')
  @Auth()
  async compile(@Body() compileDto: CompileDTO) {
    return await this.asScriptService.compile(compileDto);
  }

  @Get('lintinfo')
  async getLintInfo() {
    const lintInfo: LinterFormatType = await (
      await axios({
        method: 'GET',
        url: '/lintinfo/',
        baseURL: process.env.AS_URL,
      })
    ).data;
    return lintInfo;
  }

  @Post()
  @Auth()
  create(@Body() createAsScriptDto: any) {
    return; //this.asScriptService.create(createAsScriptDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.asScriptService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.asScriptService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateAsScriptDto: any) {
    return; //this.asScriptService.update(+id, updateAsScriptDto);
  }

  @Patch(':id/content')
  @Auth()
  async updateContent(@User() user: UserEntity, @Param('id') id: string, @Body() updateDto: UpdateScriptContentDTO) {
    const script = await this.asScriptService.findOne(id);
    if (script.creator.id !== user.id) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.asScriptService.updateContent(script, updateDto.content);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.asScriptService.remove(+id);
  }
}
