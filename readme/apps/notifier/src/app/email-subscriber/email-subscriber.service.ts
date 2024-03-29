import {Injectable} from '@nestjs/common';
import {EmailSubscriberRepository} from './email-subscriber.repository';
import {CreateSubscriberDto} from './dto/create-subscriber.dto';
import {EMAIL_SUBSCRIBER_EXISTS} from './email-subscriber.constant';
import {EmailSubscriberEntity} from './email-subscriber.entity';
import {MailService} from '../mail/mail.service';
import {ToggleSubscriberStatusDto} from './dto/toggle-subscriber-status.dto';

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

    this.mailService.sendNewUserRegisteredNotification(subscriber);

    return await this.emailSubscriberRepository.create(new EmailSubscriberEntity(subscriber));
  }

  public async addPost(id: string) {
    const user = await this.emailSubscriberRepository.findByUserID(id);
    const emails = user.subscribersEmails;
    
    return this.mailService.sendNewPostNotification(emails);
  }

  public async toggleSubscriberStatus({authorEmail, subscriberEmail}: ToggleSubscriberStatusDto) {
    const author = await this.emailSubscriberRepository.findByEmail(authorEmail);
    const authorSubscribers = [...author.subscribersEmails];
    const existingSubscriber = authorSubscribers.some((subscriber) => subscriber === subscriberEmail);

    if (existingSubscriber) {
      const updatedAuthorSubscribers = authorSubscribers.filter((email) => email !== subscriberEmail);
      const updatedAuthor = {...author, subscribersEmails: updatedAuthorSubscribers};
      const updatedAuthorEntity = new EmailSubscriberEntity(updatedAuthor);
      const updatedAuthorEntry = await this.emailSubscriberRepository.update(author._id, updatedAuthorEntity);

      this.mailService.sendRemoveSubscriberNotification({authorEmail, subscriberEmail});

      return updatedAuthorEntry;
    }

    authorSubscribers.push(subscriberEmail);
    const updatedAuthor = {...author, subscribersEmails: authorSubscribers};
    const updatedAuthorEntity = new EmailSubscriberEntity(updatedAuthor);
    const updatedAuthorEntry = await this.emailSubscriberRepository.update(author._id, updatedAuthorEntity);

    this.mailService.sendAddSubscriberNotification({authorEmail, subscriberEmail});

    return updatedAuthorEntry;
  }
}
