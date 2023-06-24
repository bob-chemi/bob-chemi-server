import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { UsersService } from "src/apis/users/users.service";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";
import { QuickMatching } from "../quickmatchings/entities/quickmatchings.entity";
import { CreateCheckInfoDto } from "./dto/create-checkInfo.dto";
import { MatchingRoom } from "./entities/matchingroom.entity";
import { MatchingRoomService } from "./matchingroom.service";

@ApiTags("매칭룸 API")
@Controller("matchingRoom")
export class MatchingRoomController {
  constructor(
    private readonly matchingRoomService: MatchingRoomService,
    private readonly usersService: UsersService
  ) {}

  //----------------- 매칭 성사-----------------------//
  // @Post()
  // @UseGuards(RestAuthAccessGuard)
  // @ApiOperation({ summary: "매칭 요청" })
  // async checkInfoForMatching(
  //   @Body() createCheckInfoDto: CreateCheckInfoDto,
  //   @Req() req: Request
  // ): Promise<QuickMatching[]> {
  //   // 퀵매칭 id 로 퀵매칭 가져오기 (dto)
  //   const userId = (req.user as any).id;
  //   const user = await this.usersService.findOneId(userId);
  //   // const myGender = user.gender;
  //   // const myAge = user.age;
  //   // const myAgeGroup = this.getAgeGroup(myAge);
  //   const { targetGender, targetAgeGroup, quickMatchingId } =
  //     createCheckInfoDto;
  //   // const matchingRoom = await this.matchingRoomService.checkMatching({
  //   //   userId,
  //   //   targetGender,
  //   //   targetAgeGroup,
  //   //   quickMatchingId,
  //   // });

  //   const matchingRoom = await this.matchingRoomService.findTargetUser();

  //   return matchingRoom;
  // }
  // getAgeGroup(age: number): string {
  //   if (age >= 10 && age <= 19) {
  //     return "TEENAGER";
  //   } else if (age >= 20 && age <= 29) {
  //     return "TWENTIES";
  //   } else if (age >= 30 && age <= 39) {
  //     return "THIRTIES";
  //   } else if (age >= 40 && age <= 49) {
  //     return "FORTIES";
  //   } else if (age >= 50 && age <= 59) {
  //     return "FIFTIES";
  //   } else {
  //     return "기타";
  //   }
  // }
  //----------------- 매칭된 상대방 유저 정보 조회 -----------------------//
  // 매칭된 유저의 정보 확인할 수 있도록
  // 수정하기
  @Get(":id") // 퀵매칭아이디
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭된 상대방 유저 정보 조회 " })
  async fetchQuickMatching(@Param("id") quickMatchingId: string) {
    //return this.matchingRoomService.findOne(id);
    return this.matchingRoomService.findTargetUser();
  }

  //----------------- 매칭 수락 -----------------------//
  // 수락을 하면 isMatched == true, db에 저장 , 매칭챗 생성
  //테스트 해보기
  @Post("/:accept")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭 수락 " })
  async acceptMatching(@Body("quickMatchingId") quickMatchingId: string) {
    //matchedUserId
    console.log("라우브");
    await this.matchingRoomService.accept(quickMatchingId);
    return { message: "매칭 수락" };
  }

  //----------------- 매칭된 유저 삭제  -----------------------//
  @Delete("/delete/:id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭된 유저 삭제" })
  async deleteMatchingUser(@Param("id") matchingRoomId: string) {
    await this.matchingRoomService.delete(matchingRoomId);
    return { message: "매칭된 유저 삭제 완료" };
  }

  //----------------- 매칭룸에서 제거(시간 제한)-----------------------//
  // 대기 시간 설정 메서드
  // setWaitingTime(waitingHours: number) {
  //   this.waitingStart = new Date();  // 대기 시작 시간을 현재 시간으로 설정
  //   this.waitingEnd = new Date();
  //   this.waitingEnd.setHours(this.waitingEnd.getHours() + waitingHours);  // 대기 시작 시간으로부터 대기 시간만큼 추가하여 대기 종료 시간 설정
  // }
}
