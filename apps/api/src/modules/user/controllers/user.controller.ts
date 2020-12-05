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
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserMap } from '@app/modules/user/mappers/user.map';
import { JWTToken } from '@app/modules/user/domain/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserData } from '@app/modules/user/services/auth/user-info.decorator';
import { User } from '@app/modules/user/domain/model/user';
import {
  CreateUserDto,
  RefreshAccessTokenDto,
  LoginDto,
} from '@app/modules/user/dtos';
import {
  TokensSerializer,
  UserSerializer,
} from '@app/modules/user/serializers';

import {
  CreateUserErrors,
  CreateUserUseCase,
  DeleteUserErrors,
  DeleteUserUseCase,
  LoginUserUseCase,
  LoginUseCaseErrors,
  LogoutUseCase,
  RefreshAccessTokenErrors,
  RefreshAccessTokenUseCase,
} from '@app/modules/user/use-cases';

@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiInternalServerErrorResponse({ description: 'Unknown error' })
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private logoutUserUseCase: LogoutUseCase,
    private refreshAccessTokenUseCase: RefreshAccessTokenUseCase
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Sign up with a new account',
    operationId: 'signUp',
  })
  @ApiConflictResponse({ description: 'Email already exists' })
  @ApiBadRequestResponse({ description: 'Incorrect request data' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserSerializer })
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

  @Post('/login')
  @ApiOperation({ summary: 'Login with account data', operationId: 'login' })
  @ApiNotFoundResponse({ description: 'Account with a given id was not found' })
  @ApiResponse({ status: HttpStatus.OK, type: TokensSerializer })
  @ApiBadRequestResponse({ description: 'Incorrect request data' })
  async login(@Body() dto: LoginDto) {
    const result = await this.loginUserUseCase.execute(dto);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case LoginUseCaseErrors.UserDeletedError:
        case LoginUseCaseErrors.UserEmailDoesntExistError:
          throw new NotFoundException(error.errorValue().message);
        case LoginUseCaseErrors.PasswordDoesntMatchError:
          throw new BadRequestException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      return new TokensSerializer(result.value.getValue());
    }
  }

  @Post('/refresh-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token', operationId: 'refresh' })
  @ApiNotFoundResponse({
    description: 'User was not found, refresh token not found',
  })
  @ApiResponse({ status: HttpStatus.OK, type: TokensSerializer })
  async refreshToken(@Body() dto: RefreshAccessTokenDto) {
    const result = await this.refreshAccessTokenUseCase.execute(dto);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case RefreshAccessTokenErrors.UserNotFoundOrDeletedError:
        case RefreshAccessTokenErrors.RefreshTokenNotFound: // user logged out
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from system', operationId: 'logout' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get data about user', operationId: 'me' })
  @ApiResponse({ status: HttpStatus.OK, type: UserSerializer })
  async getMe(@UserData() user: User) {
    // TODO better handle that part. serializer should take care of all
    const userDto = await UserMap.toDTO(user);
    return new UserSerializer(userDto);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Remove account',
    operationId: 'delete',
  })
  @ApiNotFoundResponse({ description: 'Account with a given id was not found' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Account deleted' })
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
}
