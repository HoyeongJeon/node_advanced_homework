# Node.js와 express, MySQL로 백엔드 서버 만들기

---

# 환경변수

- MYSQL_DATABASE
- MYSQL_USERNAME
- MYSQL_PASSWORD
- MYSQL_HOST
- SECRET_KEY

# API 명세서 URL

https://docs.google.com/spreadsheets/d/1nABip_FHGov5CT_5KmkJyqd4JMnJzJE1tXoTaPT9c08/edit#gid=0

# ERD URL

https://www.erdcloud.com/d/DGkHwH6pRxHr7sk65

# 더 고민해 보기

1. **암호화 방식**

- 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 `단방향 암호화`와 `양방향 암호화` 중 어떤 암호화 방식에 해당할까요?
  - 단방향 암호화
- 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
  - 혹시 DB가 해킹되었을 때, 비밀번호는 암호화 되어 있으므로 안전하다.

2. **인증 방식**

- JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
  - 서버는 토큰의 주인이 누구인지에 대한 정보를 저장하지 않고, stateless하다. 그러므로 노출되면 토큰을 서버에서 임의로 파기하기 어렵다.
- 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
  - 토큰의 단점은 현재 토큰을 사용하려는 사람이 토큰의 원래 주인이 맞는지 알지 못한다는 점이라 생각한다. 그러므로 access token의 시간을 짧게 두고, access token을 생성하는 refresh token을 두는 방법이라 생각한다. 이 경우 access token의 만료시간이 짧기에, 유출되더라도 빠르게 만료가 되므로, 훔친 access token 사용이 불가능하게 된다.

3. **인증과 인가**

- 인증과 인가가 무엇인지 각각 설명해 주세요.
  - **인증**은 신원을 확인하는 것이라 생각한다. 예를 들어, 로그인을 하는것이다. 또는 은행에 갔을 때 신분증을 제시하는 것과 같다.
  - **인가**는 접근 권한에 관한 것이다. 어뗜 개체가 어떤 리소스에 접근할 수 있는지를 구분하는 것이다. 예를 들어, 특정 사이트의 회원 정보가 db에 저장되어 있다고 하면, 일반 사용자는 로그인이 되었더라도, db를 볼 수 없게한다. 권한이 있는 사람들만 db에 접근할 수 있도록 해야한다. 이렇게 접근 권한이 있는 사람을 체크하는 것이 인가라고 생각한다.
- 과제에서 구현한 Middleware는 인증에 해당하나요? 인가에 해당하나요? 그 이유도 알려주세요.
  - 인가에 해당한다. 예를 들어 상품을 삭제한다 생각하자. 로그인이 되었다고 모두가 상품을 삭제할 수 있을까? 로그인한 사람과 상품을 올린 사람이 같은 사람이어야 삭제 권한을 얻게된다. 이렇게 삭제기능의 접근 권한을 체크하는 것이므로 인가라고 생각한다.

4. **Http Status Code**

- 과제를 진행하면서 `사용한 Http Status Code`를 모두 나열하고, 각각이 `의미하는 것`과 `어떤 상황에 사용`했는지 작성해 주세요.

  4-1. **400(Bad Request)**

  - 로그인 및 회원가입 시 이메일이 없거나, 비밀번호가 일치하지 않는 경우, 인증 정보와 불일치한 정보를 전달했으므로 클라이언트의 잘못된 요청으로 판단해 400을 내려준다.

  4-2. **401(Unauthorized)**

  - 인증에 실패한 경우, 401(Unauthorized) 상태코드를 내려준다.

  4-3. **404(Not Found)**

  - 특정 상품을 조회, 수정, 삭제하는 경우 , 상품이 존재하지 않는다면 리소스 없음을 의미하는 404를 내려준다.

  4-4. **409(Conflict)**

  - 회원가입을 할 때 이미 존재하는 ID를 입력한 경우, 서버에 존재하는 리소스와 충돌을 일으킨 경우라 판단하여 409를 내려준다.

  4-5. **200(OK)**

  - 요청에 대한 처리에 성공하는 경우 200을 내려준다.

  4-6. **201(Created)**

  - 회원가입에 성공하거나 새로운 상품을 등록하는 경우, 새로운 리소스를 생성한 것이므로 201을 내려준다.

  4-7. **500(Internal Server Error)**

  - 처리하지 못한 에러가 발생했을때, 500을 내려준다.

5. **리팩토링**

- MongoDB, Mongoose를 이용해 구현되었던 코드를 MySQL, Sequelize로 변경하면서, 많은 코드 변경이 있었나요? 주로 어떤 코드에서 변경이 있었나요?
  - 큰 코드 변경은 없었다. 둘 다 하는 역할이 비슷했기에, 실제 개발을 할 때 코드 변화는 몇 가지 query의 경우에만 있었다..(예를 들어 `Mongoose`를 사용했을 땐 `findById`를 통해 유저를 검색했던 것을 `Sequelize`의 경우 `findByPk`를 사용했다.)
    그러나 기본 세팅의 경우 변화가 컸다. Mongoose가 상대적으로 훨씬 간단했고, Sequelize는 수정해야 하는 부분들이 좀 있었다. 특히 외래키 설정을 하는 경우, associate을 설정해주고, migration 파일을 추가해 실제 DB에 적용이 되었는지 확인하는 부분에서 꽤 많은 코드 변화가 있었다.
- 만약 이렇게 DB를 변경하는 경우가 또 발생했을 때, 코드 변경을 보다 쉽게 하려면 어떻게 코드를 작성하면 좋을 지 생각나는 방식이 있나요? 있다면 작성해 주세요.
  - `Model Query` 들은 ORM, ODM 끼리 큰 차이가 없다고 느껴졌다. 코드 변경을 쉽게 하려면 코드를 어떻게 작성해야겠다! 라는 부분 보다는 기본적으로 ORM, ODM을 혼자 작성할 수 있도록 연습을 해야한단 생각이 들었다. 현재 프로젝트의 경우 `npx generate ...` 이렇게 명령어를 사용해 sequelize model과 migration 파일을 생성했다. 처음엔 편했지만, 외래키 설정을 해야하는 경우, 내가 직접 작성한 코드가 아니기에 어떤 부분이 어떤 역할을 하는지 헷갈렸고, 한 부분의 코드를 고치면 다른 부분에서 에러가 나는 등 좀 애를 먹었다. 이런 경험을 생각해보니, 코드의 작성보단 기본적인 orm, odm 사용법을 잘 숙지하고 있어야 할 것 같다.

6. **서버 장애 복구**

- 현재는 PM2를 이용해 Express 서버의 구동이 종료 되었을 때에 Express 서버를 재실행 시켜 장애를 복구하고 있습니다. 만약 단순히 Express 서버가 종료 된 것이 아니라, AWS EC2 인스턴스(VM, 서버 컴퓨터)가 재시작 된다면, Express 서버는 재실행되지 않을 겁니다. AWS EC2 인스턴스가 재시작 된 후에도 자동으로 Express 서버를 실행할 수 있게 하려면 어떤 조치를 취해야 할까요?
  (Hint: PM2에서 제공하는 기능 중 하나입니다.)

7. **개발 환경**

- nodemon은 어떤 역할을 하는 패키지이며, 사용했을 때 어떤 점이 달라졌나요?
  - node.js 앱을 개발할 때 파일 변화를 인지해 노드 앱을 재시작해주는 패키지이다.
  - nodemon을 사용하면서 코드를 수정하거나, 에러가 생겨서 서버가 종료되었을 시 다시 서버를 껐다가 켤 필요가 없어져서 개발 경험이 좋아졌다.
- npm을 이용해서 패키지를 설치하는 방법은 크게 일반, 글로벌(`--global, -g`), 개발용(`--save-dev, -D`)으로 3가지가 있습니다. 각각의 차이점을 설명하고, nodemon은 어떤 옵션으로 설치해야 될까요?
  - 일반적으로 설치 된 패키지(`npm i [패키지이름]`)의 경우, 개발 , 런타임 둘 다 사용이 된다. 예를 들어 `express`의 경우 개발할때 ,런타임 모두 필요하기에 일반적으로 설치한다.
  - `--global, -g`로 설치하는 경우 , 패키지 내 코드를 내 로컬 컴퓨터에 원래 있던 기능처럼 추후 추가적인 설치 없이 사용할 수 있도록 한다.
  - `--save-dev, -D` 이렇게 설치하는 경우, 실제 어플리케이션이 작동하는데 필요한 패키지는 아니지만, 개발 시 개발자의 편의성을 올려주는 패키지들을 설치할 때 사용한다. 즉, `-D` 옵션으로 설치 된 패키지는 런타임엔 사용되지 않는다.
  - Nodemon의 경우 `-D` 옵션으로 설치를 했다. 실제 우분투에 올린 뒤 실행은 `pm2`를 사용할 것이므로, 개발할때만 필요하다고 생각이 되어서 `-D`옵션으로 설치를 했다.
