import {IsEmail} from 'class-validator';
import {EMAIL_NOT_VALID} from '../email-subscriber.constant';

export class ToggleSubscriberStatusDto {
  @IsEmail({}, {message: EMAIL_NOT_VALID})
  authorEmail: string;

  @IsEmail({message: EMAIL_NOT_VALID})
  subscriberEmail: string;
}
