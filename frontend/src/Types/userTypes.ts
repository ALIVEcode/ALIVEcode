import { Professor, Student } from '../Models/User/user.entity';

export enum GRADES {
	S1 = 's1',
}

export enum USER_TYPES {
	STUDENT = 'S',
	PROFESSOR = 'P',
}

export interface ProfessorInterface {
	firstName: string;
	lastName: string;
}

export interface StudentInterface {
	name: string;
	grade?: GRADES;
}

export interface UserInterface {
	email: string;
	professor?: Professor;
	student?: Student;
}

export type BackendUser = {
	id: string;
	email: string;
	oldStudentName: string;
	scholarity: GRADES;
	firstName: string;
	lastName: string;
	type: USER_TYPES;
};
