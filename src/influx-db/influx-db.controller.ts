import { Controller } from '@nestjs/common';
import { InfluxDbService } from './influx-db.service';

@Controller('influx-db')
export class InfluxDbController {
  constructor(private readonly influxDbService: InfluxDbService) {}
}
