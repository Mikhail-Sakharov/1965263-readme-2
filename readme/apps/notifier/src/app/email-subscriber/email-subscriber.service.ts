import {Injectable} from '@nestjs/common';
import {EmailSubscriberRepository} from './email-subscriber.repository';
import {CreateSubscriberDto} from './dto/create-subscriber.dto';
import {EMAIL_SUBSCRIBER_EXISTS} from './email-subscriber.constant';
import {EmailSubscriberEntity} from './email-subscriber.entity';
import {MailService} from '../mail/mail.service';

@Injectable()
export class EmailSubscriberService {
  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository,
    private readonly mailService: MailService
  ) {}

  public async registerNewBlogUser(subscriber: CreateSubscriberDto) {
    const {email} = subscriber;
    const existingSubscriber = await this.emailSubscriberRepository.findByEmail(email);

    if (existingSubscriber) {
      throw new Error(EMAIL_SUBSCRIBER_EXISTS);
    }

    this.mailService.sendNotifyNewSubscriber(subscriber);

    return await this.emailSubscriberRepository.create(new EmailSubscriberEntity(subscriber));
  }

  public async addPost(/* id: string */) {
    const users = await this.emailSubscriberRepository.find();
    const emails = users.map((user) => user.email);
    
    return this.mailService.sendNotifyNewPost(emails);
  }
}
