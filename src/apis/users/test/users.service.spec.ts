import { getRepositoryToken } from "@nestjs/typeorm";

import { ConflictException, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users.service";
import { Gender, User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
}));
describe("UsersService", () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(), // Use mocked repository
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  //'it' 함수는 개별 테스트 사례를 나타내며 테스트 중인 특정 동작을 설명합니다. 'expect' 함수는 테스트 중인 코드의 예상 동작 및 결과에 대한 주장을 만드는 데 사용됩니다. 실제 결과가 예상 결과와 일치하면 테스트가 통과됩니다. 그렇지 않으면 테스트가 실패합니다.

  it("정의되어야 한다", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    const createUserDto: CreateUserDto = {
      email: "test@example.com",
      password: "password",
      name: "Wan",
      phone: "",
      nickname: "Lee",
      gender: Gender.Female,
      age: 29,
    };

    it("이메일이 없으면 새로운 유저를 만들어야 합니다", async () => {
      const user = new User();
      jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(null);
      jest.spyOn(userRepository, "create").mockReturnValueOnce(user);
      jest.spyOn(userRepository, "save").mockResolvedValueOnce(user);

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        status: {
          code: 200,
          message: "회원가입 성공!",
        },
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });
    const existingUser = new User();
    existingUser.email = createUserDto.email;

    it("이메일이 이미 존재하는 경우 ConflictException을 발생시켜야 합니다", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrowError(
        ConflictException
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
    });
  });

  // describe("findAll", () => {
  //   it("should return all users", () => {
  //     const result = service.findAll();
  //     expect(result).toEqual("This action returns all users");
  //   });
  // });

  // describe("findOneId", () => {
  //   const id = "1";

  //   it("should return the user with the specified id", async () => {
  //     const user = new User();
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(user);

  //     const result = await service.findOneId(id);

  //     expect(result).toEqual(user);
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  //   });
  // });

  // describe("findOneEmail", () => {
  //   const email = "test@example.com";

  //   it("should return the user with the specified email", async () => {
  //     const user = new User();
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(user);

  //     const result = await service.findOneEmail(email);

  //     expect(result).toEqual(user);
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
  //   });
  // });

  // describe("findOnePhone", () => {
  //   const phone = "1234567890";

  //   it("should return the phone number of the user with the specified phone", async () => {
  //     const user = new User();
  //     user.phone = phone;
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(user);

  //     const result = await service.findOnePhone({ phone });

  //     expect(result).toEqual(user.phone);
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ phone });
  //   });
  // });

  // describe("updateUser", () => {
  //   const id = "1";
  //   const updateUserDto: UpdateUserDto = {
  //     email: "newemail@example.com",
  //     password: "newpassword",
  //     phone: "1234567890",
  //     name: "New Name",
  //   };

  //   it("should update the user with the specified id", async () => {
  //     const user = new User();
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(user);
  //     jest.spyOn(userRepository, "save").mockResolvedValueOnce(user);

  //     const result = await service.updateUser(id, updateUserDto);

  //     expect(result).toEqual(user);
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  //     expect(userRepository.save).toHaveBeenCalledWith(user);
  //   });

  //   it("should return null if user is not found", async () => {
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(null);

  //     const result = await service.updateUser(id, updateUserDto);

  //     expect(result).toBeNull();
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  //     expect(userRepository.save).not.toHaveBeenCalled();
  //   });

  //   it("should update only the provided fields", async () => {
  //     const user = new User();
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(user);
  //     jest.spyOn(userRepository, "save").mockResolvedValueOnce(user);

  //     await service.updateUser(id, { email: "newemail@example.com" });

  //     expect(user.email).toBe(updateUserDto.email);
  //     expect(user.password).toBeUndefined();
  //     expect(user.phone).toBeUndefined();
  //     expect(user.name).toBeUndefined();
  //   });
  // });

  // describe("userProfile", () => {
  //   const id = "1";

  //   it("should return the user profile of the user with the specified id", async () => {
  //     const user = new User();
  //     user.email = "test@example.com";
  //     user.nickname = "Test User";
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(user);

  //     const result = await service.userProfile(id);

  //     expect(result).toEqual({
  //       email: user.email,
  //       nickname: user.nickname,
  //     });
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  //   });

  //   it("should return null if user is not found", async () => {
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(null);

  //     const result = await service.userProfile(id);

  //     expect(result).toBeNull();
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  //   });
  // });

  // describe("remove", () => {
  //   const id = "1";

  //   it("should return a message indicating the removal of the user with the specified id", () => {
  //     const result = service.remove(id);
  //     expect(result).toEqual(`This action removes a #${id} user`);
  //   });
  // });

  // describe("findOneChemiRating", () => {
  //   const id = "1";

  //   it("should return the chemiRating of the user with the specified id", async () => {
  //     const user = new User();
  //     user.chemiRating = 4.5;
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(user);

  //     const result = await service.findOneChemiRating(id);

  //     expect(result).toEqual(user.chemiRating);
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  //   });

  //   it("should throw a NotFoundException if user is not found", async () => {
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(null);

  //     await expect(service.findOneChemiRating(id)).rejects.toThrowError(
  //       NotFoundException
  //     );
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  //   });
  // });

  // describe("updateChemiRating", () => {
  //   const id = "1";
  //   const newChemiRating = 4.8;

  //   it("should update the chemiRating of the user with the specified id", async () => {
  //     const user = new User();
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(user);
  //     jest.spyOn(userRepository, "save").mockResolvedValueOnce(user);

  //     const result = await service.updateChemiRating(id, newChemiRating);

  //     expect(result).toEqual(user);
  //     expect(user.chemiRating).toEqual(newChemiRating);
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  //     expect(userRepository.save).toHaveBeenCalledWith(user);
  //   });

  //   it("should throw a NotFoundException if user is not found", async () => {
  //     jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(null);

  //     await expect(
  //       service.updateChemiRating(id, newChemiRating)
  //     ).rejects.toThrowError(NotFoundException);
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  //     expect(userRepository.save).not.toHaveBeenCalled();
  //   });
  // });
});
