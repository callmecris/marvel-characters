import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { TeamEntity } from '../../teams/entities/team.entity.js';
import { CharacterStatus } from '../enums/character-status.enum.js';

@Entity('characters')
export class CharacterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  real_name: string;

  @Column({ unique: true })
  alias: string;

  @Column()
  main_power: string;

  @Column()
  power_level: number;

  @Column({ type: 'varchar', default: CharacterStatus.ACTIVE })
  status: CharacterStatus;

  @Column({ default: false })
  is_villain: boolean;

  @Column({ type: 'int', nullable: true })
  team_id: number | null;

  @ManyToOne(() => TeamEntity, (team) => team.characters)
  @JoinColumn({ name: 'team_id' })
  team: Relation<TeamEntity>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}