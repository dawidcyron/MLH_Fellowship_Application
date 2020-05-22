import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { IsDate, IsEmail, IsInt, IsNotEmpty } from 'class-validator'
import { Post } from './post'
import { Expose, Type } from 'class-transformer'
import { PostLike } from './post-like'

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string

  @Column({select: false})
  @IsNotEmpty()
  @Expose()
  password: string

  @Column()
  @IsNotEmpty()
  @Expose()
  first_name: string

  @Column()
  @IsNotEmpty()
  @Expose()
  last_name: string

  @Column()
  @IsNotEmpty()
  @Expose()
  @IsDate()
  @Type(() => Date)
  birth_date: Date

  @OneToMany(type => Post, post => post.author)
  posts: Post[]

  @OneToMany(type => PostLike, postLike => postLike.liked_by)
  posts_liked: PostLike[]

}