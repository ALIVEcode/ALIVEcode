import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { ShowcaseProjectGalleryGetDTO } from './dto/ShowcaseProjectGalleryGet.dto';
import { ShowcaseProjectService } from './showcase-project.service';

@Controller('showcase-project')
@UseInterceptors(DTOInterceptor)
export class ShowcaseProjectController {
  constructor(private readonly showcaseProjectService: ShowcaseProjectService) {}

  @Get()
  async findAll() {
    return await this.showcaseProjectService.findAll();
  }

  @Get('gallery')
  async getGallery(@Query() query: ShowcaseProjectGalleryGetDTO) {
    return await this.showcaseProjectService.getGallery(query);
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return await this.showcaseProjectService.findOne(name);
  }
}
