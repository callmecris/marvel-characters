import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CharacterEntity } from '../../characters/entities/character.entity.js';
import { AssignCharactersDto } from '../dto/assign-characters.dto.js';
import { CreateTeamDto } from '../dto/create-team.dto.js';
import { UpdateTeamDto } from '../dto/update-team.dto.js';
import { TeamEntity } from '../entities/team.entity.js';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly equipoRepo: Repository<TeamEntity>,
    @InjectRepository(CharacterEntity)
    private readonly personajeRepo: Repository<CharacterEntity>,
  ) {}

  findAll(): Promise<TeamEntity[]> {
    return this.equipoRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<TeamEntity> {
    const equipo = await this.equipoRepo.findOneBy({ id });
    if (!equipo) {
      throw new NotFoundException('No existe el equipo');
    }
    return equipo;
  }

  async findCharacters(id: number): Promise<CharacterEntity[]> {
    await this.findOne(id);
    return this.personajeRepo.find({
      where: { team_id: id },
      order: { id: 'ASC' },
    });
  }

  async create(dto: CreateTeamDto): Promise<TeamEntity> {
    await this.nombreLibre(dto.name);

    const hayPersonajes = dto.characterIds && dto.characterIds.length > 0;
    if (hayPersonajes) {
      if (dto.active === false) {
        throw new BadRequestException('El equipo esta inactivo');
      }
      await this.existenPersonajes(dto.characterIds!);
    }

    const nuevo = this.equipoRepo.create({
      name: dto.name,
      base: dto.base ?? null,
      founded_year: dto.founded_year ?? null,
      active: dto.active ?? true,
    });
    const guardado = await this.equipoRepo.save(nuevo);

    if (hayPersonajes) {
      await this.personajeRepo.update(
        { id: In(dto.characterIds!) },
        { team_id: guardado.id },
      );
    }

    return this.equipoRepo.findOneOrFail({
      where: { id: guardado.id },
      relations: ['characters'],
    });
  }

  async update(id: number, dto: UpdateTeamDto): Promise<TeamEntity> {
    const equipo = await this.findOne(id);
    await this.nombreLibre(dto.name, id);

    equipo.name = dto.name;
    equipo.base = dto.base ?? null;
    equipo.founded_year = dto.founded_year ?? null;
    equipo.active = dto.active;

    return this.equipoRepo.save(equipo);
  }

  async assignCharacters(id: number, dto: AssignCharactersDto): Promise<TeamEntity> {
    const equipo = await this.findOne(id);
    if (!equipo.active) {
      throw new BadRequestException('El equipo esta inactivo');
    }

    await this.existenPersonajes(dto.characterIds);

    await this.personajeRepo.update(
      { id: In(dto.characterIds) },
      { team_id: id },
    );

    return this.equipoRepo.findOneOrFail({
      where: { id },
      relations: ['characters'],
    });
  }

  async remove(id: number): Promise<void> {
    const equipo = await this.findOne(id);

    const cantidad = await this.personajeRepo.count({ where: { team_id: id } });
    if (cantidad > 0) {
      throw new ConflictException('El equipo tiene personajes');
    }

    await this.equipoRepo.remove(equipo);
  }

  private async nombreLibre(name: string, idActual?: number): Promise<void> {
    const otro = await this.equipoRepo.findOneBy({ name });
    if (otro && otro.id !== idActual) {
      throw new ConflictException('Ya existe un equipo con ese nombre');
    }
  }

  private async existenPersonajes(ids: number[]): Promise<void> {
    const encontrados = await this.personajeRepo.findBy({ id: In(ids) });
    const idsEncontrados = encontrados.map((p) => p.id);
    const faltan = ids.filter((i) => !idsEncontrados.includes(i));
    if (faltan.length > 0) {
      throw new NotFoundException('No existen los personajes: ' + faltan.join(', '));
    }
  }
}
