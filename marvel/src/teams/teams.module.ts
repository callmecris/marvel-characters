import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterEntity } from '../characters/entities/character.entity.js';
import { TeamsController } from './controllers/teams.controller.js';
import { TeamEntity } from './entities/team.entity.js';
import { TeamsService } from './services/teams.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity, CharacterEntity])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
