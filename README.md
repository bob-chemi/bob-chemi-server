# 서비스 기획의도
혼밥하는 사람들을 위한 매칭 서비스입니다. 점점 개인화되어가고 있는 현대사회에서 많은 사람들이 혼자 식사를 합니다. 이러한 현상은 “혼밥 문화”로 자리 잡았고 이는 사회적 고립 문제로 이어질 수도 있습니다.

"밥케미" 서비스는 혼자 식사하는 사람들의 요구를 충족시키기 위해 탄생하였습니다. 사용자는 자신의 위치를 기반으로 원하는 상대방의 나이, 성별 등의 조건을 설정하고 서비스에 등록합니다. 이후 다른 사용자가 입력한 조건과 사용자의 정보가 일치할 때 매칭이 이루어집니다.

1:1 매칭 뿐만 아니라 같은 관심사를 가진 사람들이 모여 함께 식사하고 이야기를 나눌 수 있는 소모임 기능도 제공합니다. 사용자는 특정 주제를 기반으로 소모임을 개설하거나 기존의 소모임에 참여하여 더 많은 사람들과의 소통과 친목을 도모할 수 있습니다.

“밥케미”는 혼밥하는 사람들에게 새로운 가치를 제공함으로써 그들의 식사 경험을 더욱 풍요롭게 만들고, 사람들이 서로를 더 잘 이해하고 소통할 수 있는 기회를 제공하는 것을 목표로 합니다.
</br>
</br>

# 서비스 배포 주소

</br>
</br>

# 제작 기간 & 참여 인원 </br>
- 2023년 06월 ~ 2023년 07월 </br>
- `FE`: 3명, `BE`: 3명 
</br>
</br>


# 사용 기술
- Nest.js, TypeScript, Rest-API / AWS, S3, EC2 / PostgreSQL, TypeORM, Redis / JWT/ Docker
- Socket.io

</br>
</br>


# 핵심 기능

- 1:1 매칭: 사용자는 자신의 선호하는 나이대, 성별, 위치 등을 설정하여 서비스에 등록할 수 있습니다. 이 정보를 바탕으로 서비스는 가장 잘 맞는 다른 사용자를 매칭해줍니다. 매칭된 사용자들은 함께 식사를 하며 새로운 경험을 쌓고 관계를 형성할 수 있습니다.

- 소모임 기능: 사용자는 특정 주제를 기반으로 소모임을 개설하거나 기존의 소모임에 참여하여 더 많은 사람들과의 소통과 친목을 도모할 수 있습니다. 이는 1:1 매칭보다 더 넓은 범위의 사람들과 교류할 수 있는 기회를 제공합니다.

- 리뷰 및 평가 시스템: 사용자는 매칭된 사람이나 소모임에 참여한 사람들에 대해 리뷰와 평가를 남길 수 있습니다. 이는 서비스의 신뢰성을 높이고, 사용자 간의 상호 작용을 촉진하는 역할을 합니다.

- 맛집 추천 기능: 매칭이 완료된 후, 사용자의 위치를 기반으로 주변의 맛집을 추천해주는 기능이 있습니다. 이를 통해 사용자는 새로운 맛집을 발견하고 함께 식사를 하는 장소를 쉽게 선택할 수 있습니다.
</br>
</br>
</br>
</br>

# ERD
https://www.erdcloud.com/d/Dub6mgRScDSSMiBT7
</br>
</br>
<img width="1000" alt="스크린샷 2023-07-26 오후 4 45 17" src="https://github.com/bob-chemi/bob-chemi-server/assets/113571059/37b17307-087b-4669-b620-1cb175cacb9f">

</br>
</br>

# API DOCS
  Swagger Docs
</br>
</br>
# 서버 폴더구조
```
📦src
 ┣ 📂apis
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜create-auth.dto.ts
 ┃ ┃ ┃ ┣ 📜login.dto.ts
 ┃ ┃ ┃ ┣ 📜sendPhone.dto.ts
 ┃ ┃ ┃ ┗ 📜update-auth.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜auth.entity.ts
 ┃ ┃ ┣ 📂test
 ┃ ┃ ┃ ┣ 📜auth.controller.spec.ts
 ┃ ┃ ┃ ┗ 📜auth.service.spec.ts
 ┃ ┃ ┣ 📜auth.controller.ts
 ┃ ┃ ┣ 📜auth.module.ts
 ┃ ┃ ┗ 📜auth.service.ts
 ┃ ┣ 📂file-upload
 ┃ ┃ ┣ 📜file-upload.controller.ts
 ┃ ┃ ┣ 📜file-upload.module.ts
 ┃ ┃ ┗ 📜file-upload.service.ts
 ┃ ┣ 📂foodie-board
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜create-foodie-board.dto.ts
 ┃ ┃ ┃ ┗ 📜update-foodie-board.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┣ 📜foodie-board.entity.ts
 ┃ ┃ ┃ ┗ 📜foodieBoard-image.entity.ts
 ┃ ┃ ┣ 📂test
 ┃ ┃ ┃ ┣ 📜foodie-board.controller.spec.ts
 ┃ ┃ ┃ ┗ 📜foodie-board.service.spec.ts
 ┃ ┃ ┣ 📜foodie-board.controller.ts
 ┃ ┃ ┣ 📜foodie-board.module.ts
 ┃ ┃ ┗ 📜foodie-board.service.ts
 ┃ ┣ 📂group
 ┃ ┃ ┣ 📂groupBoard
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┣ 📜create.group.dto.ts
 ┃ ┃ ┃ ┃ ┗ 📜update.group.dto.ts
 ┃ ┃ ┃ ┣ 📂entites
 ┃ ┃ ┃ ┃ ┣ 📜groups.entity.ts
 ┃ ┃ ┃ ┃ ┣ 📜groups.status.enum.ts
 ┃ ┃ ┃ ┃ ┣ 📜members.entity.ts
 ┃ ┃ ┃ ┃ ┗ 📜members.status.enum.ts
 ┃ ┃ ┃ ┣ 📂pipes
 ┃ ┃ ┃ ┃ ┗ 📜group.status.validation.ts
 ┃ ┃ ┃ ┣ 📜groups.controller.ts
 ┃ ┃ ┃ ┣ 📜groups.module.ts
 ┃ ┃ ┃ ┣ 📜groups.service.ts
 ┃ ┃ ┃ ┗ 📜groups.spec.ts
 ┃ ┃ ┗ 📂groupChat
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┣ 📜chatRoomUsers.entity.ts
 ┃ ┃ ┃ ┃ ┣ 📜chatRooms.entity.ts
 ┃ ┃ ┃ ┃ ┗ 📜chats.entity.ts
 ┃ ┃ ┃ ┣ 📂test
 ┃ ┃ ┃ ┃ ┗ 📜socket.test.ts
 ┃ ┃ ┃ ┣ 📜groupChats.controller.ts
 ┃ ┃ ┃ ┣ 📜groupChats.gateway.ts
 ┃ ┃ ┃ ┣ 📜groupChats.module.ts
 ┃ ┃ ┃ ┗ 📜groupChats.service.ts
 ┃ ┣ 📂matching
 ┃ ┃ ┣ 📂matchingchat
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┗ 📜matchingchat.entity.ts
 ┃ ┃ ┃ ┣ 📜chatGateway.ts
 ┃ ┃ ┃ ┣ 📜matchingchat.controller.ts
 ┃ ┃ ┃ ┣ 📜matchingchat.gateway.ts
 ┃ ┃ ┃ ┣ 📜matchingchat.module.ts
 ┃ ┃ ┃ ┗ 📜matchingchat.service.ts
 ┃ ┃ ┣ 📂matchingroom
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┗ 📜create-checkInfo.dto.ts
 ┃ ┃ ┃ ┣ 📜dfdf.ts
 ┃ ┃ ┃ ┣ 📜matchingroom.controller.ts
 ┃ ┃ ┃ ┣ 📜matchingroom.module.ts
 ┃ ┃ ┃ ┗ 📜matchingroom.service.ts
 ┃ ┃ ┗ 📂quickmatchings
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┗ 📜create-quickmatching.dto.ts
 ┃ ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┃ ┣ 📜matchingroom.entity.ts
 ┃ ┃ ┃ ┃ ┗ 📜quickmatchings.entity.ts
 ┃ ┃ ┃ ┣ 📜quickmatchings.controller.ts
 ┃ ┃ ┃ ┣ 📜quickmatchings.gateway.ts
 ┃ ┃ ┃ ┣ 📜quickmatchings.module.ts
 ┃ ┃ ┃ ┗ 📜quickmatchings.service.ts
 ┃ ┣ 📂quickmatchings
 ┃ ┣ 📂restaurantMark
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜restaurantMark.entity.ts
 ┃ ┃ ┣ 📜restaurantMark.controller.ts
 ┃ ┃ ┣ 📜restaurantMark.module.ts
 ┃ ┃ ┗ 📜restaurantMark.service.ts
 ┃ ┣ 📂restaurantlists
 ┃ ┃ ┣ 📜restaurantlists.controller.ts
 ┃ ┃ ┣ 📜restaurantlists.module.ts
 ┃ ┃ ┗ 📜restaurantlists.service.ts
 ┃ ┣ 📂reviews
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┗ 📜create-review.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜reviews.entity.ts
 ┃ ┃ ┣ 📂interfaces
 ┃ ┃ ┃ ┗ 📜review.interface.ts
 ┃ ┃ ┣ 📜reviews.controller.ts
 ┃ ┃ ┣ 📜reviews.module.ts
 ┃ ┃ ┗ 📜reviews.service.ts
 ┃ ┗ 📂users
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜create-user.dto.ts
 ┃ ┃ ┃ ┣ 📜update-user.dto.ts
 ┃ ┃ ┃ ┗ 📜userProfileDto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜user.entity.ts
 ┃ ┃ ┣ 📂test
 ┃ ┃ ┃ ┣ 📜users.controller.spec.ts
 ┃ ┃ ┃ ┗ 📜users.service.spec.ts
 ┃ ┃ ┣ 📜users.controller.ts
 ┃ ┃ ┣ 📜users.module.ts
 ┃ ┃ ┗ 📜users.service.ts
 ┣ 📂common
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜jwt-access.strategy.ts
 ┃ ┃ ┣ 📜jwt-refresh.strategy.ts
 ┃ ┃ ┗ 📜rest-auth-guards.ts
 ┃ ┣ 📂phone
 ┃ ┃ ┗ 📜pohone.services.ts
 ┃ ┗ 📂utils
 ┃ ┃ ┣ 📜jwt-interface.ts
 ┃ ┃ ┣ 📜multer.options.ts
 ┃ ┃ ┗ 📜pohone.services.ts
 ┣ 📜app.controller.spec.ts
 ┣ 📜app.controller.ts
 ┣ 📜app.module.ts
 ┣ 📜app.service.ts
 ┗ 📜main.ts
```

# 4. 핵심 트러블슈팅


# 5. 기타 트러블 슈팅

