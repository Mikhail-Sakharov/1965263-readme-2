import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {fillObject} from '@readme/core';
import {CreatePostDto} from './dto/create-post.dto';
import {RepostDto} from './dto/repost.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {MAX_POSTS_COUNT} from './post.constant';
import {PostService} from './post.service';
import {PostQuery} from './query/post.query';
import {PostRdo} from './rdo/post.rdo';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService
  ) {}

  @ApiResponse({
    type: PostRdo,
    status: HttpStatus.CREATED,
    description: 'A new post has been successfully created'
  })
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePostDto) {
    const post = await this.postService.createPost(dto);
    return fillObject(PostRdo, post);
  }

  @ApiResponse({
    type: PostRdo,
    status: HttpStatus.OK,
    description: `${MAX_POSTS_COUNT} or less posts were received`
  })
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getPosts(@Query() query: PostQuery) {
    // 3.9. Авторизованный пользователь может получить список своих черновиков (публикации в состоянии «Черновик»).
    const posts = await this.postService.getPosts(query);
    return fillObject(PostRdo, posts);
  }

  @ApiResponse({
    type: PostRdo,
    status: HttpStatus.OK,
    description: 'The post was updated'
  })
  @Patch(':postId')
  @HttpCode(HttpStatus.OK)
  async updatePost(
    @Body() dto: UpdatePostDto,
    @Param('postId') postId: number
  ) {
    const post = await this.postService.updatePost(dto, postId);
    return fillObject(PostRdo, post);
  }

  @ApiResponse({
    type: PostRdo,
    status: HttpStatus.OK,
    description: 'The like was set (or unset)'
  })
  @Patch(':postId/like')
  @HttpCode(HttpStatus.OK)
  async smashLike(
    @Param('postId') postId: number,
    @Body() dto: RepostDto
  ) {
    const post = await this.postService.changeLikesCount(postId, dto.authorId);
    return fillObject(PostRdo, post);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The post was deleted'
  })
  @Delete(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('postId') postId: number
  ) {
    // декрементировать значение поля postsCount у юзера
    await this.postService.deletePost(postId);
  }

  @ApiResponse({
    type: PostRdo,
    status: HttpStatus.OK,
    description: 'The post was reposted'
  })
  @Post('repost/:postId')
  @HttpCode(HttpStatus.OK)
  async repost(
    @Param('postId') postId: number,
    @Body() dto: RepostDto
  ) {
    const post = await this.postService.repost(postId, dto);
    // инкрементировать значение поля postsCount у юзера ???
    return fillObject(PostRdo, post);
  }
}
