import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CourseService } from './course.service';
import { Repository } from 'typeorm';
import { CourseTemplateEntity } from './entities/bundles/course_template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfessorEntity } from '../user/entities/user.entity';

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
    private readonly courseService: CourseService,
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

  async createCourseFromTemplate(template: CourseTemplateEntity, prof: ProfessorEntity) {
    if (!template.course) template = await this.courseTemplateRepo.findOne(template.id, { relations: ['course'] });
    return await this.courseService.clone(template.course, prof);
  }
}