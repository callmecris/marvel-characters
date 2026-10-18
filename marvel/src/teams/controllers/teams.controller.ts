import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CharacterEntity } from '../../characters/entities/character.entity.js';
import { AssignCharactersDto } from '../dto/assign-characters.dto.js';
import { CreateTeamDto } from '../dto/create-team.dto.js';
import { UpdateTeamDto } from '../dto/update-team.dto.js';
import { TeamEntity } from '../entities/team.entity.js';
import { TeamsService } from '../services/teams.service.js';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll(): Promise<TeamEntity[]> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TeamEntity> {
    return this.teamsService.findOne(id);
  }

  @Get(':id/characters')
  findCharacters(@Param('id', ParseIntPipe) id: number): Promise<CharacterEntity[]> {
    return this.teamsService.findCharacters(id);
  }

  @Post()
  create(@Body() dto: CreateTeamDto): Promise<TeamEntity> {
    return this.teamsService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeamDto,
  ): Promise<TeamEntity> {
    return this.teamsService.update(id, dto);
  }

  @Patch(':id/characters')
  assignCharacters(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignCharactersDto,
  ): Promise<TeamEntity> {
    return this.teamsService.assignCharacters(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.teamsService.remove(id);
  }
}
