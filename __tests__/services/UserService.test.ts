import ConflictException from '../../src/exceptions/ConflictException';
import NotFoundException from '../../src/exceptions/NotFoundException';
import { UserRepository } from '../../src/repositories/UserRepository';
import { UserService } from '../../src/services/UserService';

jest.mock('../../src/repositories/UserRepository');
const UserRepositoryMock = UserRepository as jest.MockedClass<typeof UserRepository>;

describe('UserService', () => {
  const makeSut = () => {
    // @ts-ignore
    const userRepositoryMock = new UserRepositoryMock();
    const sut = new UserService(userRepositoryMock);
    const userDataMock = {
      name: 'any_name',
      email: 'any_email.com',
      password: 'any_password'
    };

    return { sut, userRepositoryMock, userDataMock };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('expect "getInstance" returns instance of UserService', () => {
    const instance = UserService.getInstance();

    expect(instance).toBeInstanceOf(UserService);
  });

  test('expect "create" calls userRepository.create with correct params', async () => {
    const { sut, userRepositoryMock, userDataMock } = makeSut();
    userRepositoryMock.create = jest.fn();

    await sut.create(userDataMock);

    expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.create).toHaveBeenCalledWith(userDataMock);
  });

  test('expect "create" throw ConflictException if user email already exists', async () => {
    expect.assertions(2);
    const { sut, userRepositoryMock, userDataMock } = makeSut();

    try {
      userRepositoryMock.create = jest.fn().mockImplementationOnce(() => {
        throw {
          code: 'ER_DUP_ENTRY'
        };
      });

      await sut.create(userDataMock);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toBe('Email already registered');
    }
  });

  test('expect "create" throw any error', async () => {
    expect.assertions(2);
    const { sut, userRepositoryMock, userDataMock } = makeSut();

    try {
      userRepositoryMock.create = jest.fn().mockImplementationOnce(() => {
        throw new Error('any_error');
      });

      await sut.create(userDataMock);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('any_error');
    }
  });

  test('expect "show" calls userRepository.show with correct params', async () => {
    const { sut, userRepositoryMock } = makeSut();
    const id = 1;
    userRepositoryMock.show = jest.fn().mockImplementationOnce(() => {
      return {};
    });

    await sut.show(id);

    expect(userRepositoryMock.show).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.show).toHaveBeenCalledWith(id);
  });

  test('expect "show" throw NotFoundException if user not exists', async () => {
    expect.assertions(2);

    try {
      const { sut, userRepositoryMock } = makeSut();
      const id = 1;
      userRepositoryMock.show = jest.fn();

      await sut.show(id);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('User not found');
    }
  });
});