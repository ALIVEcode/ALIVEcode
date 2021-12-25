export interface UserEntity {
    id?: string;

    password: string,
    email: string,
    isMod: boolean,
    isAdmin: boolean,
    isSuperUser: boolean,
    joinDate: Date,
    image: string,
    name: string
}