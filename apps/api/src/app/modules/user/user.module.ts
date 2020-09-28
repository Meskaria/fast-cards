import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserMap } from './mappers/user.map';
import { UserRepository } from './repos/user.repository';
import { CreateUserUseCase } from './use-cases/create-user/create-user.use-case';

@Module({
  controllers: [UserController],
  providers: [UserMap, UserRepository, CreateUserUseCase]
})
export class UserModule {}
