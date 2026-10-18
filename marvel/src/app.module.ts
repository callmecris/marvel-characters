import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TeamsModule } from './teams/teams.module.js';
import { CharactersModule } from './characters/characters.module.js';
import { TeamEntity } from './teams/entities/team.entity.js';
import { CharacterEntity } from './characters/entities/character.entity.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'marvel',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'marvel',
      password: 'marvel123',
      database: 'marvel_db',
      entities: [TeamEntity, CharacterEntity],
      synchronize: false,
    }),
    TeamsModule,
    CharactersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}