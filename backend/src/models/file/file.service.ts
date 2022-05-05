import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { unlinkSync } from 'fs';
import { FileEntity } from './entities/file.entity';
import { CreateFileDTO } from './dto/CreateFile.dto';

/**
 * Service that handles CRUD operations with the database
 * and the filesystem for files.
 * @author Maxime Gazze
 */
@Injectable()
export class FileService {
  constructor(@InjectRepository(FileEntity) private readonly fileRepo: Repository<FileEntity>) {}

  async create(dto: CreateFileDTO) {
    return await this.fileRepo.save(dto);
  }

  async del(file: FileEntity) {
    unlinkSync(file.path);
    return await this.fileRepo.delete(file);
  }
}
