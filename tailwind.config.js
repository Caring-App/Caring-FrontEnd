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
        },
        border: {
          DEFAULT: '#e2e5e5',
          // 돌봄대상자 관리 모달의 입력창 테두리(Figma 60:5411 form input, #CED4DA)
          input: '#ced4da',
          // "자세히 보기 >" 링크 밑줄(Figma 60:4133 등, #C9CED1)
          link: '#c9ced1',
          // 마이페이지 섹션 구분선(Figma 60:6411 등, #DEE2E6)
          divider: '#dee2e6',
        },
        surface: {
          DEFAULT: '#ffffff',
          // 돌봄대상자 관리 카드의 글자 크기 세그먼트 컨트롤 배경(Figma 41:1997, #EFF1F5)
          subtle: '#eff1f5',
          // 1:1 문의하기 채팅 말풍선 배경(Figma 151:26522, #EEEEEE)
          chat: '#eeeeee',
        },
        // 마이페이지 프로필 아바타 배경(Figma 60:6329 User 03C, #FFC9B3~#FFD2C2 그라디언트를 단색으로 근사)
        avatar: '#ffd2c2',
        // 브랜드 포인트 컬러 (로그인 화면, 보호자 홈 등에서 실사용 확인된 값)
        primary: {
          DEFAULT: '#FF7F00',
          50: '#FFF3E5',
          100: '#FFE0B8',
          500: '#FF7F00',
          600: '#E67200',
          700: '#B85A00',
        },
      },
      fontFamily: {
        // Pretendard 실사용 확인(38:1281 등). RN은 웨이트별로 별도 PostScript 이름을 써야 함.
        pretendard: ['Pretendard-Regular'],
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
