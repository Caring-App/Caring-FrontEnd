import EnvelopeFillIcon from '@assets/icons/report/envelope-fill.svg';

export interface TourStep {
  // GuardianHomeScreen 트리 내 <TourTarget id="..."> 와 매칭되는 키
  targetId: string;
  title: string;
  description: string;
  icon?: typeof EnvelopeFillIcon;
  // 이 스텝을 보여줘야 하는 화면. 없으면 보호자 홈(Home 탭)을 의미함
  screen?: 'Medication' | 'WardManagement';
  // 이 스텝의 대상이 이미 열려있는 등록 모달(일정/복약 등록) 내부에 있는 경우.
  // 이 값이 있으면 화면 단위 TourOverlay는 자신의 Modal을 그리지 않고, 해당 등록 모달이
  // 스스로 자기 Modal 안에 하이라이트 오버레이를 그림(모달을 이중으로 띄우면 쌓이는 순서가 꼬이기 때문)
  hostModal?: 'scheduleRegisterModal' | 'medicationRegisterModal';
  // 대상으로 스크롤해야 하는 컨테이너의 id (useTourStore.scrollRefs 키). 없으면 스크롤 없이 바로 측정함 —
  // 등록 모달 전체를 하이라이트하는 스텝처럼 화면 중앙에 고정되어 스크롤이 필요 없는 경우에 씀
  scrollId?: string;
  // 하이라이트 박스를 측정된 대상 크기보다 상하좌우로 이만큼(px) 더 크게 그림. 없으면 0
  spotlightPadding?: number;
}

// 뒤 단계는 추가로 전달받는 대로 이 배열에 이어서 채워 넣을 것
export const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'dailyReport.card',
    title: '하루 요약 레포트',
    description: '돌봄 대상자의 하루를 요약해서 한 눈에 보여드려요!\n전송 시간은 기본 21시지만 변경도 가능해요!',
    icon: EnvelopeFillIcon,
    scrollId: 'home',
  },
  {
    targetId: 'dailyReport.healthStatus',
    title: '하루 요약 레포트 - 오늘의 건강 상태',
    description: '돌봄 대상자가 그 날의 건강 상태 버튼을 클릭하면\n실시간으로 연동되며, 화면에서 볼 수 있어요!',
    scrollId: 'home',
  },
  {
    targetId: 'dailyReport.summary',
    title: '하루 요약 레포트 - 오늘 하루 요약',
    description: '돌봄 대상자의 건강 상태와 복용 현황을 요약 해드려요!\n돌봄 대상자의 걸음 수, 혈당 수치, 혈압 수치도 보여드려요',
    scrollId: 'home',
  },
  {
    targetId: 'dailyReport.chart',
    title: '하루 요약 레포트 - 건강 수치 그래프',
    description: '돌봄 대상자의 건강 데이터들을\n한눈에 볼 수 있는 그래프로 제공해드려요!',
    scrollId: 'home',
  },
  {
    targetId: 'schedule.section',
    title: '일정 관리',
    description: '돌봄 대상자의 일정을 등록하고\n달력을 이용해 한 눈에 볼 수 있어요!',
    scrollId: 'home',
  },
  {
    targetId: 'schedule.registerModal',
    title: '일정 관리 - 일정 등록',
    description: '일정 등록 시, 일정 이름, 장소, 날짜를 선택할 수 있어요!',
    hostModal: 'scheduleRegisterModal',
  },
  {
    targetId: 'schedule.registerModal.timeSection',
    title: '일정 관리 - 일정 등록',
    description: '일정의 시간과 별개로\n일정을 음성으로 안내해줄 알림 시간도 따로 설정 가능해요!',
    hostModal: 'scheduleRegisterModal',
    scrollId: 'scheduleRegisterModal',
    spotlightPadding: 10,
  },
  {
    targetId: 'medication.section',
    title: '복약 관리',
    description: '돌봄 대상자의 복약 여부를 실시간으로 확인할 수 있어요!',
    scrollId: 'home',
  },
  {
    targetId: 'medication.registerModal',
    title: '복약 관리 - 복약 등록',
    description: '규칙적으로 약을 복용해야 하는 시간을 설정하고,\n제시간에 미복용 시 재알림 기간을 설정할 수 있어요!',
    screen: 'Medication',
    hostModal: 'medicationRegisterModal',
  },
  {
    targetId: 'location.section',
    title: '위치 GPS',
    description: '돌봄 대상자의 위치를 앱 내에서 실시간으로 확인이 가능해요!\n장소를 등록했다면 위치를 통해 방문 여부도 확인할 수 있어요!',
    scrollId: 'home',
  },
  {
    targetId: 'welfare.section',
    title: '주변 공공 복지 시설',
    description: '돌봄 대상자의 집 주소를 기반으로\n근처 공공 복지 시설과 혜택을 추천해드려요!',
    scrollId: 'home',
  },
  {
    targetId: 'wardManagement.section',
    title: '돌봄 대상자 관리',
    description: '보호자의 연동 코드로 여러명의 돌봄 대상자와 연동이 가능해요!\n돌봄 대상자 별 정보 확인이 가능하고,\n음성 알림 속도나 글자 크기 설정도 할 수 있어요!',
    screen: 'WardManagement',
    scrollId: 'wardManagement',
  },
];

// "복약 등록" 스텝 인덱스 — GuardianHomeScreen(복약 화면으로 자동 이동)과 MedicationScreen(스텝을
// 지나면 자동으로 뒤로 나가기) 양쪽에서 같은 값을 참조해야 하므로 여기서 한 번만 계산해 공유함
export const MEDICATION_MODAL_STEP_INDEX = TOUR_STEPS.findIndex(step => step.screen === 'Medication');
