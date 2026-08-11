import { StyleSheet } from 'react-native';

export const signupTypeSelectStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // 1. 상단 좌측 로고 영역
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  logoWrapper: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 2. 중앙 컨텐츠 전체 (위쪽 정렬로 변경해서 전체를 위로 올림!)
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // ⭐ center에서 flex-start로 변경 ⭐
    paddingTop: 10,               // ⭐ 로고 밑에서의 위치 (원하는 만큼 숫자로 조절 가능) ⭐
    paddingHorizontal: 24,
  },
  // 강아지 캐릭터 영역
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -70,
  },
  // 메인 타이틀 문구
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111111',
    textAlign: 'center',
    marginTop: -100,   // 강아지 발 바로 밑에 붙이기
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 32,
  },
  // 3. 하단 역할 선택 버튼 영역
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    paddingHorizontal: 8,
  },
  typeButton: {
    flex: 1,
    height: 58,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF7F00',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111111',
  },
});