// import { Exclude, Expose } from 'class-transformer';
// import { IsEmail, IsEmpty, IsNotEmpty, Length, Matches } from 'class-validator';
// import {
//   BaseEntity,
//   Column,
//   Entity,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   TableInheritance,
//   CreateDateColumn,
// } from 'typeorm';

// @Entity()
// @TableInheritance({ column: 'type' })
// export class UploadEntity extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   @Exclude({ toClassOnly: true })
//   id: string;
//   @Column({ type: 'varchar', default: '' })
//   image: string;
// }
