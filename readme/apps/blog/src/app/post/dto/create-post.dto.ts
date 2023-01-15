import {ApiProperty} from '@nestjs/swagger';
import {ContentType} from '@readme/shared-types';

export class CreatePostDto {
  @ApiProperty({
    description: 'Must be one of the following types: video, text, quote, photo, link',
    example: 'video'
  })
  type: string;

  @ApiProperty({
    description: 'The unique set of properies according to the "type"',
    example: 'Look the "ContentType"'
  })
  content: ContentType;

  @ApiProperty({
    description: 'An array of tags',
    example: '["link", "beautifulphoto", "postaboutmyjourney"]'
  })
  tags?: string[];

  /* @ApiProperty({
    description: 'The unique id of the user, who is the current owner of the post',
    example: '3afa868f-e0d7-450d-bef5-101667e6b888'
  })
  authorId: string; */
}
