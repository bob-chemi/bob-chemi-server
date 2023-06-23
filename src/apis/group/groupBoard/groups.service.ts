import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { GroupStatus } from "./entites/groups.status.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Group } from "./entites/groups.entity";
import { CreateGroupDto } from "./dto/create.group.dto";
import { Equal, FindOneOptions, Repository } from "typeorm";
import { UpdateGroupDto } from "./dto/update.group.dto";
import { Member } from "./entites/members.entity";
import { MemberStatus } from "./entites/members.status.enum";
import { UsersService } from "src/apis/users/users.service";
import { FileUploadService } from "src/apis/file-upload/file-upload.service";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private userServices: UsersService,

    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private readonly fileUploadService: FileUploadService
  ) {}

  //<<------------소모임 조회------------>>
  async getAllGroups(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  //<<------------ID로 소모임 조회------------>>
  async getGroupById(groupId: any): Promise<Group> {
    const found = await this.groupRepository.findOne({ where: groupId });

    if (!found) {
      throw new NotFoundException(`${groupId} 는 올바르지 않은 ID 입니다.`);
    }
    return found;
  }

  //<<------------날짜로 소모임 조회------------>>
  async getGroupByDate(groupDate: Date): Promise<Group[]> {
    const found = await this.groupRepository.find({ where: { groupDate } });
    return found;
  }

  //<<------------내가 만든 소모임 조회------------>>
  async getMyGroup(userId: string): Promise<Group[]> {
    const myGroup = await this.groupRepository
      .createQueryBuilder("group")
      .leftJoin("group.owner", "owner")
      .where("owner.id = :userId", { userId })
      .getMany();

    return myGroup;
  }

  // <<------------내가 가입한 소모임 조회------------>>
  async getMyConfirmedGroup(userId: string): Promise<Group[]> {
    const user = await this.userServices.findOneId(userId);
    const member = await this.memberRepository.find({
      where: {
        user: { id: user.id }, //
        status: MemberStatus.CONFIRMED,
      },
      relations: ["group"],
    });
    const joinedGroups = member.map((m) => m.group);
    return joinedGroups;
  }

  //<<------------소모임 생성------------>>
  async createGroup(
    createGroupDto: CreateGroupDto,
    userId: string,
    file: Express.MulterS3.File
  ): Promise<Group> {
    const user = await this.userServices.findOneId(userId);
    const image = file ? [await this.fileUploadService.uploadFile(file)] : [];

    const newGroup = await this.groupRepository.save({
      ...createGroupDto,
      image: image[0]?.filePath || "",
      owner: user,
    });

    const firstMember = this.memberRepository.create({
      group: newGroup,
      user,
      status: MemberStatus.CONFIRMED,
    });

    await this.memberRepository.save(firstMember);

    return newGroup;
  }

  //<<------------소모임 게시글 삭제------------>>
  async deleteGroup(groupId: number): Promise<void> {
    const result = await this.groupRepository.softDelete(groupId);
    if (result.affected === 0) {
      throw new NotFoundException(`${groupId}로 작성된 게시글이 없습니다.`);
    }
  }

  //<<------------소모임 수정------------>>
  async updateGroup(
    groupId: number,
    updateGroupDto: UpdateGroupDto,
    file: Express.MulterS3.File
  ): Promise<Group> {
    //이부분에서 유저 아이디를 다 받아와서 아래코드로 바꿔줌
    // const group = await this.getGroupById(groupId);
    const group = await this.groupRepository.findOne({ where: { groupId } });

    // 새로운 파일이 제공되고 그룹에 기존 파일이 있는 경우, 기존 파일 삭제
    if (file && group.image) {
      const oldFilePath = group.image;
      // 파일 URL에서 폴더 경로 추출
      await this.fileUploadService.deleteFile(oldFilePath);
    }

    // 새로운 파일이 제공되면 파일 URL 업데이트
    if (file) {
      group.image = file.location;
    }

    Object.assign(group, updateGroupDto);
    const updatedGroup = await this.groupRepository.save(group);
    return updatedGroup;
  }

  //<<------------소모임 구인 중 상태 변경------------>>
  async updateGroupStatus(groupId: number): Promise<Group> {
    const group = await this.getGroupById(groupId);

    if (group.status === GroupStatus.PUBLIC) {
      group.status = GroupStatus.PRIVATE;
    } else if (group.status === GroupStatus.PRIVATE) {
      group.status = GroupStatus.PUBLIC;
    }

    await this.groupRepository.save(group);
    return group;
  }

  //<<------------소모임 가입 신청------------>>
  async joinGroup(email: string, groupId: any): Promise<Member> {
    const user = await this.userServices.findOneEmail(email);
    const group = await this.groupRepository.findOne({ where: { groupId } });

    const isPending = await this.memberRepository.findOne({
      where: {
        user: Equal(user.id),
        status: MemberStatus.PENDING,
      },
    });

    const isConfirmed = await this.memberRepository.findOne({
      where: {
        user: Equal(user.id),
        status: MemberStatus.CONFIRMED,
      },
    });

    const confirmedMember = await this.memberRepository.count({
      where: {
        group: { groupId: group.groupId },
        status: MemberStatus.CONFIRMED,
      },
    });

    if (Number(group.groupPeopleLimit) <= confirmedMember) {throw new ConflictException("인원이 마감되었습니다.");} //prettier-ignore
    if (isPending) {throw new ConflictException("이미 가입신청 되었습니다.");} //prettier-ignore
    if (isConfirmed) {throw new ConflictException("이미 가입된 소모임입니다.");} //prettier-ignore

    const newMember = new Member();
    newMember.user = user;
    newMember.group = group;
    newMember.status = MemberStatus.PENDING;

    return this.memberRepository.save(newMember);
  }

  //<<------------소모임 신청에 대한 수락------------>>
  async acceptMember(memberId: string, groupId: any): Promise<Member> {
    const group = await this.groupRepository.findOne({
      where: { groupId },
      relations: ["members"],
    });

    const checkRequest = await this.memberRepository.findOne({
      where: {
        memberId: memberId,
        status: MemberStatus.PENDING,
      },
    });
    if(!group) {throw new NotFoundException('찾을 수 없는 소모임 입니다.')} //prettier-ignore
    if (!checkRequest) {throw new NotFoundException("가입 신청이 없는 멤버입니다.")} //prettier-ignore
    if (checkRequest.status === MemberStatus.CONFIRMED) {throw new NotFoundException("이미 수락한 신청자 입니다.")} //prettier-ignore

    const groupMembersCount = group.members.length + 1;

    if (groupMembersCount >= Number(group.groupPeopleLimit)) {
      group.status = GroupStatus.PRIVATE;
      await group.save();
    }

    checkRequest.status = MemberStatus.CONFIRMED;
    return this.memberRepository.save(checkRequest);
  }

  //<<------------소모임 신청에 대한 거절(삭제)------------>>
  async denyMember(memberId: any, groupId: number): Promise<void> {
    const request = await this.memberRepository.findOne(memberId);
    const group = await this.groupRepository.findOne({ where: { groupId } });

    if(!request) {throw new NotFoundException('찾을 수 없는 신청자 입니다.')} //prettier-ignore
    if(!group) {throw new NotFoundException('찾을 수 없는 소모임 입니다.')} //prettier-ignore

    await this.memberRepository.softDelete(request.memberId);
  }

  //<<------------가입 대기중인 멤버 조회------------>>
  async getPendingMembers(groupId: any): Promise<Member[]> {
    const group: FindOneOptions<Group> = { where: { groupId: groupId } };
    const foundGroup = await this.groupRepository.findOne(group);
    const pendingMembers = await this.memberRepository.find({
      where: {
        group: { groupId: foundGroup.groupId },
        status: MemberStatus.PENDING,
      },
    });

    if (!foundGroup) {throw new NotFoundException("찾을 수 없는 소모임입니다.")} //prettier-ignore
    if (pendingMembers.length === 0) {throw new NotFoundException("가입 대기 중인 멤버가 없습니다.")} //prettier-ignore

    return pendingMembers;
  }

  //<<------------가입된 멤버 조회------------>>
  async getConfirmedMembers(groupId: number): Promise<Member[]> {
    const group: FindOneOptions<Group> = { where: { groupId: groupId } };
    const foundGroup = await this.groupRepository.findOne(group);

    const confirmedMembers = await this.memberRepository.find({
      where: {
        group: { groupId: foundGroup.groupId },
        status: MemberStatus.CONFIRMED,
      },
    });

    if (!foundGroup) {throw new NotFoundException("찾을 수 없는 소모임입니다.")} //prettier-ignore
    if (confirmedMembers.length === 0) {throw new NotFoundException("가입한 멤버가 없습니다.");} //prettier-ignore

    return confirmedMembers;
  }
}
