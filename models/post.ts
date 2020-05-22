import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { User } from './user'
import { Expose } from 'class-transformer'
import { PostLike } from './post-like'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsNotEmpty()
  @Expose()
  content: string

  @CreateDateColumn()
  created_at: Date

  @ManyToOne(type => User, user => user.posts)
  author: User

  @OneToMany(type => PostLike, postLike => postLike.liked_post)
  likes: PostLike[]
}