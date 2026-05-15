import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoriesModule } from './categories/categories.module';
import { AppConfigModule } from './app-config/app-config.module';
import { AvatarsModule } from './avatars/avatars.module';
import { QuestionsModule } from './questions/questions.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ReferEarnModule } from './refer-earn/refer-earn.module';
import { QuotesModule } from './quotes/quotes.module';
import { ScheduleModule } from '@nestjs/schedule';
import { QuestionsService } from './questions/questions.service';
import { SchemaModule } from './schema/schema.module';

@Module({
  imports: [
    SchemaModule,
    UserModule,
    PrismaModule,
    ScheduleModule.forRoot(), // Schedule module for cron jobs
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'), // Folder where images are stored
      serveRoot: '/uploads', // URL prefix to access images (e.g., http://localhost:3000/uploads/image.jpg)
    }),
    CategoriesModule,
    AppConfigModule,
    AvatarsModule,
    QuestionsModule,
    FeedbackModule,
    ReferEarnModule,
    QuotesModule,
  ],
  controllers: [AppController],
  providers: [AppService, QuestionsService],
})
export class AppModule {}
