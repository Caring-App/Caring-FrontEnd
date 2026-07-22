import { WelfareFacility } from './types';

// TODO: 백엔드 연동 전 mock 데이터. 실제로는 보호자(또는 어르신)의 위치 기반으로
// 주변 시설을 조회해야 함.
export const MOCK_WELFARE_FACILITIES: WelfareFacility[] = [
  {
    id: '1',
    name: '구로 어르신 돌봄 통합 센터',
    benefit: '생활지원사 방문 서비스 및 맞춤형 돌봄 서비스 제공',
    phone: '02-2620-1234',
    address: '서울특별시 구로구 구로동 123-45',
    hours: '09:00 ~ 18:00 (주말 및 공휴일 휴무)',
  },
  {
    id: '2',
    name: '구로구 치매안심센터 (고척분소)',
    benefit: '치매 조기 검진, 치매 예방 교육 실시',
    phone: '02-6952-7056',
    address: '서울특별시 구로구 경인로20가길 5 5층',
    hours: '09:00 ~ 18:00 (주말 및 공휴일 휴무)',
    posterImage: require('@assets/images/welfare/facility-detail-poster.png'),
  },
  {
    id: '3',
    name: '고척2동 주민센터',
    benefit: '기초생활수급 및 어르신 돌봄 서비스 신청 접수',
    phone: '02-2620-4562',
    address: '서울특별시 구로구 고척로22길 10',
    hours: '09:00 ~ 18:00 (주말 및 공휴일 휴무)',
  },
  {
    id: '4',
    name: '고척 도서관',
    benefit: '어르신 대상 디지털 기기 활용 교육',
    phone: '02-2610-8114',
    address: '서울특별시 구로구 고척로 45',
    hours: '09:00 ~ 18:00 (매주 월요일 휴관)',
  },
  {
    id: '5',
    name: '고척 근린공원 내 경로당',
    benefit: '혹서기·혹한기 무더위/한파 쉼터 운영',
    phone: '02-2610-8090',
    address: '서울특별시 구로구 고척로 63',
    hours: '09:00 ~ 18:00 (주말 및 공휴일 휴무)',
  },
];
