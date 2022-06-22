/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import {
	ClassConstructor,
	plainToClass,
	plainToInstance,
} from 'class-transformer';
import { CompileDTO, SupportedLanguagesAS } from './ASModels';
import { AsScript } from './AsScript/as-script.entity';
import { Classroom } from './Classroom/classroom.entity';
import { Course } from './Course/course.entity';
import { CourseContent, CourseElement } from './Course/course_element.entity';
import { Section } from './Course/section.entity';
import { CategorySubject } from './Forum/categorySubject.entity';
import { Post } from './Forum/post.entity';
import { IoTObject } from './Iot/IoTobject.entity';
import {
	IoTProject,
	IoTProjectDocument,
	IoTProjectLayout,
} from './Iot/IoTproject.entity';
import { IotRoute } from './Iot/IoTroute.entity';
import { ClassroomQueryDTO } from './Classroom/dto/ClassroomQuery.dto';
import { ChallengeQueryDTO } from './Challenge/dto/ChallengeQuery.dto';
import {
	Challenge,
	CHALLENGE_TYPE,
	SUPPORTED_LANG,
} from './Challenge/challenge.entity';
import { ChallengeAI } from './Challenge/challenges/challenge_ai.entity';
import { ChallengeAlive } from './Challenge/challenges/challenge_alive.entity';
import { ChallengeCode } from './Challenge/challenges/challenge_code.entity';
import { ChallengeIoT } from './Challenge/challenges/challenge_IoT.entity';
import { ChallengeProgression } from './Challenge/challengeProgression';
import { Maintenance } from './Maintenance/maintenance.entity';
import { Answer } from './Quiz/answer.entity';
import { Category } from './Quiz/categories-quiz.entity';
import { QuestionForm } from './Quiz/questionForm.entity';
import { Quiz } from './Quiz/quiz.entity';
import { QuizForm } from './Quiz/quizForm.entity';
import { Resource } from './Resource/resource.entity';
import { Result } from './Social/result.entity';
import { Topics } from './Social/topics.entity';
import { Professor, Student } from './User/user.entity';
import { loadObj } from './utils';
import { GenericResourceTransformer } from './Resource/transformer/GenericResourceTransformer';
import { MenuResourceCreationDTO } from '../Components/Resources/MenuResourceCreation/menuResourceCreationTypes';
import { Activity } from './Course/activity.entity';
import { QueryResources } from './Resource/dto/query_resources.dto';
import React from 'react';
import { GetMimeType } from '../Types/files.type';
import { IoTProjectObject } from './Iot/IoTprojectObject.entity';
import { IOT_EVENT } from './Iot/IoTProjectClasses/IoTTypes';
import { MoveElementDTO } from './Course/dto/MoveElement.dto';
import { FeedbackEntity } from './Feedbacks/entities/feedback.entity';
import { CreateFeedbackDto } from './Feedbacks/dto/create-feedback.dto';
import { UpdateCourseElementDTO } from './Course/dto/UpdateCourseElement.dto';
import { GetCourseTemplatesDTO } from './Course/bundles/dto/GetCourseTemplates.dto';
import { MenuCourseCreationDTO } from '../Components/Resources/MenuCourseCreation/menuCourseCreationTypes';
import { BundleQueryDTO } from './Course/bundles/dto/BundleQuery.dto';
import { Bundle } from './Course/bundles/bundle.entity';
import { ClaimBundleDTO } from './Course/bundles/dto/ClaimBundle.dto';
import { GenericChallengeTransformer } from './Challenge/transformer/GenericChallengeTransformer';

export type ResultElementCreated = {
	courseElement: CourseElement;
	newOrder: number[];
};

export type ResultPatchMoveElement = {
	orderNewParent: number[];
	orderOldParent: number[];
};

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
		if (process.env.DEBUG_AXIOS === 'true') {
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
		if (process.env.DEBUG_AXIOS === 'true') {
			console.log('DELETE : ' + formattedUrl);
		}
		return await axios.delete(formattedUrl);
	};
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiCreate = <T, DTO = any>(
	moduleName: string,
	target: ClassConstructor<T>,
	dto?: ClassConstructor<DTO>,
) => {
	return async (fields: DTO): Promise<T> => {
		if (process.env.DEBUG_AXIOS === 'true') {
			console.log('POST : ' + moduleName);
			console.log(moduleName);
		}
		const data = (await axios.post(moduleName, fields)).data;
		return plainToInstance(target, data);
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
		if (process.env.DEBUG_AXIOS === 'true') {
			console.log('PATCH : ' + formattedUrl);
			console.log(fields);
		}
		const data = (await axios.patch(formattedUrl, fields)).data;
		if (overrideCast !== undefined) return overrideCast(data);
		return plainToInstance(target, data);
	};
};

const api = {
	db: {
		feedback: {
			create: apiCreate('feedbacks', FeedbackEntity, CreateFeedbackDto),
		},
		maintenances: {
			async getMaintenances() {
				return (await axios.get('maintenances')).data.map((d: any) =>
					plainToClass(Maintenance, d),
				);
			},
			async getUpcoming(): Promise<Maintenance | null> {
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
			async getResources(userId: string, query: QueryResources) {
				return (
					await axios.get(
						`users/${userId}/resources?${
							query.name ? `name=${query.name}` : ''
						}${query.subject ? `&subject=${query.subject}` : ''}${
							query.resourceTypes ? `&resourceTypes=${query.resourceTypes}` : ''
						}${
							query.fileMimeTypes ? `&fileMimeTypes=${query.fileMimeTypes}` : ''
						}`,
					)
				).data.map((r: any) => plainToInstance(Resource, r)) as Resource[];
			},
			getChallenges: apiGet(
				'users/:id/challenges',
				Challenge,
				true,
				challenge => {
					if (challenge.type === CHALLENGE_TYPE.ALIVE)
						return plainToClass(ChallengeAlive, challenge);
					if (challenge.type === CHALLENGE_TYPE.CODE)
						return plainToClass(ChallengeCode, challenge);
					if (challenge.type === CHALLENGE_TYPE.AI)
						return plainToClass(ChallengeAI, challenge);
					if (challenge.type === CHALLENGE_TYPE.IOT)
						return plainToClass(ChallengeIoT, challenge);
					return plainToClass(ChallengeCode, challenge);
				},
			),
			createProfessor: apiCreate('users/professors', Professor),
			createStudent: apiCreate('users/students', Student),
			delete: apiDelete('users/:id'),
			nameMigration: async (firstName: string, lastName: string) => {
				return await axios.patch('users/nameMigration', {
					firstName,
					lastName,
				});
			},
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
			async query(body: ClassroomQueryDTO) {
				return (await axios.post('classrooms/query', body)).data.map((d: any) =>
					plainToClass(Classroom, d),
				);
			},
		},
		courses: {
			create: apiCreate('/courses', Course),
			get: apiGet('courses/:id', Course, false),
			update: apiUpdate('courses/:id', Course),
			getSections: apiGet('courses/:id/sections', Section, true),
			deleteSection: apiDelete('courses/:courseId/sections/:sectionId'),
			deleteActivity: apiDelete(
				'courses/:courseId/sections/:sectionId/activities/:activityId',
			),
			removeResourceFromActivity: apiDelete(
				'courses/:id/activities/:activityId/removeResource',
			),
			getActivityResource: apiGet(
				'courses/:courseId/activities/:activityId/resources',
				Resource,
				false,
			),
			getResourceFileInActivity: async (
				courseId: string,
				activityId: string,
			) => {
				const res = (
					await axios.get(`courses/${courseId}/activities/${activityId}/file`, {
						responseType: 'blob',
					})
				).data;
				return URL.createObjectURL(res);
			},
			async addCourseInsideClassroom(course: Course, classId: string) {
				return (await axios.post(`courses/${course.id}`, { classId })).data;
			},
			async addResourceInActivity(
				course: Course,
				activity: Activity,
				resource: Resource,
			) {
				return (
					await axios.post(
						`courses/${course.id}/activities/${activity.id}/addResource`,
						{ resourceId: resource.id },
					)
				).data;
			},
			async downloadResourceFileInActivity(
				course: Course,
				activity: Activity,
				extension: string,
			) {
				const mimeType = GetMimeType(extension);
				if (!mimeType) return null;
				return await axios.get(
					`courses/${course.id}/activities/${activity.id}/download`,
					{
						responseType: 'arraybuffer',
						headers: { accept: mimeType },
					},
				);
			},
			delete: apiDelete('courses/:id'),
			async getActivities(courseId: string, sectionId: number) {
				return (
					await axios.get(
						`courses/${courseId}/sections/${sectionId}/activities`,
					)
				).data.map((c: any) => plainToInstance(Activity as any, c));
			},
			async getActivityContent(
				courseId: string,
				sectionId: number,
				activityId: number,
			) {
				return plainToClass(
					// @ts-ignore
					Activity,
					(
						await axios.get(
							`courses/${courseId}/sections/${sectionId}/activities/${activityId}/content`,
						)
					).data,
				);
			},
			getElements: apiGet('courses/:courseId/elements', CourseElement, true),
			getElementsInSection: apiGet(
				'courses/:courseId/sections/:sectionId/elements',
				CourseElement,
				true,
			),
			getElement: apiGet(
				'courses/:courseId/elements/:elementId',
				CourseElement,
				false,
			),
			updateElement: async (
				courseId: string,
				elementId: string,
				dto: UpdateCourseElementDTO,
			): Promise<CourseElement[]> => {
				const updatedElements = (
					await axios.patch(`courses/${courseId}/elements/${elementId}`, dto)
				).data;
				return updatedElements.map((updatedElement: object) =>
					plainToInstance(CourseElement, updatedElement),
				);
			},
			addContent: async (
				courseId: string,
				courseContent: CourseContent,
				name: string,
				sectionParentId?: number,
			) => {
				const contentAndOrder = (
					await axios.post(
						`courses/${courseId}/${
							courseContent instanceof Activity ? 'activities' : 'sections'
						}`,
						{
							courseContent,
							name,
							sectionParentId,
						},
					)
				).data;
				return {
					courseElement: plainToClass(
						CourseElement,
						contentAndOrder.courseElement,
					),
					newOrder: contentAndOrder.newOrder,
				} as ResultElementCreated;
			},
			deleteElement: apiDelete('courses/:courseId/elements/:elementId'),
			updateActivity: apiUpdate(
				'courses/:courseId/activities/:activityId',
				Activity as any,
			),
			moveElement: async (courseId: string, dto: MoveElementDTO) => {
				const res = (await axios.patch(`courses/${courseId}/moveElement`, dto))
					.data;
				return res as ResultPatchMoveElement;
			},
			loadChallenge: async (courseId: string, activityId: string) => {
				return (
					plainToInstance(GenericChallengeTransformer, {
						challenge: (
							await axios.get(
								`courses/${courseId}/activities/${activityId}/loadChallenge`,
							)
						).data,
					}) as any
				).challenge;
			},
		},
		resources: {
			delete: apiDelete('resources/:id'),
			create: async (
				dto: MenuResourceCreationDTO,
				progressSetter?: React.Dispatch<React.SetStateAction<number>>,
			) => {
				let formdata = null;
				if (dto.file) {
					formdata = new FormData();
					formdata.append('data', JSON.stringify(dto));
					formdata.append('file', dto.file);
				}
				return plainToInstance(GenericResourceTransformer, {
					resource: (
						await axios.post(`resources`, formdata || dto, {
							onUploadProgress: progressEvent => {
								progressSetter &&
									progressSetter(
										Math.round(
											(progressEvent.loaded * 100) / progressEvent.total,
										),
									);
							},
						})
					).data,
				}).resource;
			},
			update: async <T extends Resource>(
				resource: T,
				fields: Omit<T, keyof Resource> | MenuResourceCreationDTO,
			) => {
				const dto =
					'uuid' in fields
						? (fields as MenuResourceCreationDTO)
						: {
								uuid: resource.id,
								type: resource.type,
								resource: {
									name: resource.name,
									subject: resource.subject,
									...fields,
								},
						  };
				const axiosRes = (await axios.patch(`resources/${resource.id}`, dto))
					.data;
				return plainToInstance(GenericResourceTransformer, {
					resource: axiosRes,
				}).resource;
			},
		},
		bundles: {
			async getCourseTemplates() {
				return (
					plainToInstance(GetCourseTemplatesDTO, {
						templates: (await axios.get(`bundles/courseTemplates`)).data,
					}) as any
				).templates;
			},
			async createCourseFromTemplate(
				templateId: string,
				course: MenuCourseCreationDTO,
			) {
				return plainToInstance(
					Course,
					(
						await axios.post(
							`bundles/courseTemplates/${templateId}/createCourse`,
							course,
						)
					).data,
				) as any as Course;
			},
			async query(body: BundleQueryDTO) {
				return (await axios.post('bundles/query', body)).data.map((d: any) =>
					plainToInstance(Bundle, d),
				);
			},
			async claimBundle(bundleId: string) {
				return plainToInstance(
					ClaimBundleDTO,
					await axios.post(`bundles/${bundleId}/claim`),
				) as any as ClaimBundleDTO;
			},
		},
		challenges: {
			progressions: {
				get: apiGet(
					'challenges/:id/progressions/:userId',
					ChallengeProgression,
					false,
				),
				save: apiUpdate(
					'challenges/:id/progressions/:userId',
					ChallengeProgression,
				),
			},
			get: apiGet(
				'challenges/:id',
				Challenge,
				false,
				(challenge: object & { type: CHALLENGE_TYPE }): Challenge => {
					switch (challenge.type as CHALLENGE_TYPE) {
						case CHALLENGE_TYPE.CODE:
							return plainToInstance(ChallengeCode, challenge);
						case CHALLENGE_TYPE.ALIVE:
							return plainToInstance(ChallengeAlive, challenge);
						case CHALLENGE_TYPE.IOT:
							return plainToInstance(ChallengeIoT, challenge);
						case CHALLENGE_TYPE.AI:
							return plainToInstance(ChallengeAI, challenge);
						default:
							throw new Error(`Unknown type ${challenge.type}`);
					}
				},
			),
			update: apiUpdate(
				'challenges/:id',
				Challenge,
				(challenge: object & { type: CHALLENGE_TYPE }): Challenge => {
					switch (challenge.type as CHALLENGE_TYPE) {
						case CHALLENGE_TYPE.CODE:
							return plainToInstance(ChallengeCode, challenge);
						case CHALLENGE_TYPE.ALIVE:
							return plainToInstance(ChallengeAlive, challenge);
						case CHALLENGE_TYPE.IOT:
							return plainToInstance(ChallengeIoT, challenge);
						case CHALLENGE_TYPE.AI:
							return plainToInstance(ChallengeAI, challenge);
						default:
							throw new Error(`Unknown type ${challenge.type}`);
					}
				},
			),
			async query(body: ChallengeQueryDTO) {
				return (await axios.post('challenges/query', body)).data.map((d: any) =>
					plainToClass(Challenge, d),
				);
			},
		},
		iot: {
			projects: {
				aliot: {
					getDoc: async (userId: string) => {
						return (
							await axios.post(`iot/aliot/${IOT_EVENT.GET_DOC}`, { id: userId })
						).data;
					},
					getField: async (userId: string, field: string) => {
						return (
							await axios.post(`iot/aliot/${IOT_EVENT.GET_FIELD}`, {
								id: userId,
								field,
							})
						).data;
					},
				},
				delete: apiDelete('iot/projects/:id'),
				get: apiGet('iot/projects/:id', IoTProject, false),
				deleteRoute: apiDelete('iot/routes/projects/:projectId/:id'),
				getRoutes: apiGet('iot/projects/:id/routes', IotRoute, true),
				getObjects: apiGet('iot/projects/:id/objects', IoTProjectObject, true),
				getScripts: apiGet('iot/projects/:id/scripts', AsScript, true),
				async updateLayout(id: string, layout: IoTProjectLayout) {
					await axios.patch(`iot/projects/${id}/layout`, layout);
				},
				async updateDocument(id: string, document: IoTProjectDocument) {
					return plainToInstance(
						IoTProject,
						(await axios.patch(`iot/projects/${id}/document`, document))
							.data as object,
					);
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
				async createScript(project: IoTProject, script: AsScript) {
					return plainToInstance(
						AsScript,
						(
							await axios.post(`iot/projects/${project.id}/createScript`, {
								script,
							})
						).data as object,
					);
				},
				async setScriptOfObject(
					project: IoTProject,
					projectObject: IoTProjectObject,
					script: AsScript,
				) {
					return plainToInstance(
						AsScript,
						(
							await axios.patch(
								`iot/projects/${project.id}/objects/${projectObject.id}/setScript`,
								{
									scriptId: script.id,
								},
							)
						).data,
					);
				},
			},
			objects: {
				delete: apiDelete('iot/objects/:id'),
				async connectObjectToProject(object: IoTObject, project: IoTProject) {
					return plainToInstance(
						IoTObject,
						(
							await axios.patch(`iot/objects/${object.id}/connectProject`, {
								projectId: project.id,
							})
						).data as object,
					);
				},
				async disconnectObjectFromProject(
					object: IoTObject,
					project: IoTProject,
				) {
					return plainToInstance(
						IoTObject,
						(
							await axios.patch(`iot/objects/${object.id}/disconnectProject`, {
								projectId: project.id,
							})
						).data as object,
					);
				},
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
		async compile(data: CompileDTO, lang?: SupportedLanguagesAS) {
			return (
				await axios.post(`as/compile?lang=${lang ?? SUPPORTED_LANG.FR}`, data)
			).data;
		},
		async getLintInfo(lang?: SupportedLanguagesAS) {
			return (
				await axios.get(
					`${process.env.BACKEND_URL}/as/lintinfo?lang=${
						lang ?? SUPPORTED_LANG.FR
					}`,
				)
			).data;
		},
	},
};

export default api;
