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
        },
        border: {
          DEFAULT: '#e2e5e5',
          // 돌봄대상자 관리 모달의 입력창 테두리(Figma 60:5411 form input, #CED4DA)
          input: '#ced4da',
        },
        surface: {
          DEFAULT: '#ffffff',
          // 돌봄대상자 관리 카드의 글자 크기 세그먼트 컨트롤 배경(Figma 41:1997, #EFF1F5)
          subtle: '#eff1f5',
        },
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
        xs: ['11px', { lineHeight: '1.4', letterSpacing: '-0.275px' }],
        sm: ['13px', { lineHeight: '1.4', letterSpacing: '-0.325px' }],
        base: ['14px', { lineHeight: '1.4', letterSpacing: '-0.35px' }],
        md: ['15px', { lineHeight: '1.4', letterSpacing: '-0.375px' }],
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
