import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { CharacterEntity } from '../../characters/entities/character.entity.js';

@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  base: string | null;

  @Column({ type: 'int', nullable: true })
  founded_year: number | null;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => CharacterEntity, (character) => character.team)
  characters: Relation<CharacterEntity[]>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
