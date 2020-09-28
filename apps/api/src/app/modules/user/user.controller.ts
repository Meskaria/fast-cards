import {
  Body, ClassSerializerInterceptor,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user/create-user.use-case';
import { CreateUserDto } from './use-cases/create-user/create-user.dto';
import { CreateUserErrors } from './use-cases/create-user/create-user.errors';
import { UserMap } from './mappers/user.map';
import { UserSerializer } from './serializers/user.serializer';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {
  }
  @Post()
  public async create(@Body() body: CreateUserDto) {
    try {
      const result = await this.createUserUseCase.execute(body)

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateUserErrors.EmailAlreadyExistsError:
            throw new ConflictException(error.errorValue().message)
          default:
            throw new InternalServerErrorException(error.errorValue().message);
        }
      } else {
        const user = result.value.getValue()
        const userDto = await UserMap.toDto(user)
        return new UserSerializer(userDto)
      }
    } catch (e) {
      throw e
    }
  }
}
