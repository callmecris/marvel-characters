import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from '../../teams/entities/team.entity.js';
import { CreateCharacterDto } from '../dto/create-character.dto.js';
import { UpdateCharacterDto } from '../dto/update-character.dto.js';
import { CharacterEntity } from '../entities/character.entity.js';
import { CharacterStatus } from '../enums/character-status.enum.js';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(CharacterEntity)
    private readonly characterRepository: Repository<CharacterEntity>,
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
  ) {}

  async findAll(status?: string, teamId?: string): Promise<CharacterEntity[]> {
    const where: any = {};

    if (status !== undefined) {
      if (!Object.values(CharacterStatus).includes(status as CharacterStatus)) {
        throw new BadRequestException('The status is not valid');
      }
      where.status = status;
    }

    if (teamId !== undefined) {
      if (isNaN(Number(teamId))) {
        throw new BadRequestException('The teamId must be a number');
      }
      where.team_id = Number(teamId);
    }

    return this.characterRepository.find({ where, order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<CharacterEntity> {
    const character = await this.characterRepository.findOne({
      where: { id },
      relations: ['team'],
    });
    if (!character) {
      throw new NotFoundException('The character with the given id was not found');
    }
    return character;
  }

  async create(dto: CreateCharacterDto): Promise<CharacterEntity> {
    await this.checkAliasIsFree(dto.alias);
    if (dto.team_id !== undefined && dto.team_id !== null) {
      await this.checkTeam(dto.team_id);
    }

    const character = this.characterRepository.create({
      real_name: dto.real_name,
      alias: dto.alias,
      main_power: dto.main_power,
      power_level: dto.power_level,
      status: dto.status ?? CharacterStatus.ACTIVE,
      is_villain: dto.is_villain ?? false,
      team_id: dto.team_id ?? null,
    });
    return this.characterRepository.save(character);
  }

  async update(id: number, dto: UpdateCharacterDto): Promise<CharacterEntity> {
    const character = await this.characterRepository.findOneBy({ id });
    if (!character) {
      throw new NotFoundException('The character with the given id was not found');
    }

    await this.checkAliasIsFree(dto.alias, id);
    if (dto.team_id !== undefined && dto.team_id !== null) {
      await this.checkTeam(dto.team_id);
    }
    this.checkStatusChange(character.status, dto.status);

    character.real_name = dto.real_name;
    character.alias = dto.alias;
    character.main_power = dto.main_power;
    character.power_level = dto.power_level;
    character.status = dto.status;
    character.is_villain = dto.is_villain;
    character.team_id = dto.team_id ?? null;

    return this.characterRepository.save(character);
  }

  async updateStatus(id: number, status: CharacterStatus): Promise<CharacterEntity> {
    const character = await this.characterRepository.findOneBy({ id });
    if (!character) {
      throw new NotFoundException('The character with the given id was not found');
    }

    this.checkStatusChange(character.status, status);

    character.status = status;
    return this.characterRepository.save(character);
  }

  async remove(id: number): Promise<void> {
    const character = await this.characterRepository.findOneBy({ id });
    if (!character) {
      throw new NotFoundException('The character with the given id was not found');
    }
    await this.characterRepository.remove(character);
  }

  private async checkAliasIsFree(alias: string, currentId?: number): Promise<void> {
    const existing = await this.characterRepository.findOneBy({ alias });
    if (existing && existing.id !== currentId) {
      throw new ConflictException('A character with the given alias already exists');
    }
  }

  private async checkTeam(teamId: number): Promise<void> {
    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException('The team with the given id was not found');
    }
    if (!team.active) {
      throw new BadRequestException('The team is not active');
    }
  }

  private checkStatusChange(current: CharacterStatus, next: CharacterStatus): void {
    if (current === CharacterStatus.RETIRED && next === CharacterStatus.INJURED) {
      throw new BadRequestException('A RETIRED character cannot change to INJURED');
    }
  }
}
