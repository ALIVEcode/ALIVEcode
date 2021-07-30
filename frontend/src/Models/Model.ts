import { Classroom } from './Playground/Classroom';
import Course from './Playground/Course';
import { Student } from "./User"
import { loadObj } from "./utils"

interface Model {
    readonly dependencies: {
        [name: string]: Function
    }
}


/** 
 * Level of abstraction to access the database from the frontend
 * @author: Mathis Laroche
 */
export const Database = {
    /** All the models in playground */
    playground: {
        /** Contains all the request and actions that can be done to the classrooms */
        classrooms: {
            /** @returns an array of all the classrooms that the user created */
            get all(): Promise<Classroom[]> {
                return loadObj(`/playground/classrooms`, Classroom) as Promise<Classroom[]>
            },
            /** 
             * Request one or more {@link Classroom classroom} object *that the user created* from the backend
             * @param ids ids of the classroom that the user created and want to access
             * @throws an error if the user doesn't pass any id
             * @returns `one` id is passed:  
             *              > the {@link Classroom classroom} with the corresponding id  
             *          `more than one` id is passed:  
             *              > an {@link Array array} containing the {@link Classroom classrooms} with the corresponding id
             */
            collect(...ids: string[]): Promise<Classroom | Classroom[]> {
                if (ids.length === 0) throw new Error("You need to specify at least one id to collect");

                else if (ids.length === 1) return loadObj(`/playground/classrooms/${ids[0]}`, Classroom) as Promise<Classroom>

                else return Promise.all(ids.map((id) => loadObj(`/playground/classrooms/${id}`, Classroom))) as Promise<Classroom[]>;
            },
            get ofCurrentUser(): Promise<Classroom[]> {
                return loadObj(`/playground/classrooms`, Classroom) as Promise<Classroom[]>
            },
            /**
             * This is an **intermediate operation** used to access a certain {@link Classroom classroom} 
             * without doing a request to the server yet
             * @param id the id of the {@link Classroom classroom} that you want to access
             * @returns an object containing getters that will request certain field(s) from the {@link Classroom classroom}
             * with the corresponding id
             */
            get(id: string) {
                return {
                    /** Is equivalent to {@link Database.playground.classrooms.collect Database.playground.classrooms.collect(id)} */
                    get collect(): Promise<Classroom> {
                        return loadObj(`/playground/classrooms/${id}`, Classroom) as Promise<Classroom>
                    },
                    /** 
                     * Returns a {@link Promise promise} that, once resolve,
                     * returns all the {@link Student students} member of the {@link Classroom classroom} 
                     */
                    get students(): Promise<Student[]> {
                        return loadObj(`/playground/classrooms/${id}/students`, Student) as Promise<Student[]>
                    },
                    /** 
                     * Returns a {@link Promise promise} that, once resolve,
                     * returns all the {@link Course courses} in the {@link Classroom classroom} 
                     */
                    get courses(): Promise<Course[]> {
                        return loadObj(`/playground/classrooms/${id}/courses`, Course) as Promise<Course[]>
                    }
                }
            }
        },
        courses: {
            /** @returns an array of all the courses that the user created */
            get all(): Promise<Course[]> {
                return loadObj(`/playground/courses`, Course) as Promise<Course[]>
            },
            /** 
             * Request one or more {@link Course course} object *that the user created* from the backend
             * @param ids ids of the course that the user created and want to access
             * @throws an error if the user doesn't pass any id
             * @returns `one` id is passed:  
             *              > the {@link Course course} with the corresponding id  
             *          `more than one` id is passed:  
             *              > an {@link Array array} containing the {@link Course courses} with the corresponding id
             */
            collect(...ids: string[]): Promise<Course | Course[]> {
                if (ids.length === 0) throw new Error("You need to specify at least one id to collect");

                else if (ids.length === 1) return loadObj(`/playground/courses/${ids[0]}`, Course) as Promise<Course>

                else return Promise.all(ids.map((id) => loadObj(`/playground/courses/${id}`, Course))) as Promise<Course[]>;
            },
            /**
             * This is an **intermediate operation** used to access a certain {@link Course course} 
             * without doing a request to the server yet
             * @param id the id of the {@link Course course} that you want to access
             * @returns an object containing getters that will request certain field(s) from the {@link Course course}
             * with the corresponding id
             */
            get(id: string) {
                return {
                    /** Is equivalent to {@link Database.playground.courses.collect Database.playground.courses.collect(id)} */
                    get collect(): Promise<Course> {
                        return loadObj(`/playground/courses/${id}`, Course) as Promise<Course>
                    }
                }
            }
        },
        levels: {

        }
    }
}




export default Model