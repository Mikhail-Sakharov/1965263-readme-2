import {ApiProperty} from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Text of the comment an authorized user can leave under the post',
    example: 'Great footage! Keep up the good work!'
  })
  text: string;

  @ApiProperty({
    description: 'The id of the post the comment was left under',
    example: '1669292869059'
  })
  postId: number;

  @ApiProperty({
    description: 'The unique id of the user, who commeneted the post',
    example: '3afa868f-e0d7-450d-bef5-101667e6b888'
  })
  userId: string;
}
