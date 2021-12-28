import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reward {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    name : string;

}
