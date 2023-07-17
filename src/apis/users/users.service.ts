import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserProfileDto } from "./dto/userProfileDto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async create(createUserDto: CreateUserDto) {
    const email = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (email) {
      throw new ConflictException("이미 가입한 email입니다.");
    }

    const user = this.userRepository.create(createUserDto);
    user.password = createUserDto.password;
    await this.userRepository.save(user);
    return {
      status: {
        code: 200,
        message: "회원가입 성공!",
      },
    };
  }
  findAll() {
    return `This action returns all users`;
  }

  async findOneId(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOnePhone({ phone }: { phone: string }): Promise<string> {
    const user = await this.userRepository.findOneBy({ phone });
    return user.phone;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null; // 사용자를 찾지 못한 경우 null 반환
    }
    console.log(updateUserDto);
    console.log(user);
    // DTO에서 업데이트 내용 적용
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.password) {
      // 비밀번호 해싱 또는 필요한 다른 작업 수행
      user.password = updateUserDto.password;
    }
    if (updateUserDto.phone) {
      user.phone = updateUserDto.phone;
    }
    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    // 업데이트된 사용자 저장
    return await this.userRepository.save(user);
  }

  async userProfile(id: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }

    const userProfile: UserProfileDto = {
      email: user.email,
      nickname: user.nickname,
    };
    return userProfile;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async findOneChemiRating(id): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    return user.chemiRating;
  }

  async updateChemiRating(id: string, newChemiRating: number) {
    //: Promise<User>
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    user.chemiRating = newChemiRating;
    return this.userRepository.save(user); // user
  }
}
