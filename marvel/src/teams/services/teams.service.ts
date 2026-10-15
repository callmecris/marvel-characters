import { Injectable } from '@nestjs/common';
import { Team } from '../models/team.model.js';

@Injectable()
export class TeamsService {
  findAll(): Promise<Team[]> {
    // TODO: consultar la tabla `teams` en PostgreSQL (localhost:5433, ver .env.example)
    // SELECT id, name, base, founded_year, active, created_at, updated_at FROM teams ORDER BY id;
    return Promise.resolve([]);
  }
}
