import {Inject, Injectable} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {RepostDto} from './dto/repost.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {PostRepository} from './post.repository';
import {PostEntity} from './post.entity';
import {PostQuery} from './query/post.query';
import {CommandEvent} from '@readme/shared-types';
import {NOTIFIER_RABBITMQ_SERVICE, USERS_RABBITMQ_SERVICE} from './post.constant';
import {ClientProxy} from '@nestjs/microservices';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    @Inject(NOTIFIER_RABBITMQ_SERVICE) private readonly notifierRabbitClient: ClientProxy,
    @Inject(USERS_RABBITMQ_SERVICE) private readonly usersRabbitClient: ClientProxy
  ) {}

  async createPost(dto: CreatePostDto) {
    const postEntity = new PostEntity({
      ...dto,
      date: new Date,
      likes: [],
      originalAuthorId: dto.authorId,
      originalId: 0
    });

    this.notifierRabbitClient.emit(
      {cmd: CommandEvent.AddPost},
      {
        id: dto.authorId
      }
    );

    this.usersRabbitClient.emit(
      {cmd: CommandEvent.IncrementPostsCount},
      {
        id: dto.authorId
      }
    );

    return await this.postRepository.create(postEntity);
  }

  async repost(postId: number, dto: RepostDto) {
    const post = await this.postRepository.findById(postId);
    const originalAuthorId = post.authorId;
    const originalId = post.id;
    console.log(originalId);
    const postEntity = new PostEntity({
      ...post,
      authorId: dto.authorId,
      date: new Date,
      isPublished: true,
      isRepost: true,
      likes: [],
      originalAuthorId,
      originalId
    });

    return await this.postRepository.create(postEntity);
  }

  async getPosts(query: PostQuery) {
    return this.postRepository.find(query);
  }

  async updatePost(dto: UpdatePostDto, postId: number) {
    const post = await this.postRepository.findById(postId);
    const postEntity = new PostEntity({
      ...post,
      ...dto,
      date: new Date
    });
    return await this.postRepository.update(postId, postEntity);
  }

  async changeLikesCount(postId: number, authorId: string) {
    const post = await this.postRepository.findById(postId);
    const postLikes = [...post.likes];
    const existsLike = postLikes.some((id) => id === authorId);

    if (existsLike) {
      const updatedLikes = postLikes.filter((id) => id !== authorId);
      const updatedPost = {...post, likes: updatedLikes};
      const updatedPostEntity = new PostEntity(updatedPost);
      return await this.postRepository.update(postId, updatedPostEntity);
    }

    postLikes.push(authorId);
    const updatedPost = {...post, likes: postLikes};
    const updatedPostEntity = new PostEntity(updatedPost);
    return await this.postRepository.update(postId, updatedPostEntity);
  }

  async deletePost(postId: number) {
    return await this.postRepository.destroy(postId);
  }
}
