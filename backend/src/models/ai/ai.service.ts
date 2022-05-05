import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateDatasetDTO } from './dto/UpdateDataset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AIDatasetEntity } from './entities/ai_dataset.entity';
import { Repository } from 'typeorm';
import { AIModelEntity } from './entities/ai_model.entity';
import { UpdateModelDTO } from './dto/UpdateModel.dto';

/**
 * Service for the AI branch of ALIVEcode
 *
 * Takes care of AIModels and AIDatasets
 */
@Injectable()
export class AiService {
  constructor(
    @InjectRepository(AIDatasetEntity) private readonly datasetRepo: Repository<AIDatasetEntity>,
    @InjectRepository(AIModelEntity) private readonly modelRepo: Repository<AIModelEntity>,
  ) {}

  /**
   * Finds a dataset by and id
   * @param id Id of the dataset to find
   * @returns The found dataset
   */
  async findDataset(id: string) {
    if (!id) throw new HttpException('No id specified, bad request', HttpStatus.BAD_REQUEST);
    const dataset = this.datasetRepo.findOne(id);
    if (!dataset) throw new HttpException('No dataset found', HttpStatus.NOT_FOUND);
    return dataset;
  }

  async updateDataset(id: string, updateDatasetDto: UpdateDatasetDTO) {
    return await this.datasetRepo.save({ ...updateDatasetDto, id });
  }

  async findModel(id: string) {
    if (!id) throw new HttpException('No id specified, bad request', HttpStatus.BAD_REQUEST);
    const model = this.modelRepo.findOne(id);
    if (!model) throw new HttpException('No dataset found', HttpStatus.NOT_FOUND);
    return model;
  }

  async updateModel(id: string, updateModelDto: UpdateModelDTO) {
    return await this.modelRepo.save({ ...updateModelDto, id });
  }
}
