import { User } from '@app/modules/user/domain/model/user';
import { UserEmail } from '@app/modules/user/domain/model/user-email';
import { PrismaService } from '@app/shared/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserMap } from '@app/modules/user/mappers/user.map';
import { Repository } from '@app/shared/infra/Repository';

export interface IUserRepo {
  exists(userEmail: UserEmail): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByEmail(userEmail: UserEmail | string): Promise<User>;
  save(user: User): Promise<User>;
}

@Injectable()
export class UserRepository extends Repository implements IUserRepo {
  constructor(private prisma: PrismaService) {
    super();
  }

  async exists(userEmail: UserEmail): Promise<boolean> {
    const user = await this.prisma.user.findOne({
      where: {
        email: userEmail.value,
      },
    });

    return !!user;
  }

  async getUserByUserId(userId: string): Promise<User> {
    const user = await this.prisma.user.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error('User not found.');

    return UserMap.fromPersistence(user);
  }

  async getUserByEmail(userEmail: UserEmail | string): Promise<User> {
    const user = await this.prisma.user.findOne({
      where: {
        email: userEmail instanceof UserEmail ? userEmail.value : userEmail,
      },
      include: {
        mentor: {
          select: { id: true },
        },
        student: {
          select: { id: true },
        },
      },
    });
    if (!user) throw new Error('User not found.');

    return UserMap.fromPersistence(user);
  }

  async save(user: User): Promise<User> {
    const rawUser = await UserMap.toPersistence(user);
    const userModel = await this.prisma.user.upsert({
      where: {
        id: rawUser.id,
      },
      create: rawUser,
      update: rawUser,
    });

    return UserMap.fromPersistence(userModel);
  }
}
