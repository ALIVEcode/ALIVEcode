import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomEntity } from './entities/classroom.entity';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessorEntity } from '../user/entities/professor.entity';
import { StudentEntity } from '../user/entities/student.entity';
import { UserEntity } from '../user/entities/user.entity';
import { hasRole } from '../user/auth';
import { JoinClassroomDTO } from './dto/joinClassroom.dto';
import { UseGuards } from '@nestjs/common';
import { InClassroomGuard } from '../../utils/guards/classroom.guard';
import { Auth } from '../../utils/decorators/auth.decorator';
import { User } from '../../utils/decorators/user.decorator';
import { Role } from '../../utils/types/roles.types';
import { Classroom } from '../../utils/decorators/classroom.decorator';

@Controller('classrooms')
@UseInterceptors(DTOInterceptor)
@Injectable()
export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService,
    @InjectRepository(ProfessorEntity) private professorRepository: Repository<ProfessorEntity>,
  ) {}

  @Post()
  @Auth(Role.PROFESSOR)
  async create(@User() professor: ProfessorEntity, @Body() createClassroomDto: ClassroomEntity) {
    return await this.classroomService.create(createClassroomDto, professor);
  }

  @Get()
  @Auth(Role.STAFF)
  findAll() {
    return this.classroomService.findAll();
  }

  @Get(':id/courses')
  @UseGuards(InClassroomGuard)
  @Auth()
  async getCourses(@Classroom() classroom: ClassroomEntity) {
    return await this.classroomService.getCourses(classroom);
  }

  @Get(':id/students')
  @UseGuards(InClassroomGuard)
  @Auth()
  async getStudents(@Classroom() classroom: ClassroomEntity) {
    return await this.classroomService.getStudents(classroom);
  }

  @Delete(':id/students/:studentId')
  @UseGuards(InClassroomGuard)
  @Auth()
  async leaveClassroom(
    @User() user: UserEntity,
    @Classroom() classroom: ClassroomEntity,
    @Param('studentId') studentId: string,
  ) {
    if (!hasRole(user, Role.STAFF) && user.id !== studentId) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return await this.classroomService.removeStudent(studentId, classroom);
  }

  @Post('students')
  @Auth(Role.STUDENT)
  async joinClassroom(@User() student: StudentEntity, @Body() joinDTO: JoinClassroomDTO) {
    const classroom = await this.classroomService.findOneByCode(joinDTO.code);
    return await this.classroomService.joinClassroom(student, classroom);
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

    if (hasRole(user, Role.STAFF)) return await this.classroomService.findOne(id);

    if (!(user instanceof ProfessorEntity) && !(user instanceof StudentEntity))
      throw new HttpException('', HttpStatus.FORBIDDEN);

    return await this.classroomService.findClassroomOfUser(user, id);
  }

  @Patch(':id')
  @Auth(Role.STAFF)
  update(@Param('id') id: string, @Body() updateClassroomDto: ClassroomEntity) {
    return this.classroomService.update(id, updateClassroomDto);
  }

  @Delete(':id')
  @Auth(Role.PROFESSOR)
  remove(@Param('id') id: string) {
    return this.classroomService.remove(id);
  }
}
