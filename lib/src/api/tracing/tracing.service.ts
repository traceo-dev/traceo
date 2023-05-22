import { Injectable, Logger } from '@nestjs/common';
import { ClickhouseService } from '../../common/services/clickhouse/clickhouse.service';

@Injectable()
export class TracingService {
    private readonly logger: Logger;
    constructor(
        private readonly clickhouseService: ClickhouseService
    ) {
        this.logger = new Logger(TracingService.name);
    }
}
