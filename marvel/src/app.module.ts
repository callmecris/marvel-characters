import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TeamsModule } from './teams/teams.module.js';
import { CharactersModule } from './characters/characters.module.js';
import { TeamEntity } from './teams/entities/team.entity.js';
import { CharacterEntity } from './characters/entities/character.entity.js';

const DB_POR_DEFECTO = {
  host: 'localhost',
  port: 5433,
  user: 'marvel',
  password: 'marvel123',
  name: 'marvel_db',
};

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'marvel',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env.example'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', DB_POR_DEFECTO.host),
        port: Number(config.get('DB_PORT', DB_POR_DEFECTO.port)),
        username: config.get('DB_USER', DB_POR_DEFECTO.user),
        password: config.get('DB_PASSWORD', DB_POR_DEFECTO.password),
        database: config.get('DB_NAME', DB_POR_DEFECTO.name),
        entities: [TeamEntity, CharacterEntity],
        synchronize: false,
      }),
    }),
    TeamsModule,
    CharactersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}