import { Injectable, HttpException, HttpStatus, Scope, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ProfessorEntity } from './entities/professor.entity';
import { StudentEntity } from './entities/student.entity';
import { UserEntity } from './entities/user.entity';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { createAccessToken, setRefreshToken, createRefreshToken } from './auth';
import { verify } from 'jsonwebtoken';
import { AuthPayload } from '../../utils/types/auth.payload';
import { REQUEST } from '@nestjs/core';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { LevelEntity } from '../level/entities/level.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { MyRequest } from '../../utils/guards/auth.guard';
import { Result } from '../social/results/entities/result.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  [x: string]: any;
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfessorEntity)
    private professorRepository: Repository<ProfessorEntity>,
    @InjectRepository(StudentEntity) private studentRepository: Repository<StudentEntity>,
    @InjectRepository(ClassroomEntity) private classroomRepository: Repository<ClassroomEntity>,
    @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
    @InjectRepository(IoTProjectEntity) private iotProjectRepository: Repository<IoTProjectEntity>,
    @InjectRepository(IoTObjectEntity) private iotObjectRepository: Repository<IoTObjectEntity>,
    @InjectRepository(LevelEntity) private levelRepository: Repository<LevelEntity>,
    @Inject(REQUEST) private req: MyRequest,
  ) {}
  async createStudent(createStudentDto: UserEntity) {
    const hashedPassword = await hash(createStudentDto.password, 12);
    createStudentDto.password = hashedPassword;

    try {
      const student = await this.studentRepository.save(this.studentRepository.create(createStudentDto));
      return student;
    } catch (err) {
      if ((err as any).detail.includes('Key (name)='))
        throw new HttpException('This username is already in use', HttpStatus.CONFLICT);

      throw new HttpException('This email is already in use', HttpStatus.CONFLICT);
    }
  }

  async createProfessor(createProfessorDto: ProfessorEntity) {
    const hashedPassword = await hash(createProfessorDto.password, 12);
    createProfessorDto.password = hashedPassword;

    try {
      const professor = await this.professorRepository.save(this.professorRepository.create(createProfessorDto));
      return professor;
    } catch {
      throw new HttpException('This email is already in use', HttpStatus.CONFLICT);
    }
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw 'Error';
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw 'Error';
    }

    setRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  logout(res: Response) {
    setRefreshToken(res, '');
    return {};
  }

  async refreshToken(res: Response) {
    const req = this.req;

    const refreshToken = req.cookies.wif;
    if (!refreshToken) throw new HttpException('No credentials were provided', HttpStatus.UNAUTHORIZED);

    let payload: AuthPayload;

    try {
      payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY) as AuthPayload;
    } catch {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }
    if (!payload) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    const user = await this.findById(payload.id);
    if (!user) throw new HttpException('', HttpStatus.UNAUTHORIZED);

    setRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  findAll() {
    return this.userRepository.find({ relations: ['classrooms'] });
  }

  findAllProfs() {
    return this.professorRepository.find();
  }

  findAllStudents() {
    return this.studentRepository.find();
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(userId: string, updateUserDto: UserEntity) {
    return await this.userRepository.update(userId, updateUserDto);
  }

  remove(user: UserEntity) {
    return this.userRepository.remove(user);
  }

  async getClassrooms(user: UserEntity) {
    if (user instanceof ProfessorEntity) return await this.classroomRepository.find({ where: { creator: user } });
    if (user instanceof StudentEntity)
      return (await this.studentRepository.findOne(user.id, { relations: ['classrooms'] })).classrooms;
    return [];
  }

  async getCourses(user: UserEntity) {
    if (user instanceof ProfessorEntity) return await this.courseRepository.find({ where: { creator: user } });
    if (user instanceof StudentEntity)
      return (await this.studentRepository.findOne(user.id, { relations: ['courses'] })).classrooms;
    return [];
  }

  async getIoTProjects(user: UserEntity) {
    return await this.iotProjectRepository.find({ where: { creator: user } });
  }

  async getIoTObjects(user: UserEntity) {
    return await this.iotObjectRepository.find({ where: { creator: user } });
  }
  async getResults(user: UserEntity) {
    return await this.userRepository.find({ where: {id: user } });
  }
  async getLevels(user: UserEntity, query: string) {
    return await this.levelRepository.find({
      where: { creator: user, name: ILike(`%${query ?? ''}%`) },
      order: {
        creationDate: 'DESC',
        name: 'ASC',
      },
    });
  }
}
