import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { StudentEntity, ProfessorEntity } from './entities/user.entity';
import { UserEntity } from './entities/user.entity';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { ChallengeEntity } from '../challenge/entities/challenge.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { CourseHistoryEntity } from '../course/entities/course_history.entity';
import { NameMigrationDTO } from './dto/name_migration.dto';
import { QueryResources } from './dto/query_resources.dto';
import { ResourceEntity } from '../resource/entities/resource.entity';
import { QueryIoTProjects } from './dto/query_iotprojects.dto';
import { QueryIoTObjects } from './dto/query_iotobjects';

/**
 * All the methods to communicate to the database regarding users.
 * @author Enric Soldevila
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfessorEntity)
    private professorRepository: Repository<ProfessorEntity>,
    @InjectRepository(StudentEntity) private studentRepository: Repository<StudentEntity>,
    @InjectRepository(ClassroomEntity) private classroomRepository: Repository<ClassroomEntity>,
    @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
    @InjectRepository(CourseHistoryEntity) private courseHistoryRepo: Repository<CourseHistoryEntity>,
    @InjectRepository(ResourceEntity) private resourceRepo: Repository<ResourceEntity>,
    @InjectRepository(IoTProjectEntity) private iotProjectRepository: Repository<IoTProjectEntity>,
    @InjectRepository(IoTObjectEntity) private iotObjectRepository: Repository<IoTObjectEntity>,
    @InjectRepository(ChallengeEntity) private challengeRepo: Repository<ChallengeEntity>,
  ) {}

  async createStudent(createStudentDto: UserEntity) {
    const hashedPassword = await hash(createStudentDto.password, 12);
    createStudentDto.password = hashedPassword;

    try {
      return await this.studentRepository.save(createStudentDto);
    } catch (err) {
      if ((err as any).detail.includes('Key (email)='))
        throw new HttpException('This email is already in use', HttpStatus.CONFLICT);
    }
  }

  async createProfessor(createProfessorDto: ProfessorEntity) {
    const hashedPassword = await hash(createProfessorDto.password, 12);
    createProfessorDto.password = hashedPassword;

    try {
      const professor = await this.professorRepository.save(createProfessorDto);
      return professor;
    } catch (err) {
      if ((err as any).detail.includes('Key (email)='))
        throw new HttpException('This email is already in use', HttpStatus.CONFLICT);
    }
  }

  async findAll() {
    return await this.userRepository.find({ relations: ['classrooms'] });
  }

  async findAllProfs() {
    return await this.professorRepository.find();
  }

  async findAllStudents() {
    return await this.studentRepository.find();
  }

  async findByEmail(email: string) {
    if (!email) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async findById(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const user = await this.userRepository.findOne(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async findByIdAndEmail(id: string, email: string) {
    if (!email || !id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const user = await this.userRepository.findOne({ where: { id, email } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async nameMigration(userId: string, nameMigrationDto: NameMigrationDTO) {
    return await this.studentRepository.save({ ...nameMigrationDto, id: userId, oldStudentName: null });
  }

  async update(userId: string, updateUserDto: UserEntity) {
    return await this.userRepository.save({ ...updateUserDto, id: userId });
  }

  async remove(user: UserEntity) {
    return await this.userRepository.remove(user);
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
      return (
        await this.studentRepository.findOne(user.id, { relations: ['classrooms', 'classrooms.courses'] })
      ).classrooms.flatMap(c => c.courses);
    return [];
  }

  async getRecentCourses(user: UserEntity) {
    const courses = await this.courseHistoryRepo
      .createQueryBuilder('course_history')
      .leftJoinAndSelect('course_history.course', 'course')
      .leftJoinAndSelect('course.creator', 'creator')
      .leftJoinAndSelect('course_history.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('course_history.lastInteraction', 'DESC')
      .getMany();

    return courses.map(c => c.course);
  }

  async accessCourse(user: UserEntity, course: CourseEntity) {
    let courseHistory = await this.courseHistoryRepo
      .createQueryBuilder('course_history')
      .leftJoinAndSelect('course_history.course', 'course')
      .leftJoinAndSelect('course_history.user', 'user')
      .where('course.id = :courseId', { courseId: course.id })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOne();
    if (!courseHistory) {
      courseHistory = await this.courseHistoryRepo.save({
        user,
        course,
        lastInteraction: new Date(),
      });
    } else {
      courseHistory.lastInteraction = new Date();
      await this.courseHistoryRepo.save(courseHistory);
    }
  }

  /**
   * Gets the resources of the user depending on a search query
   * @param user User making the request
   * @param query Query to use when fetching the resources
   * @returns The queried resources
   */
  async getResources(user: ProfessorEntity, query?: QueryResources) {
    // const where: any = { creator: user, name: ILike(`%${query?.name ?? ''}%`) };
    // if (query.subject) where.subject = query.subject;
    // if (query.resourceTypes) where.type = In(query.resourceTypes);
    // No specific type of files
    // if (!query.fileMimeTypes) return await this.resourceRepo.find({ where, order: { updateDate: 'DESC' } });

    let sql = this.resourceRepo
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.creator', 'creator')
      .leftJoinAndSelect('resource.file', 'file')
      .orderBy('resource.updateDate', 'DESC');

    //FIXME : Probl??me lorsque s??lection d'un filtre ressource + fichier qui cause d'obtenir les ressources m??me si elles ne t'appartiennent pas
    if (query.fileMimeTypes && query.resourceTypes) {
      sql = sql.where('creator.id = :creatorId', { creatorId: user.id });
      if (query.name) sql = sql.andWhere('resource.name LIKE :name', { name: `%${query.name}%` });
      if (query.subject) sql = sql.andWhere('resource.subject = :subject', { subject: query.subject });
      sql = sql
        .andWhere('resource.type IN (:...resourceTypes)', { resourceTypes: query.resourceTypes })
        .orWhere('file.mimetype IN (:...mimeTypes)', { mimeTypes: query.fileMimeTypes })
        .andWhere('creator.id = :creatorId', { creatorId: user.id });
      if (query.name) sql = sql.andWhere('resource.name LIKE :name', { name: `%${query.name}%` });
      if (query.subject) sql = sql.andWhere('resource.subject = :subject', { subject: query.subject });
    } else {
      sql = sql.where('creator.id = :creatorId', { creatorId: user.id });
      if (query.name) sql = sql.andWhere('resource.name LIKE :name', { name: `%${query.name}%` });
      if (query.resourceTypes)
        sql = sql.andWhere('resource.type IN (:...resourceTypes)', { resourceTypes: query.resourceTypes });
      if (query.subject) sql = sql.andWhere('resource.subject = :subject', { subject: query.subject });
      if (query.fileMimeTypes)
        sql = sql.andWhere('file.mimetype IN (:...mimeTypes)', { mimeTypes: query.fileMimeTypes });
    }

    return await sql.getMany();
  }

  async getIoTProjects(user: UserEntity, query: QueryIoTProjects) {
    const where = { creator: user };
    if (query.name) where['name'] = ILike(`%${query.name}%`);
    return await this.iotProjectRepository.find({ where, order: { updateDate: 'DESC' } });
  }

  async getIoTObjects(user: UserEntity, query: QueryIoTObjects) {
    const where = { creator: user };
    if (query.name) where['name'] = ILike(`%${query.name}%`);
    return await this.iotObjectRepository.find({ where, order: { updateDate: 'DESC' } });
  }

  async getResults(user: UserEntity) {
    return await this.userRepository.find({ where: { id: user } });
  }

  async getChallenges(user: UserEntity, query: string) {
    return await this.challengeRepo.find({
      where: { creator: user, name: ILike(`%${query ?? ''}%`) },
      order: {
        creationDate: 'DESC',
        name: 'ASC',
      },
    });
  }

  /**
   * Changes the maximum ammount of storage the user is allowed to
   * @param user User making the request
   * @param storage The new value for the ammount of max storage the user is allocated
   * @returns The updated user
   */
  async alterStorageCapacity(user: UserEntity, storage: number) {
    return await this.userRepository.save({ ...user, storage });
  }

  /**
   * Changes the storage usage of the user
   * @param user User making the request
   * @param alterValue By how much the storage used should change
   * @returns The updated user
   */
  async alterStorageUsed(user: UserEntity, alterValue: number) {
    const userStorage = Number(user.storage);
    const userStorageUsed = Number(user.storageUsed);
    if (userStorage < userStorageUsed + alterValue)
      throw new HttpException('Exceeded maximum storage capacity for this user', HttpStatus.FORBIDDEN);
    return await this.userRepository.save({ ...user, storageUsed: userStorageUsed + alterValue });
  }

  /**
   * Generates a json webtoken containing informations about
   * the credentials used for connecting to the backend using the
   * UserSocketGateway
   * @param user User to generate the ticket for
   * @param ipAddress Ip address that wants to use the ticket
   */
  async generateWebsocketTicket(user: UserEntity, ipAddress: string) {
    const ticket = sign(
      {
        id: user.id,
        email: user.email,
        ip: ipAddress,
      },
      process.env.USER_SOCKET_TICKET_SECRET_KEY,
      { expiresIn: process.env.USER_SOCKET_TICKET_DURATION },
    );
    await this.userRepository.save({ ...user, ticket });
    return ticket;
  }

  /**
   * Disables the ticket used for the UserSocket for a certain
   * user
   * @param user User to disable the ticket of
   */
  async disableTicket(user: UserEntity) {
    await this.userRepository.save({ ...user, ticket: null });
  }
}
