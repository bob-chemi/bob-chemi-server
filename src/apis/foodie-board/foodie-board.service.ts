import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileUploadService } from "../file-upload/file-upload.service";
import { User } from "../users/entities/user.entity";
import { CreateFoodieBoardDto } from "./dto/create-foodie-board.dto";
import { UpdateFoodieBoardDto } from "./dto/update-foodie-board.dto";
import { FoodieBoard } from "./entities/foodie-board.entity";
import { FoodieImage } from "./entities/foodieBoard-image.entity";

@Injectable()
export class FoodieBoardService {
  constructor(
    @InjectRepository(FoodieBoard)
    private readonly foodieBoardRepository: Repository<FoodieBoard>,
    @InjectRepository(FoodieImage)
    private readonly imageRepository: Repository<FoodieImage>,
    private readonly fileUploadService: FileUploadService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  //<<------------맛잘알 게시글 생성------------>>
  async create(
    createFoodieBoardDto: CreateFoodieBoardDto,
    userId: string,
    files: Express.MulterS3.File[]
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다");
    }
    const urls =
      files && files.length > 0
        ? await this.fileUploadService.uploadFiles(files)
        : [];

    const images =
      urls && urls.length > 0
        ? await Promise.all(
            urls.map(async (url) => {
              return this.imageRepository.create({ url: [url] });
            })
          )
        : [];

    const foodieBoard = await this.foodieBoardRepository.save({
      ...createFoodieBoardDto,
      user: { id: userId },
      images,
    });

    return foodieBoard;
  }
  //<<------------맛잘알 게시글 전체조회------------>>

  async findAll() {
    return await this.foodieBoardRepository.find({ relations: ["user"] });
  }

  ///수정 하기 유저아이디 받아와서
  //<<------------맛잘알 게시글 유저 조회------------>>
  async findOne(id: string) {
    console.log(id, " 111111111111111111111111");
    return await this.foodieBoardRepository.find({
      where: { user: { id: id } },
      relations: ["images"],
    });
  }

  //<<------------맛잘알 게시글 상세조회------------>>
  async findDetail(id: string) {
    return await this.foodieBoardRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }
  //<<------------맛잘알 게시글 수정------------>>
  async update(
    id: string, //
    updateFoodieBoardDto: UpdateFoodieBoardDto,
    userId: string,
    files: Express.MulterS3.File[]
  ) {
    const existingFoodieBoard = await this.foodieBoardRepository.findOne({
      where: { id },
      relations: ["user", "images"],
    });

    if (!existingFoodieBoard) {
      throw new BadRequestException("해당 게시글이 존재하지 않습니다.");
    }

    if (existingFoodieBoard.user.id !== userId) {
      throw new BadRequestException("게시글을 수정할 권한이 없습니다.");
    }

    if (files.length > 0) {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const url = await this.fileUploadService.uploadFiles(files);
          return this.imageRepository.create({ url });
        })
      );

      // 기존 이미지들 삭제
      if (existingFoodieBoard.images) {
        await Promise.all(
          existingFoodieBoard.images.map(async (image) => {
            console.log("=============", image);
            await this.fileUploadService.deleteFiles(image.url);
            await this.imageRepository.delete(image.id);
          })
        );
      }

      // 새로운 이미지들 추가
      existingFoodieBoard.images = newImages;
    }

    if (updateFoodieBoardDto.title !== undefined) {
      existingFoodieBoard.title = updateFoodieBoardDto.title;
    }
    if (updateFoodieBoardDto.content !== undefined) {
      existingFoodieBoard.content = updateFoodieBoardDto.content;
    }

    return await this.foodieBoardRepository.save(existingFoodieBoard);
  }

  //<<------------맛잘알 게시글 삭제------------>>
  async remove(id: string, userId: string) {
    const existingFoodieBoard = await this.foodieBoardRepository.findOne({
      where: { id },
      relations: ["user", "images"],
    });

    if (!existingFoodieBoard) {
      throw new BadRequestException("해당 게시글이 존재하지 않습니다.");
    }
    console.log(existingFoodieBoard, "===========", userId);
    if (existingFoodieBoard.user.id !== userId) {
      throw new BadRequestException("게시글을 삭제할 권한이 없습니다.");
    }

    // 기존 이미지들 삭제
    if (existingFoodieBoard.images) {
      await Promise.all(
        existingFoodieBoard.images.map(async (image) => {
          await this.fileUploadService.deleteFiles(image.url);
          await this.imageRepository.delete(image.id);
        })
      );
    }

    // Post 삭제
    await this.foodieBoardRepository.delete(id);
    return { message: `Post with id ${id} has been removed` };
  }
}
