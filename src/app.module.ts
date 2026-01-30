import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoodsModule } from './modules/foods/foods.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TrackingModule } from './modules/tracking/tracking.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    FoodsModule,
    ProfilesModule,
    AccountsModule,
    TrackingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
