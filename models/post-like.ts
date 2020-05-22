import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Post } from './post'
import { User } from './user'

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => Post, post => post.likes)
  liked_post: Post

  @ManyToOne(type => User, user => user.posts_liked)
  liked_by: User
}