import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsEmail, IsNotEmpty } from 'class-validator'


@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Column()
  @IsNotEmpty()
  password: string

  static fromJson = (json) => {
    return Object.assign(new User(), json)
  }

}