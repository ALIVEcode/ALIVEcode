import axios from 'axios';
import { Exclude, plainToClass } from 'class-transformer';
import { BackendUser } from '../../Types/userTypes';
import { Classroom } from '../Classroom/classroom.entity';
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

	public getDisplayName() {
		return this.email;
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
			return fetchedClassrooms;
		}
		return this.classrooms;
	}

	public async addClassroom(classroom: Classroom) {
		if (this.classrooms) this.classrooms.push(classroom);
		else (await this.getClassrooms()).push(classroom);
	}

	static async loadUser() {
		const backendUser: BackendUser = (await axios.get('/users/me')).data;
		try {
			if (backendUser.firstName && backendUser.lastName)
				return plainToClass(Professor, backendUser);
			if (backendUser.name) return plainToClass(Student, backendUser);

			throw new Error('Could not load user');
		} catch (err) {
			return null;
		}
	}
}

export class Student extends User {
	name: string;
	image: string;

	getDisplayName() {
		return this.name;
	}

	getDisplayImage() {
		return this.image;
	}
}

export class Professor extends User {
	firstName: string;
	lastName: string;
	image: string;

	getCourses() {
		return api.db.users.getCourses(this.id);
	}

	getDisplayName(): string {
		return `${this.firstName} ${this.lastName}`;
	}
	getDisplayImage() {
		return this.image;
	}
}
// DONT REMOVE THIS HERE (prevents class used before referenced)
const api = require('../api').default;
