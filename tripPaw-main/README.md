# TRIP PAW

<br />
<br />


## 😎 PROJECT INTRO
<div align="center">
  <img width="900" height="808" alt="Image" src="https://github.com/user-attachments/assets/21ca11d7-4f91-49c1-bbbd-eff6c2258386" />
</div>

> 처음부터 끝까지, 내 강아지와 함께 하는 여행

<br />
<br />



## 🚩 목차
- [프로젝트 정보](#프로젝트-정보)
- [요구사항 정의서](#요구사항-정의서)
- [기술 스택](#-기술-스택)
- [이용 가이드](#이용-가이드)
- [팀원](#-Crew)
- [주요 기능 시연 영상](#-주요기능-영상으로-확인하기)

---

<br />
<br />
<br />
<br />


### 프로젝트 정보
- 프로젝트 이름: TripPaw
- 개발 인원: 6명
- 개발 기간: 2025.06.19 ~ 2025.07.17
- 주요 기능:

  - [x] 지역 기반, 반려동물이 동반 가능한 장소들만 모아 경로를 추천해줍니다.
  - [x] 사용자가 직접 여행 계획을 세우고, 다른 사람에게 내가 만든 여행을 공개할 수 있습니다.
  - [x] 경로 자체에도 리뷰가 가능하며, 여러 사람이 하나의 여행 플랜으로 여행을 다녀올 수 있습니다.
  - [x] 리뷰에는 날씨 API 정보를 연동하여 사용자가 여행을 했을 당시의 날씨를 확인 할 수 있습니다.
  - [x] 여행 계획에 있는 모든 장소들을 하나하나 예약하는 것이 아닌 버튼 하나로 예약할 수 있습니다.
  - [x] 체크리스트를 생성하여 여행에 필요한 준비물을 챙길 수 있습니다.

<br />
<br />


### 요구사항 정의서
<img width="1521" height="909" alt="요구사항정의서" src="https://github.com/user-attachments/assets/4a57122f-33d4-4ee9-b752-6afd4d413d34" />


<br />
<br />

## 🛠 기술 스택
#### Backend:
- Java11
- Spring Boot 2.7.14
- MyBatis 2.3.1
- redis 2.7.14
- MySQL 8.0
- JPA 2.7.14
- Spring Security 2.7.14
- OpneAi 2.3.0
- LomBok 1.18.28

#### Frontend:
- Next.js 15.3.5
- React 18.20.0
- WebSocket 1.6.1
- dnd-kit 6.3.1
- styled components 5.3.11
- Antd 4.23.16
- data-fns 4.1.0
- Axios 1.9.0
- Kakao Map API 1.2.0

<br />
<br />

### 협업 툴
Notion, GitHub, KakaoTalk

<br />
<br />

### 이용 가이드
- 초기 데이터가 필요합니다. 자세한 내용을 다음을 참고해주세요.

👉 [초기 데이터 삽입 가이드 바로가기](https://github.com/syeon279/tripPaw/wiki/Init-Data-Guide)

<br />
<br />

## 🦾 Crew
<div align="center">
  <table style="margin: auto;">
    <thead>
      <tr>
        <th style="width: 200px;">팀원</th>
        <th style="width: 250px;">담당 기능</th>
        <th style="width: 250px;">UI</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td align="center">
          <div>
            <img width="150" src="https://github.com/user-attachments/assets/125bf686-b6bd-4043-ae9d-ba3fd02af207" alt="윤소현" /><br/>
            <a href="https://ysh-blue.notion.site/ysh?source=copy_link" target="_blank">윤소현 | 팀장</a>
          </div>
        </td>
        <td>
          공공 데이터 포털 : '한국관광공사_반려동물_동반여행_서비스' API 연결<br />
          여행 경로 추천<br />
          여행 일정 생성 / 편집 / 삭제<br />
          여행 공유하기<br />
          장소 / 여행 검색
        </td>
        <td>
          메인, 검색<br />
          장소 상세보기<br />
          경로 추천 / 편집<br />
          마이페이지 내 여행 / 장소<br />
          로그인 / 회원가입
        </td>
      </tr>
      <tr>
        <td align="center">
          <div>
            <img width="150" src="https://github.com/user-attachments/assets/c95f0fb7-2923-4b13-b6ba-e0b20348ef98" alt="이수정" /><br/>
            <a href="https://github.com/sj71791" target="_blank">이수정 | 팀원</a>
          </div>
        </td>
        <td>
          리뷰 작성/편집/수정/삭제<br />
          뱃지 부여
        </td>
        <td>
          리뷰 <br />
          장소 상세보기 <br />
          마이페이지 뱃지
        </td>
      </tr>
      <tr>
        <td align="center">
          <div>
            <img width="150" src="https://github.com/user-attachments/assets/8c1d3270-919a-4f23-992a-494b57eb1345" alt="최영진" /><br/>
            <a href="https://github.com/JinProjects" target="_blank">최영진 | 팀원</a>
          </div>
        </td>
        <td>
          로그인 / 회원가입 / 비밀번호 찾기<br />
          채팅
        </td>
        <td>
          마이페이지 정보 수정<br />
          로그인 / 회원가입 / 비밀번호 찾기
        </td>
      </tr>
      <tr>
        <td align="center">
          <div>
            <img width="150" src="https://github.com/user-attachments/assets/f2d3ffa7-4182-4095-a07f-e6d6a2c6e7a4" alt="이예림" /><br/>
            <a href="https://github.com/dpflaalee" target="_blank">이예림 | 팀원</a>
          </div>
        </td>
        <td>
          체크리스트 생성/수정/삭제 <br />
          반려동물 여권 생성/수정/삭제 <br />
          반려동물 여권 도장 
        </td>
        <td>
          체크리스트 <br />
          반려동물 여권 / 도장 <br />
          마이페이지 
        </td>
      </tr>
      <tr>
        <td align="center">
          <div>
            <img width="150" src="https://github.com/user-attachments/assets/62d9a879-0324-41e4-9438-000be664a714" alt="이재명" /><br/>
            <a href="https://github.com/Lee-jaemyeong/Portfolio" target="_blank">이재명 | 팀원</a>
          </div>
        </td>
        <td>
          예약<br />
          결제<br />
          일괄 예약 / 결제 
        </td>
        <td>
          장소 상세보기 <br />
          내 예약 내역 <br />
          결제 내역 <br />
        </td>
      </tr>
      <tr>
        <td align="center">
          <div>
            <img width="150" src="https://github.com/user-attachments/assets/727976bd-3131-488f-8855-9c514c84cce7" alt="이정우" /><br/>
            <a href="https://github.com/jeongwoo76" target="_blank">이정우 | 팀원</a>
          </div>
        </td>
        <td>
          NFT 쿠폰 생성/삭제/수정/발급<br />
          NFT 쿠폰 사용/선물/상세/삭제
        </td>
        <td>
          관리자페이지 쿠폰 관리<br />
          관리자페이지 리뷰관리 NFT 발급 모달<br />
          마이페이지 내 쿠폰함
        </td>
      </tr>
    </tbody>
  </table>
</div>




</div>

<br />
<br />

# 🎬 주요기능 영상으로 확인하기
👉 사진을 클릭하면 유튜브로 이동됩니다.

### 1. 경로 추천, 편집, 저장

[![TripPaw 시연 영상](https://github.com/user-attachments/assets/f8d54d29-b318-43eb-afac-5ee99dc58c05)](https://youtu.be/LXcgUj_6oBI?feature=shared)

### 2. 일괄예약/결제

[![TripPaw 시연 영상](https://github.com/user-attachments/assets/eb22f50a-270a-4447-b2ac-b17968c76169)](https://youtu.be/e_rdrCIfam0)

### 3. 체크리스트-여권
[![TripPaw 시연 영상](https://github.com/user-attachments/assets/0c79e16c-7a89-480a-93ca-9abcbb8add4a)](https://youtu.be/1OsTD4pHRkc)

### 4. AI 리뷰 생성
(영상 준비중입니다.)

### 5. NFT

[![NFT 시연 영상](https://github.com/user-attachments/assets/3f173be9-4ed1-431f-948b-c23a41413926)](https://youtu.be/i2rlSeZK0rM)


### 6. 유저/채팅

[![유저/채팅 시연 영상](https://github.com/user-attachments/assets/bb52b5b1-24e7-4116-a238-3dec79bbbb80)](https://youtu.be/Yb4b0vNmzp0?si=x9ghAVkzx0Km6oR8)


<br />
<br />

[🔼 위로 가기 🔼](#-PROJECT-INTRO)
