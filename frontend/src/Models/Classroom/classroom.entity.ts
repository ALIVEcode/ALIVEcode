import { Exclude, Type } from 'class-transformer';
import { getSubjectIcon, SUBJECTS } from '../../Types/sharedTypes';
import api from '../api';
import { Course } from '../Course/course.entity';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { Professor, Student } from '../User/user.entity';

export enum CLASSROOM_ACCESS {
	PUBLIC = 'PU', // can be found via a search
	PRIVATE = 'PR', // only accessible to the creator
}

export class Classroom extends CreatedByUser {
	@Exclude({ toPlainOnly: true })
	@Type(() => Professor)
	creator: Professor;

	// The code consists of letters from a-z and numbers from 0-9 | case non-senstive
	code?: string;

	subject: SUBJECTS;
	access: CLASSROOM_ACCESS;

	students?: Student[];
	courses?: Course[];

	async getCourses() {
		this.courses = await api.db.classrooms.getCourses({ id: this.id });
		return this.courses;
	}

	async getStudents() {
		this.students = await api.db.classrooms.getStudents({ id: this.id });
		return this.students;
	}

	async addCourse(course: Course) {
		if (!this.courses) this.courses = await this.getCourses();
		this.courses.push(course);
	}

	getSubjectDisplay() {
		return this.subject[0].toUpperCase() + this.subject.slice(1);
	}

	getSubjectIcon() {
		return getSubjectIcon(this.subject);
	}
}
