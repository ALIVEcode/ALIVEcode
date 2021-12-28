/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { loadObj } from './utils';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Course } from './Course/course.entity';
import { Section } from './Course/section.entity';
import { Classroom } from './Classroom/classroom.entity';
import { Professor, Student, User } from './User/user.entity';
import { IoTProject, IoTProjectLayout } from './Iot/IoTproject.entity';
import { IotRoute } from './Iot/IoTroute.entity';
import { Level, LEVEL_TYPE } from './Level/level.entity';
import { LevelAlive } from './Level/levelAlive.entity';
import { LevelCode } from './Level/levelCode.entity';
import { LevelProgression } from './Level/levelProgression';
import { LevelAI } from './Level/levelAI.entity';
import { IoTObject } from './Iot/IoTobject.entity';
import { QueryDTO } from '../../../backend/src/models/level/dto/query.dto';
import { Category } from './Quiz/categories-quiz.entity';
import { QuizForm } from './Quiz/quizForm.entity';
import { QuestionForm } from './Quiz/questionForm.entity';
import { Answer } from './Quiz/answer.entity';
import { CategorySubject } from './Forum/categorySubject.entity';
import { Activity } from './Course/activity.entity';
import { Maintenance } from './Maintenance/maintenance.entity';
import { Result } from './Social/result.entity';
import { CompileDTO } from './ASModels';
import { AsScript } from './AsScript/as-script.entity';
import { LevelIoT } from './Level/levelIoT.entity';
import { Quiz } from './Quiz/quiz.entity';
import { Topics } from './Social/topics.entity';
import { Post } from './Forum/post.entity';

type urlArgType<S extends string> = S extends `${infer _}:${infer A}/${infer B}`
	? A | urlArgType<B>
	: S extends `${infer _}:${infer A}`
	? A
	: never;

const formatQuery = (query: { [name: string]: string }) => {
	return (
		'?' +
		Object.entries(query)
			.map(([name, value]) => `${name}=${value}`)
			.join('&')
	);
};

const formatUrl = <S extends string>(
	url: string,
	args: { [key in urlArgType<S>]: string },
	query?: { [name: string]: string },
) => {
	return (
		url
			.split('/')
			.map(part =>
				part.startsWith(':') ? args[part.substring(1) as urlArgType<S>] : part,
			)
			.join('/') + (query === undefined ? '' : formatQuery(query))
	);
};

const apiGet = <T, S extends string, U extends boolean>(
	url: S,
	target: ClassConstructor<T>,
	returnsArray: U,
	overrideCast?: (data: any) => T | T[],
) => {
	return async (
		args: { [key in urlArgType<S>]: string },
		query?: { [name: string]: string },
	) => {
		const formattedUrl = formatUrl(url, args, query);
		if (process.env.REACT_APP_DEBUG_AXIOS === 'true') {
			console.log('GET : ' + formattedUrl);
		}
		if (overrideCast !== undefined) {
			const data = await (await axios.get(formattedUrl)).data;
			return (
				Array.isArray(data)
					? data.map(d => overrideCast(d))
					: overrideCast(data)
			) as U extends true ? T[] : T;
		}
		return (await loadObj(formattedUrl, target)) as U extends true ? T[] : T;
	};
};

const apiDelete = <S extends string>(url: S) => {
	return async (
		args: { [key in urlArgType<S>]: string },
		query?: { [name: string]: string },
	) => {
		const formattedUrl = formatUrl(url, args, query);
		if (process.env.REACT_APP_DEBUG_AXIOS === 'true') {
			console.log('DELETE : ' + formattedUrl);
		}
		return await axios.delete(formattedUrl);
	};
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiCreate = <T>(moduleName: string, target: ClassConstructor<T>) => {
	return async (fields: any): Promise<T> => {
		if (process.env.REACT_APP_DEBUG_AXIOS === 'true') {
			console.log('POST : ' + moduleName);
			console.log(moduleName);
		}
		const data = (await axios.post(moduleName, fields)).data;
		return plainToClass(target, data);
	};
};

const apiUpdate = <T, S extends string>(
	url: S,
	target: ClassConstructor<T>,
	overrideCast?: (data: any) => T,
) => {
	return async (
		args: { [key in urlArgType<S>]: string },
		fields: object,
		query?: { [name: string]: string },
	): Promise<T> => {
		const formattedUrl = formatUrl(url, args, query);
		if (process.env.REACT_APP_DEBUG_AXIOS === 'true') {
			console.log('PATCH : ' + formattedUrl);
			console.log(fields);
		}
		const data = (await axios.patch(formattedUrl, fields)).data;
		if (overrideCast !== undefined) return overrideCast(data);
		return plainToClass(target, data);
	};
};

const api = {
	db: {
		maintenances: {
			async getMaintenances() {
				return (await axios.get('maintenances')).data.map((d: any) =>
					plainToClass(Maintenance, d),
				);
			},
			async getUpcoming(): Promise<Maintenance> {
				return plainToClass(
					Maintenance,
					(await axios.get('maintenances/upcoming')).data,
				);
			},
		},
		users: {
			iot: {
				getProjects: apiGet('users/iot/projects', IoTProject, true),
				getObjects: apiGet('users/iot/objects', IoTObject, true),
			},
			social: {
				getResults: apiGet('users/quizzes/results', Result, true),
			},
			//get: apiGetter('users', User),
			getClassrooms: apiGet('users/:id/classrooms', Classroom, true),
			getCourses: apiGet('users/:id/courses', Course, true),
			getRecentCourses: apiGet('users/:id/courses/recents', Course, true),
			getLevels: apiGet('users/:id/levels', Level, true, level => {
				if (level.type === LEVEL_TYPE.ALIVE)
					return plainToClass(LevelAlive, level);
				if (level.type === LEVEL_TYPE.CODE)
					return plainToClass(LevelCode, level);
				if (level.type === LEVEL_TYPE.AI) return plainToClass(LevelAI, level);
				if (level.type === LEVEL_TYPE.IOT) return plainToClass(LevelIoT, level);
				return plainToClass(LevelCode, level);
			}),
			createProfessor: apiCreate('users/professors', Professor),
			createStudent: apiCreate('users/students', Student),
			delete: apiDelete('users/:id'),
		},
		classrooms: {
			all: apiGet('classrooms', Classroom, true),
			get: apiGet('classrooms/:id/', Classroom, false),
			getCourses: apiGet('classrooms/:id/courses', Course, true),
			getStudents: apiGet('classrooms/:id/students', Student, true),
			create: apiCreate('classrooms', Classroom),
			delete: apiDelete('classrooms/:id'),
			join: apiCreate('classrooms/students', Classroom),
			leave: apiDelete('classrooms/:classroomId/students/:studentId'),
		},
		courses: {
			get: apiGet('courses/:id', Course, false),
			update: apiUpdate('courses/:id', Course),
			getSections: apiGet('courses/:id/sections', Section, true),
			deleteSection: apiDelete('courses/:courseId/sections/:sectionId'),
			deleteActivity: apiDelete(
				'courses/:courseId/sections/:sectionId/activities/:activityId',
			),
			delete: apiDelete('courses/:id'),
			async getActivities(courseId: string, sectionId: number) {
				return (
					await axios.get(
						`courses/${courseId}/sections/${sectionId}/activities`,
					)
				).data.map((c: any) => plainToClass(Activity, c));
			},
			async getActivityContent(
				courseId: string,
				sectionId: number,
				activityId: number,
			) {
				return plainToClass(
					Activity,
					(
						await axios.get(
							`courses/${courseId}/sections/${sectionId}/activities/${activityId}/content`,
						)
					).data,
				);
			},
			addActivity: async (
				courseId: string,
				sectionId: number,
				activity: Activity,
			) => {
				return plainToClass(
					Activity,
					(
						await axios.post(
							`courses/${courseId}/sections/${sectionId}/activities`,
							activity,
						)
					).data,
				);
			},
			updateActivity: apiUpdate(
				'courses/:courseId/sections/:sectionId/activities/:activityId/content',
				Activity,
			),
		},
		levels: {
			progressions: {
				get: apiGet('levels/:id/progressions/:userId', LevelProgression, false),
				save: apiUpdate('levels/:id/progressions/:userId', LevelProgression),
			},
			get: apiGet('levels/:id', Level, false, level => {
				if (level.type === LEVEL_TYPE.ALIVE)
					return plainToClass(LevelAlive, level);
				if (level.type === LEVEL_TYPE.CODE)
					return plainToClass(LevelCode, level);
				if (level.type === LEVEL_TYPE.AI) return plainToClass(LevelAI, level);
				if (level.type === LEVEL_TYPE.IOT) return plainToClass(LevelIoT, level);
				return plainToClass(LevelCode, level);
			}),
			update: apiUpdate('levels/:id', Level, level => {
				if (level.type === LEVEL_TYPE.ALIVE)
					return plainToClass(LevelAlive, level);
				if (level.type === LEVEL_TYPE.CODE)
					return plainToClass(LevelCode, level);
				if (level.type === LEVEL_TYPE.AI) return plainToClass(LevelAI, level);
				if (level.type === LEVEL_TYPE.IOT) return plainToClass(LevelIoT, level);
				return plainToClass(LevelCode, level);
			}),
			async query(body: QueryDTO) {
				return (await axios.post('levels/query', body)).data.map((d: any) =>
					plainToClass(Level, d),
				);
			},
		},
		iot: {
			projects: {
				delete: apiDelete('iot/projects/:id'),
				get: apiGet('iot/projects/:id', IoTProject, false),
				deleteRoute: apiDelete('iot/routes/projects/:projectId/:id'),
				getRoutes: apiGet('iot/projects/:id/routes', IotRoute, true),
				getObjects: apiGet('iot/projects/:id/objects', IoTObject, true),
				async updateLayout(id: string, layout: IoTProjectLayout) {
					await axios.patch(`iot/projects/${id}/layout`, layout);
				},
				async createScriptRoute(
					projectId: string,
					routeId: string,
					asScript: AsScript,
				) {
					return (
						await axios.post(`iot/projects/${projectId}/as/create`, {
							routeId,
							script: asScript,
						})
					).data;
				},
			},
			objects: {
				delete: apiDelete('iot/objects/:id'),
			},
		},
		asScript: {
			async create(asScript: AsScript) {
				return (await axios.post(`as`, asScript)).data;
			},
			async updateContent(asScript: AsScript, newContent: string) {
				return await axios.patch(`as/${asScript.id}/content`, {
					content: newContent,
				});
			},
		},
		quiz: {
			all: apiGet('/quizzes', Quiz, true),
			one: apiGet('/quizzes/:id', Quiz, false),
			create: apiCreate('/quizzes', QuizForm),
			update: apiUpdate('/quizzes/:id', QuizForm),
			delete: apiDelete('/quizzes/:id'),
			categories: {
				all: apiGet('/categories-quiz', Category, true),
				one: apiGet('/categories-quiz/:id', Category, false),
			},
		},
		question: {
			delete: apiDelete('/questions/:id'),
			create: apiCreate('/questions', QuestionForm),
		},
		answer: {
			create: apiCreate('/answers', Answer),
		},
		posts: {
			all: apiGet('posts', Post, true),
			get: apiGet('posts/:id/', Post, false),
			findandcount: apiCreate('posts/findandcount', Post),
			create: apiCreate('posts', Post),
			delete: apiDelete('posts/:id'),
		},
		forum: {
			categories: {
				get: apiGet('categories-subjects', CategorySubject, true),
				getById: apiGet('categories-subjects/:id', CategorySubject, false),
			},
			commentaires: {
				createComment: apiCreate('commentaires-forum', Comment),
			},
			getLastPost: apiGet('post/lastPost', Post, true),
			createQuestion: apiCreate('post', Post),
			getById: apiGet('post/:id', Post, false),
			getPost: apiGet('post', Post, true),

			posts: {
				all: apiGet('posts', Post, true),
				get: apiGet('posts/:id/', Post, false),
				findandcount: apiCreate('posts/findandcount', Post),
				create: apiCreate('posts', Post),
				delete: apiDelete('posts/:id'),
			},
		},
		topics: {
			all: apiGet('topics', Topics, true),
			get: apiGet('topics/:id/', Topics, false),
			create: apiCreate('topics', Topics),
			delete: apiDelete('topics/:id'),
		},
		results: {
			all: apiGet('results', Result, true),
			get: apiGet('results/:id/', Result, false),
			findandcount: apiCreate('results/findandcount', Result),
			create: apiCreate('results', Result),
			delete: apiDelete('results/:id'),
			getresultuser: apiGet('results/user', Result, true),
		},
	},
	as: {
		async compile(data: CompileDTO) {
			return (await axios.post('as/compile', data)).data;
		},
		async getLintInfo() {
			return (await axios.get(`${process.env.BACKEND_URL}/as/lintinfo`)).data;
		},
	},
};

export default api;
