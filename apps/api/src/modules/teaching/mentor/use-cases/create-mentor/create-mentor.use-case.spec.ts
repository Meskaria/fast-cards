import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '@app/modules/user/use-cases/create-user/create-user.use-case';
import { USER_ACCESS } from '@app/modules/user/domain/model/user';
import { UserRepository } from '@app/modules/user/repos/user.repository';
import * as faker from 'faker';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateUserUseCase, UserRepository],
    })
      .overrideProvider(UserRepository)
      .useValue({
        exists: () => null,
        getUserByUserId: () => null,
        getUserByEmail: () => null,
        save: () => null,
      })
      .compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });
  it('should be defined', () => {
    expect(useCase.execute).toBeDefined();
  });
  describe('execute', () => {
    it('should return left with error if missing data', async () => {
      const result = await useCase.execute({
        name: '',
        access: USER_ACCESS.MENTOR,
        email: '',
        password: '',
        surname: '',
      });
      expect(result.isLeft()).toBe(true);
      expect(result.value.errorValue()).toBeTruthy();
    });

    it('should return left with error if user exists', async () => {
      jest
        .spyOn(userRepo, 'exists')
        .mockImplementation(() => Promise.resolve(true));

      const result = await useCase.execute({
        name: faker.name.firstName(),
        access: USER_ACCESS.MENTOR,
        email: faker.internet.email(),
        password: faker.internet.password(8),
        surname: faker.name.lastName(),
      });
      expect(result.isLeft()).toBe(true);
    });
  });
});
