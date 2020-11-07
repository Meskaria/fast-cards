import {
  User,
  USER_ACCESS,
} from 'apps/api/src/app/modules/user/domain/model/user';
import { UniqueEntityID } from 'apps/api/src/app/shared/domain/UniqueEntityID';
import { Injectable } from '@nestjs/common';
import { UserSurname } from 'apps/api/src/app/modules/user/domain/model/user-surname';
import { UserName } from 'apps/api/src/app/modules/user/domain/model/user-name';
import { UserPassword } from 'apps/api/src/app/modules/user/domain/model/user-password';
import { UserEmail } from 'apps/api/src/app/modules/user/domain/model/user-email';
import { User as UserEntity, UserGetPayload } from '@prisma/client';
import { Mapper } from 'apps/api/src/app/shared/infra/Mapper';
import { UserDto } from 'apps/api/src/app/modules/user/infra/http/serializers/user.serializer';

type UserWithStudentAndMentor = UserGetPayload<{ include?: { student: true; mentor: true }; }>;

@Injectable()
export class UserMap implements Mapper<User, UserEntity> {
  public static async toDTO(user: User): Promise<UserDto> {
    return {
      id: user.id.value.toString(),
      name: user.name.value,
      password: await user.password.getHashedValue(),
      surname: user.surname.value,
      access: user.access,
      isDeleted: user.isDeleted,
      email: user.email.value,
      mentorId: user.mentorId,
      studentId: user.studentId,
    };
  }
  public static fromPersistence(
    raw: UserWithStudentAndMentor | UserEntity
  ): User {
    const userNameOrError = UserName.create({ name: raw.name });
    const userSurnameOrError = UserSurname.create({ surname: raw.surname });
    const userPasswordOrError = UserPassword.create({
      value: raw.password,
      hashed: true,
    });
    const userEmailOrError = UserEmail.create(raw.email);

    return new User(
      {
        name: userNameOrError.getValue(),
        surname: userSurnameOrError.getValue(),
        isDeleted: raw.isDeleted,
        password: userPasswordOrError.getValue(),
        email: userEmailOrError.getValue(),
        access: raw.access as USER_ACCESS,
        accessToken: raw.accessToken,
        refreshToken: raw.refreshToken,
        isEmailVerified: raw.isEmailVerified,
        lastLogin: raw.lastLogin,
        studentId: (raw as UserWithStudentAndMentor)?.student?.id,
        mentorId: (raw as UserWithStudentAndMentor)?.mentor?.id,
      },
      new UniqueEntityID(raw.id)
    );
  }


  public static async toPersistence(
    user: User
  ): Promise<Omit<UserEntity, 'createdAt' | 'updatedAt'>> {
    let password: string = null;
    if (!!user.password === true) {
      if (user.password.isAlreadyHashed()) {
        password = user.password.value;
      } else {
        password = await user.password.getHashedValue();
      }
    }

    return {
      id: user.id.value.toString(),
      email: user.email.value,
      name: user.name.value,
      surname: user.surname.value,
      password: password,
      isDeleted: user.isDeleted,
      access: user.access,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      lastLogin: user.lastLogin,
      isEmailVerified: user.isEmailVerified,
    };
  }
}
