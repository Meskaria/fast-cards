import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CreateUserUseCase } from 'apps/api/src/modules/user/use-cases/create-user/create-user.use-case';
import { CreateUserDto } from 'apps/api/src/modules/user/dtos/create-user.dto';
import { CreateUserErrors } from 'apps/api/src/modules/user/use-cases/create-user/create-user.errors';
import { UserMap } from 'apps/api/src/modules/user/mappers/user.map';
import { UserSerializer } from 'apps/api/src/modules/user/serializers/user.serializer';
import { DeleteUserUseCase } from 'apps/api/src/modules/user/use-cases/delete-user/delete-user.use-case';
import { DeleteUserErrors } from 'apps/api/src/modules/user/use-cases/delete-user/delete-user.errors';
import { LoginUseCaseErrors } from 'apps/api/src/modules/user/use-cases/login/login.errors';
import { LoginDto } from 'apps/api/src/modules/user/dtos/login.dto';
import { LoginUserUseCase } from 'apps/api/src/modules/user/use-cases/login/login.use-case';
import { RefreshAccessTokenDto } from 'apps/api/src/modules/user/use-cases/refresh-access-token/refresh-access-token.dto';
import { RefreshAccessTokenErrors } from 'apps/api/src/modules/user/use-cases/refresh-access-token/refresh-access-token.errors';
import { JWTToken } from 'apps/api/src/modules/user/domain/jwt';
import { LogoutUseCase } from 'apps/api/src/modules/user/use-cases/logout/logout.use-case';
import { AuthGuard } from '@nestjs/passport';
import { RefreshAccessTokenUseCase } from 'apps/api/src/modules/user/use-cases/refresh-access-token/refresh-access-token.use-case';
import { UserData } from 'apps/api/src/modules/user/services/auth/user-info.decorator';
import { User } from 'apps/api/src/modules/user/domain/model/user';
import { TokensSerializer } from 'apps/api/src/modules/user/serializers/tokens.serializer';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private logoutUserUseCase: LogoutUseCase,
    private refreshAccessTokenUseCase: RefreshAccessTokenUseCase
  ) {}

  @Post()
  public async create(@Body() body: CreateUserDto) {
    const result = await this.createUserUseCase.execute(body);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CreateUserErrors.EmailAlreadyExistsError:
          throw new ConflictException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      const user = result.value.getValue();
      const userDto = await UserMap.toDTO(user);
      return new UserSerializer(userDto);
    }
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  public async delete(@UserData() user: User) {
    const result = await this.deleteUserUseCase.execute({
      userId: user.id.value.toString(),
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DeleteUserErrors.UserNotFoundError:
          throw new NotFoundException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    }
    return;
  }

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    const result = await this.loginUserUseCase.execute(dto);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case LoginUseCaseErrors.UserEmailDoesntExistError:
          throw new NotFoundException(error.errorValue().message);
        case LoginUseCaseErrors.PasswordDoesntMatchError:
          throw new BadRequestException(error.errorValue().message);
        case LoginUseCaseErrors.UserDeletedError:
          throw new NotFoundException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      return new TokensSerializer(result.value.getValue());
    }
  }

  @Post('/refresh-token')
  async refreshToken(@Body() dto: RefreshAccessTokenDto) {
    const result = await this.refreshAccessTokenUseCase.execute(dto);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case RefreshAccessTokenErrors.RefreshTokenNotFound: // user logged out
          throw new NotFoundException(error.errorValue().message);
        case RefreshAccessTokenErrors.UserNotFoundOrDeletedError:
          throw new NotFoundException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      const accessToken = result.value.getValue() as JWTToken;

      return new TokensSerializer({
        refreshToken: dto.refreshToken,
        accessToken: accessToken,
      });
    }
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@UserData() user: User) {
    const result = await this.logoutUserUseCase.execute({
      userId: user.id.value.toString(),
    });

    if (result.isLeft()) {
      const error = result.value;
      throw new InternalServerErrorException(error.errorValue().message);
    }

    return;
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@UserData() user: User) {
    // TODO better handle that part. serializer should take care of all
    const userDto = await UserMap.toDTO(user);
    return new UserSerializer(userDto);
  }
}
