import {
  Body, ClassSerializerInterceptor,
  ConflictException,
  Controller, Delete,
  InternalServerErrorException, NotFoundException, Param,
  Post,
  UseInterceptors,
  BadRequestException, UseGuards, Get,
} from '@nestjs/common';
import { CreateUserUseCase } from '../use-cases/create-user/create-user.use-case';
import { CreateUserDto } from '../use-cases/create-user/create-user.dto';
import { CreateUserErrors } from '../use-cases/create-user/create-user.errors';
import { UserMap } from '../mappers/user.map';
import { UserSerializer } from '../serializers/user.serializer';
import { DeleteUserUseCase } from '../use-cases/delete-user/delete-user.use-case';
import { DeleteUserDto } from '../use-cases/delete-user/delete-user.dto';
import { DeleteUserErrors } from '../use-cases/delete-user/delete-user.errors';
import { LoginUseCaseErrors } from 'apps/api/src/app/modules/user/use-cases/login/login.errors';
import { LoginDto } from 'apps/api/src/app/modules/user/use-cases/login/login.dto';
import { LoginUserUseCase } from 'apps/api/src/app/modules/user/use-cases/login/login.use-case';
import { RefreshAccessTokenDto } from 'apps/api/src/app/modules/user/use-cases/refresh-access-token/refresh-access-token.dto';
import { RefreshAccessTokenErrors } from 'apps/api/src/app/modules/user/use-cases/refresh-access-token/refresh-access-token.errors';
import { JWTToken } from 'apps/api/src/app/modules/user/domain/jwt';
import { LogoutDto } from 'apps/api/src/app/modules/user/use-cases/logout/logout.dto';
import { LogoutUseCase } from 'apps/api/src/app/modules/user/use-cases/logout/logout.use-case';
import { AuthGuard } from '@nestjs/passport';
import { RefreshAccessTokenUseCase } from 'apps/api/src/app/modules/user/use-cases/refresh-access-token/refresh-access-token.use-case';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  [x: string]: any;

  constructor(
    private createUserUseCase: CreateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private logoutUserUseCase: LogoutUseCase,
    private refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
  ) {
  }

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

  @Delete(':id')
  public async delete(@Param() params: DeleteUserDto) {
    const result = await this.deleteUserUseCase.execute(params);

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
        case LoginUseCaseErrors.UserNameDoesntExistError:
          throw new NotFoundException(error.errorValue().message);
        case LoginUseCaseErrors.PasswordDoesntMatchError:
          throw new BadRequestException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      // TODO write serializer for that
      return result.value.getValue();
    }
  }

  @Post('/refresh-token')
  async refreshToken(@Body() dto: RefreshAccessTokenDto) {
    const result = await this.refreshAccessTokenUseCase.execute(dto);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case RefreshAccessTokenErrors.RefreshTokenNotFound:
          throw new NotFoundException(error.errorValue().message);
        case RefreshAccessTokenErrors.UserNotFoundOrDeletedError:
          throw new NotFoundException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      const accessToken = result.value.getValue() as JWTToken;
      // TODO write serializer for that
      return {
        refreshToken: dto.refreshToken,
        accessToken: accessToken,
      }
    }
  }

  @Post('/logout')
  async logout(@Body() { userId }: LogoutDto) {
    const result = await this.logoutUserUseCase.execute({ userId });

    if (result.isLeft()) {
      const error = result.value;
      throw new InternalServerErrorException(error.errorValue().message);
    }

    return result.value.getValue();
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(){

  }
}
