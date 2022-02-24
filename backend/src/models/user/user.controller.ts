import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  Res,
  UseInterceptors,
  Query,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Param } from '@nestjs/common';
import { Response } from 'express';
import { Auth } from '../../utils/decorators/auth.decorator';
import { UserEntity, StudentEntity, ProfessorEntity } from './entities/user.entity';
import { hasRole } from './auth';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { Group } from '../../utils/decorators/group.decorator';
import { User } from '../../utils/decorators/user.decorator';
import { Role } from '../../utils/types/roles.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/upload/file-uploading';
import { NameMigrationDTO } from './dto/name_migration.dto';

export const storage = {
  fileFilter: imageFileFilter,
  storage: diskStorage({
    destination: 'images/uploads',
    filename: editFileName,
  }),
};
@Controller('users')
@UseInterceptors(DTOInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('students')
  async createStudent(@Body() createStudent: StudentEntity) {
    return {
      user: await this.userService.createStudent(createStudent),
    };
  }

  @Post('professors')
  async createProfessor(@Body() createProfessor: ProfessorEntity) {
    return {
      user: await this.userService.createProfessor(createProfessor),
    };
  }

  @Patch('nameMigration')
  @Auth(Role.STUDENT)
  async nameMigration(@User() user: StudentEntity, @Body() nameMigrationDto: NameMigrationDTO) {
    return await this.userService.nameMigration(user.id, nameMigrationDto);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      return await this.userService.login(email, password, res);
    } catch (err) {
      throw new HttpException('Could not login ' + err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('logout')
  @Auth()
  async logout(@Res() res: Response) {
    this.userService.logout(res);
    res.status(200).end();
  }

  @Post('refreshToken')
  async refreshToken(@Res({ passthrough: true }) res: Response) {
    return await this.userService.refreshToken(res);
  }

  @Get()
  @Auth(Role.STAFF)
  findAll() {
    return this.userService.findAll();
  }

  @Get('professors')
  @Auth(Role.MOD)
  findAllProfs() {
    return this.userService.findAllProfs();
  }

  @Get('students')
  @Auth(Role.MOD)
  findAllStudents() {
    return this.userService.findAllStudents();
  }

  @Get('me')
  @Auth()
  @Group('user')
  me(@User() user: UserEntity) {
    return user;
  }

  @Get('iot/projects')
  @Auth()
  async getProjects(@User() user: UserEntity) {
    return await this.userService.getIoTProjects(user);
  }

  @Get('iot/objects')
  @Auth()
  async getObjects(@User() user: UserEntity) {
    return await this.userService.getIoTObjects(user);
  }
  @Get('quizzes/results')
  @Auth()
  async getResults(@User() user: UserEntity) {
    return await this.userService.getResults(user);
  }
  @Get(':id')
  @Auth()
  findOneStudent(@User() user: UserEntity, @Param('id') id: string) {
    if (user.id === id) return user;
    if (!hasRole(user, Role.MOD)) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);
    return this.userService.findById(id);
  }

  @Patch(':id')
  @Auth(Role.MOD)
  async update(@User() user: UserEntity, @Param('id') id: string, @Body() updateUserDto: UserEntity) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(Role.MOD)
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    if (user.id !== id) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);

    if (user.id === id) return this.userService.remove(user);
    return this.userService.remove(await this.userService.findById(id));
  }

  @Get(':id/classrooms')
  @Auth()
  async getClassrooms(@User() user: UserEntity, @Param('id') id: string) {
    if (!hasRole(user, Role.MOD) && user.id !== id) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);

    if (user.id === id) return this.userService.getClassrooms(user);
    return this.userService.getClassrooms(await this.userService.findById(id));
  }

  @Get(':id/courses')
  @Auth()
  async getCourses(@User() user: UserEntity, @Param('id') id: string) {
    if (!hasRole(user, Role.MOD) && user.id !== id) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);

    if (user.id === id) return this.userService.getCourses(user);
    return this.userService.getCourses(await this.userService.findById(id));
  }

  @Get(':id/courses/recents')
  @Auth()
  async getRecentCourses(@User() user: UserEntity, @Param('id') id: string) {
    if (!hasRole(user, Role.MOD) && user.id !== id) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);

    if (user.id === id) return this.userService.getRecentCourses(user);
    return this.userService.getRecentCourses(await this.userService.findById(id));
  }

  @Get(':id/levels')
  @Auth()
  async getLevels(@User() user: UserEntity, @Param('id') id: string, @Query('search') query: string) {
    if (!hasRole(user, Role.MOD) && user.id !== id) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);

    if (user.id === id) return this.userService.getLevels(user, query);
    return this.userService.getLevels(await this.userService.findById(id), query);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', storage))
  async uploadedFile(@UploadedFile() file, @Request() req) {
    const user: UserEntity = req.user;

    user.image = file.filename;
    console.log(__dirname);
    console.log(file);
    return await this.userService.update(user.id, user);
  }
}

