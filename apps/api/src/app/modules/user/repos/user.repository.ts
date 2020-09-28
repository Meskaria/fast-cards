
import { User } from "../domain/user";
import { UserEmail } from '../domain/user-email';
import { PrismaService } from '../../../shared/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserMap } from '../mappers/user.map';

export interface IUserRepo {
  exists (userEmail: UserEmail): Promise<boolean>;
  getUserByUserId (userId: number): Promise<User>;
  getUserByEmail (userEmail: UserEmail | string): Promise<User>;
  save (user: User): Promise<User>;
}

@Injectable()
export class UserRepository implements IUserRepo {
  constructor(private prisma: PrismaService, private userMap: UserMap) {}

  async exists(userEmail): Promise<boolean> {
    const user = await this.prisma.user.findOne({
      where: {
        email: userEmail.value
      }
    })

    return !!user
  }

  async getUserByUserId(userId: number): Promise<User> {
    const user = await this.prisma.user.findOne({
      where: {
        id: userId
      }
    })
    if (!user) throw new Error("User not found.")

    return UserMap.toDomain(user)
  }

  async getUserByEmail(userEmail: UserEmail | string): Promise<User> {
    const user = await this.prisma.user.findOne({
      where: {
        email: userEmail instanceof UserEmail ? userEmail.value : userEmail
      }
    })
    if (!user) throw new Error("User not found.")

    return UserMap.toDomain(user)
  }

  async save(user: User): Promise<User> {
    const { id, ...rawUser } = await UserMap.toPersistence(user)
    const userModel = await this.prisma.user.upsert({
      where: {
        email: rawUser.email,
      },
      create: rawUser,
      update: rawUser,
    })

    return UserMap.toDomain(userModel)
  }
}
