/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Figma(UI 설계 > 보호자 메인 등)에서 실사용 중인 값
        text: {
          primary: '#111111',
          strong: '#2a2a2a',
          muted: '#656c6c',
          // 돌봄대상자 관리 카드의 글자 크기 세그먼트 컨트롤 비선택 텍스트(Figma 41:1997, #A09CAB)
          disabled: '#a09cab',
          // "자세히 보기 >" 링크 텍스트(Figma 60:4134 등, #6E6E6E)
          link: '#6e6e6e',
          // 마이페이지 메뉴 리스트 항목 텍스트(Figma 60:6329 등, #404446)
          heading: '#404446',
          // 마이페이지 모달 폼 라벨/입력값, 연동 코드 텍스트(Figma 60:6551 등, #212529)
          body: '#212529',
          // 필수 표시 텍스트(Figma 72:3318 회원 탈퇴, #E10004)
          danger: '#e10004',
          // 폼 입력창 placeholder(Figma 60:5411 등, #6C757D) — mypage/ward-management FormField 공용
          placeholder: '#6c757d',
          // 1:1 문의하기 채팅 입력창 placeholder(Figma 151:26522, #A1A1A1)
          placeholderMuted: '#a1a1a1',
          // 일정 등록 모달 인라인 캘린더의 이전/다음 달 날짜(Figma 55:3009 date-picker-dropdown, #ADB5BD)
          calendarMuted: '#adb5bd',
          // 보호자 홈 미니 캘린더의 요일 라벨(Figma 55:2459, #BDBDBD)
          calendarWeekday: '#bdbdbd',
          // 보호자 홈 미니 캘린더의 날짜 숫자(Figma 55:2459, #020202)
          calendarDay: '#020202',
          // 보호자 홈 미니 캘린더의 일정 표시 점(아이폰 캘린더 스타일 회색, #8E8E93)
          calendarScheduleDot: '#8e8e93',
          // 복약 등록 모달의 매일/주간/주말 프리셋 칩 텍스트(Figma 390:16079, #F3F3F3)
          onChip: '#f3f3f3',
          // 로그인 화면 "돌봄의 시작, 케어링" 서브타이틀(Figma 151:17301, #484848)
          loginSubtitle: '#484848',
          // 로그인 화면 입력창 placeholder(Figma 151:17305, #AEB5B5) — 같은 화면의 input border와 동일 값
          loginPlaceholder: '#aeb5b5',
          // 약관 동의 화면 안내 문구/섹션 라벨(Figma 151:17580 등, #4A5565)
          termsLabel: '#4a5565',
          // 약관 동의 화면 "(필수)" 배지 텍스트(Figma 151:17585, #155DFC)
          termsRequired: '#155dfc',
          // 회원가입 리뉴얼(Figma 970:13198) 단계별 화면 제목/입력 라벨/시작 화면 버튼 텍스트(#1A1614, 시작 화면 #1A1A1A는 사실상 같은 값이라 통합)
          authTitle: '#1a1614',
          // 회원가입 단계 화면 제목 아래 설명 문구(Figma 966:5724 등, #9E9E9E) — 인증 타이머 숫자도 같은 값
          authDesc: '#9e9e9e',
          // 회원가입 회색 입력창 placeholder(Figma 967:6594 등, #BDBDBD)
          authPlaceholder: '#bdbdbd',
          // 약관 동의 항목 텍스트 / "인증번호 재요청" 링크(Figma 966:5736, 970:7278, #616161)
          termItem: '#616161',
          // 기저질환 선택 카드 텍스트(Figma 970:7806, #424242)
          diseaseItem: '#424242',
          // 기저질환 "기저 질환 선택" 섹션 라벨(Figma 970:7800, #282523)
          sectionLabel: '#282523',
          // 새 로고 워드마크 "Caring"(Figma Logo 960:8, #2B2622)
          logo: '#2b2622',
          // 전화번호 로그인 화면 입력 라벨(Figma 965:74, #828A8F)
          loginLabel: '#828a8f',
          // 전화번호 로그인 화면 "계정 찾기 | 비밀번호 재설정" 링크(Figma 965:90, #4F5558)
          loginLink: '#4f5558',
        },
        border: {
          DEFAULT: '#e2e5e5',
          // 로그인 화면 입력창 테두리(Figma 151:17304, #AEB5B5)
          loginInput: '#aeb5b5',
          // 로그인 화면 Google 버튼 테두리(Figma 182:10988, #E0E0E9)
          googleButton: '#e0e0e9',
          // 약관 동의 화면 체크박스 미선택 테두리(Figma 441:16714, #D1D5DC)
          checkbox: '#d1d5dc',
          // 돌봄대상자 관리 모달의 입력창 테두리(Figma 60:5411 form input, #CED4DA)
          input: '#ced4da',
          // "자세히 보기 >" 링크 밑줄(Figma 60:4133 등, #C9CED1). 복약 등록 모달의 미선택 요일 원/라디오 링/식사시간 버튼 테두리도 동일 값이라 공용으로 재사용(Figma 435:16903, 390:16039, 390:16113)
          link: '#c9ced1',
          // 마이페이지 섹션 구분선(Figma 60:6411 등, #DEE2E6)
          divider: '#dee2e6',
          // 보호자 홈 미니 캘린더 카드 테두리(Figma 55:2459 iOS date-picker, #717171)
          calendarCard: '#717171',
          // 복약 수정 모달의 "복약 정보 삭제하기" 링크 밑줄(Figma 391:12078, #E40004). text.danger와 사실상 동일 색이라 그 값 재사용
          danger: '#e10004',
          // 회원가입 리뉴얼 카드형 버튼(전체 동의, 기저질환 카드) 테두리(Figma 966:5777 등, #E0E0E0)
          authCard: '#e0e0e0',
          // 기저질환 카드 체크박스 미선택 테두리(Figma 970:7804, #BDBDBD)
          authCheckbox: '#bdbdbd',
          // 전화번호 로그인 화면 입력창 테두리(Figma 965:42, #E8E9EB)
          loginField: '#e8e9eb',
        },
        surface: {
          DEFAULT: '#ffffff',
          // 돌봄대상자 관리 카드의 글자 크기 세그먼트 컨트롤 배경(Figma 41:1997, #EFF1F5)
          subtle: '#eff1f5',
          // 1:1 문의하기 채팅 말풍선 배경(Figma 151:26522, #EEEEEE)
          chat: '#eeeeee',
          // 약관 동의 화면 "전체 동의" 행 배경(Figma 151:17581, #F9FAFB)
          termsRow: '#f9fafb',
          // 회원가입 리뉴얼 회색 입력창 배경(Figma 967:6586 등, #F5F5F5)
          authInput: '#f5f5f5',
          // 선택된 카드 배경(Figma 970:7163 본인인증 약관 선택 상태, #FFF5EE) — 기저질환 카드 선택 상태에 사용
          authSelected: '#fff5ee',
        },
        // 회원가입 리뉴얼 비활성 버튼(Figma 966:5613 "동의하고 계속 진행" 비활성, #E0E0E0 배경 + #9E9E9E 텍스트)
        authButtonDisabled: '#e0e0e0',
        // 전화번호 로그인 화면 비활성 "로그인" 버튼(Figma 965:80, #D2D5D6)
        loginButtonDisabled: '#d2d5d6',
        // 마이페이지 프로필 아바타 배경(Figma 60:6329 User 03C, #FFC9B3~#FFD2C2 그라디언트를 단색으로 근사)
        avatar: '#ffd2c2',
        // 마이페이지 알림 설정 토글의 미선택 트랙 색상(Figma 62:7438, #D9D9D9) — Switch는 className 미지원이라 별도 토큰
        switchTrackOff: '#d9d9d9',
        // 로그아웃 확인 모달의 "취소" 버튼 배경(Figma 149:9580, #D9D9D9)
        buttonMuted: '#d9d9d9',
        // 브랜드 포인트 컬러 (로그인 화면, 보호자 홈, 보호자 메뉴 탭 등에서 실사용 확인된 값, Figma 40:1868 등 #FD7E14)
        primary: {
          DEFAULT: '#FD7E14',
          50: '#FFF3E5',
          100: '#FFE0B8',
          500: '#FD7E14',
          600: '#E67200',
          700: '#B85A00',
        },
        // 복약 등록 모달의 매일/주간/주말 프리셋 칩(Figma 390:16079, 비선택 배경 #7c7c7c)
        chip: {
          inactive: '#7c7c7c',
        },
        // 일정 등록 모달의 시/분/초 휠 피커(Figma 55:3009, iOS 스타일 wheel picker)
        wheel: {
          // 가운데 선택된 행 텍스트(#454545)
          active: '#454545',
          // 위아래로 흐릿하게 보이는 비선택 행 텍스트(rgba(60,60,60,0.5))
          muted: 'rgba(60,60,60,0.5)',
          // 선택된 행 위아래 구분선(#8B8B8B)
          divider: '#8b8b8b',
        },
      },
      fontFamily: {
        // Pretendard 실사용 확인(38:1281 등). RN은 웨이트별로 별도 PostScript 이름을 써야 함.
        pretendard: ['Pretendard-Regular'],
        'pretendard-light': ['Pretendard-Light'],
        'pretendard-medium': ['Pretendard-Medium'],
        'pretendard-semibold': ['Pretendard-SemiBold'],
        'pretendard-bold': ['Pretendard-Bold'],
      },
      fontSize: {
        // Figma에서 실사용 중인 텍스트 스케일
        '2xs': ['12px', { lineHeight: '1.4', letterSpacing: '-0.3px' }],
        xs: ['11px', { lineHeight: '1.4', letterSpacing: '-0.275px' }],
        sm: ['13px', { lineHeight: '1.4', letterSpacing: '-0.325px' }],
        base: ['14px', { lineHeight: '1.4', letterSpacing: '-0.35px' }],
        md: ['15px', { lineHeight: '1.4', letterSpacing: '-0.375px' }],
        lg: ['16px', { lineHeight: '1.4', letterSpacing: '-0.4px' }],
        '2xl': ['18px', { lineHeight: '1.4' }],
        xl: ['20px', { lineHeight: '1.4', letterSpacing: '-0.5px' }],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        // TODO: 그림자 스타일도 Figma 확정 값 없어 임시값. 카드/모달용.
        card: '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        modal: '0 8px 16px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
