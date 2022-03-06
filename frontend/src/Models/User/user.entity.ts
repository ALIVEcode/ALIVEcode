import axios from 'axios';
import { Exclude, plainToClass } from 'class-transformer';
import { BackendUser, USER_TYPES } from '../../Types/userTypes';
import { Classroom } from '../Classroom/classroom.entity';
import { Course } from '../Course/course.entity';
import { IoTObject } from '../Iot/IoTobject.entity';
import { IoTProject } from '../Iot/IoTproject.entity';
import { Level } from '../Level/level.entity';

/**
 * Frontend user model
 *
 * @author MoSk3
 */
export class User {
	@Exclude({ toPlainOnly: true })
	id: string;

	firstName: string;
	lastName: string;

	@Exclude({ toPlainOnly: true })
	password?: string;

	email: string;

	@Exclude({ toPlainOnly: true })
	isMod?: boolean;

	@Exclude({ toPlainOnly: true })
	isAdmin?: boolean;

	@Exclude({ toPlainOnly: true })
	isSuperUser?: boolean;

	levels?: Level[];

	IoTObjects?: IoTObject[];

	IoTProjects?: IoTProject[];

	collabIoTProjects?: IoTProject[];

	private classrooms?: Classroom[];

	private courses?: Course[];

	public getDisplayName(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	public isProfessor() {
		return this instanceof Professor;
	}

	public isStudent() {
		return this instanceof Student;
	}

	public async getClassrooms() {
		if (!this.classrooms) {
			const fetchedClassrooms: Classroom[] =
				(await api.db.users.getClassrooms({ id: this.id })) ?? [];
			this.classrooms = fetchedClassrooms;
			return fetchedClassrooms;
		}
		return this.classrooms;
	}

	public async getCourses() {
		if (!this.courses) {
			console.log(this.id);
			const fetchedCourses: Course[] =
				(await api.db.users.getCourses({ id: this.id })) ?? [];
			this.courses = fetchedCourses;
			return fetchedCourses;
		}
		return this.courses;
	}

	public async addClassroom(classroom: Classroom) {
		(await this.getClassrooms()).push(classroom);
	}

	public async addCourse(course: Course) {
		(await this.getCourses()).push(course);
	}

	public async removeClassroom(classroom: Classroom) {
		this.classrooms = (await this.getClassrooms()).filter(
			c => c.id !== classroom.id,
		);
	}

	static async loadUser() {
		const backendUser: BackendUser = (await axios.get('/users/me')).data;
		try {
			if (backendUser.type === USER_TYPES.PROFESSOR)
				return plainToClass(Professor, backendUser);
			if (backendUser.type === USER_TYPES.STUDENT)
				return plainToClass(Student, backendUser);

			throw new Error('Could not load user');
		} catch (err) {
			return null;
		}
	}
}

export class Student extends User {
	oldStudentName?: string;
	image: string;

	getDisplayImage() {
		return this.image;
	}

	getDisplayName() {
		if (!this.firstName || !this.lastName)
			return this.oldStudentName || 'Unnamed';
		return super.getDisplayName();
	}
}

export class Professor extends User {
	image: string;

	getDisplayImage() {
		return this.image;
	}
}
// DONT REMOVE THIS HERE (prevents class used before referenced)
const api = require('../api').default;
