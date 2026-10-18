import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from '../teams/entities/team.entity.js';
import { CharactersController } from './controllers/characters.controller.js';
import { CharacterEntity } from './entities/character.entity.js';
import { CharactersService } from './services/characters.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterEntity, TeamEntity])],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
