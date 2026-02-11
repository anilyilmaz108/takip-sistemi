import { Injectable } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

@Injectable()
export class AppLogger {
  private logger;

  constructor() {
    const esTransport = new ElasticsearchTransport({
      level: 'info',
      clientOpts: {
        node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
      },
      index: 'appointment-logs',
    });

    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
      ),
      transports: [
        new transports.Console(),
        esTransport,
      ],
    });
  }

  log(message: any) {
    this.logger.info(message);
  }

  error(message: any) {
    this.logger.error(message);
  }

  warn(message: any) {
    this.logger.warn(message);
  }
}