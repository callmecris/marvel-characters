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
  Query,
} from '@nestjs/common';
import { CreateCharacterDto } from '../dto/create-character.dto.js';
import { UpdateCharacterDto } from '../dto/update-character.dto.js';
import { UpdateStatusDto } from '../dto/update-status.dto.js';
import { CharacterEntity } from '../entities/character.entity.js';
import { CharactersService } from '../services/characters.service.js';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('teamId') teamId?: string,
  ): Promise<CharacterEntity[]> {
    return this.charactersService.findAll(status, teamId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CharacterEntity> {
    return this.charactersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCharacterDto): Promise<CharacterEntity> {
    return this.charactersService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCharacterDto,
  ): Promise<CharacterEntity> {
    return this.charactersService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ): Promise<CharacterEntity> {
    return this.charactersService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.charactersService.remove(id);
  }
}
