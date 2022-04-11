import { Injectable } from '@nestjs/common';
import { CourseService } from './course.service';

/**
 * All the methods to communicate to the database. To create/update/delete/get
 * a course or it's content (CourseElements)
 *
 * @author Enric Soldevila
 */
@Injectable()
export class BundleService {
  constructor(private readonly courseService: CourseService) {}
}