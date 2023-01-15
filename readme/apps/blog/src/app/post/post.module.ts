import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ClientsModule} from '@nestjs/microservices';
import {PostService} from './post.service';
import {PostController} from './post.controller';
import {CommentModule} from '../comment/comment.module';
import {PostRepository} from './post.repository';
import {PrismaModule} from '../prisma/prisma.module';
import {NOTIFIER_RABBITMQ_SERVICE, USERS_RABBITMQ_SERVICE} from './post.constant';
import {getNotifierRabbitMqConfig, getUsersRabbitMqConfig} from '../config/rabbitmq.config';

@Module({
  imports: [
    CommentModule,
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFIER_RABBITMQ_SERVICE,
        useFactory: getNotifierRabbitMqConfig,
        inject: [ConfigService]
      },
      {
        name: USERS_RABBITMQ_SERVICE,
        useFactory: getUsersRabbitMqConfig,
        inject: [ConfigService]
      }
    ])
  ],
  providers: [PostService, PostRepository],
  controllers: [PostController]
})
export class PostModule {}
