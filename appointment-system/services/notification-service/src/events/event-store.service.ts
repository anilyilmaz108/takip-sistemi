import { Injectable } from '@nestjs/common';

@Injectable()
export class EventStoreService {
  private processedEvents = new Set<string>();

  isProcessed(eventId: string): boolean {
    return this.processedEvents.has(eventId);
  }

  markAsProcessed(eventId: string) {
    this.processedEvents.add(eventId);
  }
}