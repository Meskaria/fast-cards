import { User } from 'apps/api/src/app/modules/user/domain/model/user';
import { UserEmail } from 'apps/api/src/app/modules/user/domain/model/user-email';
import { PrismaService } from 'apps/api/src/app/shared/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserMap } from 'apps/api/src/app/modules/user/infra/mappers/user.map';
import { Repository } from 'apps/api/src/app/shared/infra/Repository';

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

  async exists(userEmail): Promise<boolean> {
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

    return UserMap.fromResistance(user);
  }

  async getUserByEmail(userEmail: UserEmail | string): Promise<User> {
    const user = await this.prisma.user.findOne({
      where: {
        email: userEmail instanceof UserEmail ? userEmail.value : userEmail,
      },
    });
    if (!user) throw new Error('User not found.');

    return UserMap.fromResistance(user);
  }

  async save(user: User): Promise<User> {
    const rawUser = await UserMap.toResistance(user);
    const userModel = await this.prisma.user.upsert({
      where: {
        email: rawUser.email, // or should it be id?
      },
      create: rawUser,
      update: rawUser,
    });

    return UserMap.fromResistance(userModel);
  }
}
