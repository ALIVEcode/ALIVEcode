import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CourseService } from './course.service';
import { Repository, ILike } from 'typeorm';
import { CourseTemplateEntity } from './entities/bundles/course_template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfessorEntity } from '../user/entities/user.entity';
import { CreateCourseDTO } from './dtos/CreateCourse.dto';
import { BundleEntity } from './entities/bundles/bundle.entity';
import { QueryDTO } from '../challenge/dto/query.dto';
import { ResourceService } from '../resource/resource.service';

/**
 * All the methods to communicate to the database. To create/update/delete/get
 * a course or it's content (CourseElements)
 *
 * @author Enric Soldevila
 */
@Injectable()
export class BundleService {
  constructor(
    @InjectRepository(CourseTemplateEntity) private courseTemplateRepo: Repository<CourseTemplateEntity>,
    @InjectRepository(BundleEntity) private bundleRepo: Repository<BundleEntity>,
    @InjectRepository(ProfessorEntity) private profRepo: Repository<ProfessorEntity>,
    private readonly courseService: CourseService,
    private readonly resourceService: ResourceService,
  ) {}

  async findTemplate(id: string, prof?: ProfessorEntity) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

    let template: CourseTemplateEntity | null;
    if (prof) {
      template = await this.courseTemplateRepo
        .createQueryBuilder('courseTemplate')
        .leftJoin('courseTemplate.owners', 'owners')
        .where('courseTemplate.id = :courseTemplateId', { courseTemplateId: id })
        .andWhere('owners.id = :userId', { userId: prof.id })
        .orWhere('courseTemplate.isPublic = true')
        .getOne();
    } else {
      template = await this.courseTemplateRepo.findOne(id);
    }

    if (!template) throw new HttpException('CourseTemplate not found', HttpStatus.NOT_FOUND);
    return template;
  }

  async getOwnedAndPublicTemplates(prof: ProfessorEntity) {
    const courseTemplates = await this.courseTemplateRepo
      .createQueryBuilder('courseTemplate')
      .leftJoin('courseTemplate.owners', 'owners')
      .where('owners.id = :userId', { userId: prof.id })
      .orWhere('courseTemplate.isPublic = true')
      .getMany();
    return courseTemplates;
  }

  async createCourseFromTemplate(
    template: CourseTemplateEntity,
    prof: ProfessorEntity,
    createCourseDTO: CreateCourseDTO,
  ) {
    if (!template.course) template = await this.courseTemplateRepo.findOne(template.id, { relations: ['course'] });

    const course = await this.courseService.clone(template.course, prof, createCourseDTO.course);

    // If a classroom is specified, add the course to the classroom
    if (createCourseDTO.classId) {
      throw new HttpException('Course creation inside classroom is not implemented', HttpStatus.NOT_IMPLEMENTED);
      /*const classroom = await this.classroomRepo.findOne(createCourseDto.classId, { relations: ['courses'] });
      if (!classroom) throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
      classroom.courses.push(course);
      await this.classroomRepo.save(classroom);*/
    }
    return course;
  }

  async findQuery(query: QueryDTO) {
    return await this.bundleRepo.find({
      where: { name: ILike(`%${query?.txt ?? ''}%`) },
      order: {
        creationDate: 'DESC',
        name: 'ASC',
      },
    });
  }

  /**
   * Claims a bundle by an id for a specific user.
   * The user will inherit the courseTemplates form the bundle and a copy of the resources inside the bundle
   *
   * @param user User that claims the bundle
   * @param bundleId Id of the bundle to claim
   */
  async claimBundle(user: ProfessorEntity, bundleId: string) {
    // Finding bundle
    if (!bundleId) throw new HttpException('Bundle not found', HttpStatus.NOT_FOUND);
    const bundle = await this.bundleRepo.findOne(bundleId, { relations: ['resources', 'courseTemplates'] });
    if (!bundle) throw new HttpException('Bundle not found', HttpStatus.NOT_FOUND);

    // Loading courseTemplates of user
    if (!user.courseTemplates) user = await this.profRepo.findOne(user.id, { relations: ['courseTemplates'] });

    // Adding courseTemplates of bundle to user
    user.courseTemplates.push(...bundle.courseTemplates);
    await this.profRepo.save(user);

    const clonedResources = [];
    // Cloning and adding resources of bundle to user
    for (let i = 0; i < bundle.resources.length; i++) {
      clonedResources.push(await this.resourceService.clone(bundle.resources[i], user));
    }

    return { courseTemplates: bundle.courseTemplates, resources: clonedResources };
  }
}