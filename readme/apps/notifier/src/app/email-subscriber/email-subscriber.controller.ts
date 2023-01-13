import {EmailSubscriberService} from './email-subscriber.service';
import {CreateSubscriberDto} from './dto/create-subscriber.dto';
import {EventPattern} from '@nestjs/microservices';
import {CommandEvent} from '@readme/shared-types';
import {Controller} from '@nestjs/common';
//import {IncrementPostsCountDto} from './dto/create-post.dto';

@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly subscriberService: EmailSubscriberService,
  ) {}

  @EventPattern({cmd: CommandEvent.RegisterNewBlogUser})
  public async registerNewBlogUser(subscriber: CreateSubscriberDto) {
    return this.subscriberService.registerNewBlogUser(subscriber);
  }

  @EventPattern({cmd: CommandEvent.AddPost})
  public async addPost(/* {id}: IncrementPostsCountDto */) { // имплементировать отправку писем только подписчикам автора поста
    return this.subscriberService.addPost(/* id */);
  }

  @EventPattern({cmd: CommandEvent.AddSubscriber})
  public async addSubscriber(data) {
    throw new Error(`EmailSubscriberController:addSubscriber not implemented ${data}`);
  }

  @EventPattern({cmd: CommandEvent.RemoveSubscriber})
  public async removeSubscriber(data) {
    throw new Error(`EmailSubscriberController:removeSubscriber not implemented ${data}`);
  }
}
