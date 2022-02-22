import { Column, ChildEntity, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { IsEmpty } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';
