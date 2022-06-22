import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MaintenanceEntity } from './entities/maintenance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';

@Injectable()
export class MaintenanceService {
  constructor(@InjectRepository(MaintenanceEntity) private maintenanceRepo: Repository<MaintenanceEntity>) {}
  private currentMaintenance: MaintenanceEntity | null = null;
  private lastCheck: number | null = null;

  async create(createMaintenanceDto: MaintenanceEntity) {
    return await this.maintenanceRepo.save(this.maintenanceRepo.create(createMaintenanceDto));
  }

  async findAll() {
    return await this.maintenanceRepo.find({ order: { startDate: 'DESC' } });
  }

  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const maintenance = await this.maintenanceRepo.findOne(id);
    if (!maintenance) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return maintenance;
  }

  async findUpcoming() {
    const maintenance = await this.maintenanceRepo.findOne({
      where: {
        finished: false,
        startDate: Raw(alias => `:date >= ${alias}`, { date: new Date(Date.now() + 1000 * 60 * 60 * 24) }),
      },
    });
    return maintenance || null;
  }

  async update(id: string, updateMaintenanceDto: MaintenanceEntity) {
    return await this.maintenanceRepo.save({
      id,
      ...updateMaintenanceDto,
    });
  }

  async remove(id: string) {
    return await this.maintenanceRepo.delete(id);
  }

  async getCurrentMaintenance() {
    if (!this.currentMaintenance || (this.lastCheck && Date.now() - this.lastCheck >= 1000 * 30)) {
      this.currentMaintenance = await this.maintenanceRepo.findOne({ where: { started: true, finished: false } });
      this.lastCheck = Date.now();
    }
    return this.currentMaintenance;
  }

  async startMaintenance(maintenance: MaintenanceEntity) {
    this.currentMaintenance = await this.maintenanceRepo.save({ ...maintenance, started: true });
    return this.currentMaintenance;
  }

  async stopMaintenance(maintenance: MaintenanceEntity) {
    this.currentMaintenance = await this.maintenanceRepo.save({ ...maintenance, finished: true, started: false });
    return this.currentMaintenance;
  }
}
