import { UserEntity } from "src/models/user/entities/user.entity";
import { Timestamp } from "typeorm";
import { Subject } from "../../subjects/entities/subject.entity";


export class CreatePostDto {
    
    title : string;

    content : string;

    created_at : Timestamp;

    User : UserEntity;

    subject : Subject;

}
