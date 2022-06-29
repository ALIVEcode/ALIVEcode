import { IsUUID } from 'class-validator';

/**
 * DTO to create a course (Data Transfer Object)
 * @author Enric Soldevila
 */
export class AddCourseInClassroomDTO {
  /** (OPTIONAL) id of the classroom to create the course in */
  @IsUUID()
  classId: string;
}