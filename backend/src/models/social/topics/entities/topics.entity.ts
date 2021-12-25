import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Topics {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    name : string; 

}
