import { Module } from '@nestjs/common';
import { TurtleService } from './turtle.service';
// REVIEW: Je nutné mít modul pro jednu servisu?
@Module({
    providers: [TurtleService],
    exports: [TurtleService],
})
export class TurtleModule {}
