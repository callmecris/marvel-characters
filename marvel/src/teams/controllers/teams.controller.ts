import { Controller, Get } from '@nestjs/common';
import { Team } from '../models/team.model.js';
import { TeamsService } from '../services/teams.service.js';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }
}
