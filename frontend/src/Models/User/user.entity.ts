import axios from 'axios';
import { Exclude, plainToClass } from 'class-transformer';
import { BackendUser } from '../../Types/userTypes';
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


	public getDisplayName() {
		return this.email;
	}


	public isProfessor() {
		return this instanceof Professor;
	}

	public isStudent() {
		return this instanceof Student;
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
	async getClassrooms() {
		return await api.db.users.getClassrooms(this.id);
	}

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

	getClassrooms() {
		return api.db.users.getClassrooms(this.id);
	}

	getDisplayName(): string {
		return `${this.firstName} ${this.lastName}`;
	}
	getDisplayImage() {
		return this.image;
	}
}
// DONT REMOVE THIS HERE (prevents class used before referenced)
const api = require('../api');