import { Module } from '@nestjs/common';
import { TeamsController } from './controllers/teams.controller.js';
import { TeamsService } from './services/teams.service.js';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
