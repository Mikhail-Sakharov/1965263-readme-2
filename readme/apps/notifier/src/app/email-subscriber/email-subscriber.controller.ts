import {EmailSubscriberService} from './email-subscriber.service';
import {CreateSubscriberDto} from './dto/create-subscriber.dto';
import {EventPattern} from '@nestjs/microservices';
import {CommandEvent} from '@readme/shared-types';
import {Controller} from '@nestjs/common';
import {ToggleSubscriberStatusDto} from './dto/toggle-subscriber-status.dto';
import {IncrementPostsCountDto} from './dto/create-post.dto';

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
  public async addPost({authorId}: IncrementPostsCountDto) {
    return this.subscriberService.addPost(authorId);
  }

  @EventPattern({cmd: CommandEvent.AddSubscriber})
  public async addSubscriber(subscriberData: ToggleSubscriberStatusDto) {
    return this.subscriberService.toggleSubscriberStatus(subscriberData);
  }

  @EventPattern({cmd: CommandEvent.RemoveSubscriber})
  public async removeSubscriber(subscriberData: ToggleSubscriberStatusDto) {
    return this.subscriberService.toggleSubscriberStatus(subscriberData);
  }
}
