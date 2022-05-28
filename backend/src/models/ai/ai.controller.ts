import { Controller, Get, Body, Patch, Param, UseInterceptors } from '@nestjs/common';
import { AiService } from './ai.service';
import { UpdateDatasetDTO } from './dto/UpdateDataset.dto';
import { ApiTags } from '@nestjs/swagger';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { UpdateModelDTO } from './dto/UpdateModel.dto';

/**
 * Controller for the AI requests
 *
 * Concerning AIModels and AIDatasets
 */
@Controller('ai')
@ApiTags('ai')
@UseInterceptors(DTOInterceptor)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /***** Datasets routes *****/

  @Get('datasets/:id')
  async findOneDataset(@Param('id') id: string) {
    return await this.aiService.findDataset(id);
  }

  @Patch('datasets/:id')
  async updateDataset(@Param('id') id: string, @Body() updateDatasetDto: UpdateDatasetDTO) {
    return await this.aiService.updateDataset(id, updateDatasetDto);
  }

  @Get('datasets')
  async findAllDatasets() {
    return await this.aiService.findAllDatasets();
  }

  /***** Datasets routes *****/

  @Get('modlels/:id')
  async findOneModel(@Param('id') id: string) {
    return await this.aiService.findModel(id);
  }

  @Patch('models/:id')
  async updateModel(@Param('id') id: string, @Body() updateModelDto: UpdateModelDTO) {
    return await this.aiService.updateModel(id, updateModelDto);
  }
}
