import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsEmail, IsInt, IsNotEmpty } from 'class-validator'

export enum UserRole {
  USER = 'user',
  DOCTOR = 'doctor'
}

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

  @Column()
  @IsNotEmpty()
  first_name: string

  @Column()
  @IsNotEmpty()
  last_name: string

  @Column()
  @IsInt()
  age: number

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole

  static fromJson = (json) => {
    return Object.assign(new User(), json)
  }

}