import { User, USER_ACCESS } from '../domain/user';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Injectable } from '@nestjs/common';
import { UserSurname } from '../domain/user-surname';
import { UserName } from '../domain/user-name';
import { UserPassword } from '../domain/user-password';
import { UserEmail } from '../domain/user-email';
import { User as UserModel } from '@prisma/client';
import { Mapper } from '../../../shared/infra/Mapper';
import { UserDto } from '../serializers/user.serializer';

@Injectable()
export class UserMap implements Mapper<User, UserModel> {
  public static async toDTO(user: User): Promise<UserDto> {
    return {
      id: user.id.toValue() as string,
      name: user.name.value,
      password: await user.password.getHashedValue(),
      surname: user.surname.value,
      access: user.access,
      isDeleted: user.isDeleted,
      email: user.email.value,
    };
  }
  public static toDomain(raw: UserModel): User {
    const userNameOrError = UserName.create({ name: raw.name });
    const userSurnameOrError = UserSurname.create({ surname: raw.surname });
    const userPasswordOrError = UserPassword.create({
      value: raw.password,
      hashed: true,
    });
    const userEmailOrError = UserEmail.create(raw.email);

    const userOrError = User.create(
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
      },
      new UniqueEntityID(raw.id)
    );

    userOrError.isFailure ? console.log(userOrError.error) : '';

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static async toPersistence(
    user: User
  ): Promise<Omit<UserModel, 'createdAt' | 'updatedAt'>> {
    let password: string = null;
    if (!!user.password === true) {
      if (user.password.isAlreadyHashed()) {
        password = user.password.value;
      } else {
        password = await user.password.getHashedValue();
      }
    }

    return {
      id: (user.userId.id.toValue() as unknown) as number,
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
