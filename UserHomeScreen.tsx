// ParentHomeScreen.tsx
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView
} from 'react-native';
import MedicationPill from './MedicationPill'; // tsx 컴포넌트 불러오기

export default function ParentHomeScreen() {
  // 4월 날짜 배열 생성 (TypeScript에서 number 타입 배열로 명시)
  const days: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      {/* --- GNB 헤더 영역 --- */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>Caring</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <Text style={styles.iconPlaceholder}>🔔</Text>
          <Text style={styles.iconPlaceholder}>☰</Text>
        </View>
      </View>

      {/* --- 메인 스크롤 콘텐츠 (조회 전용) --- */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. 하루 요약 레포트 카드 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🐱 하루 요약 레포트</Text>
          </View>
          <Text style={styles.reportSubText}>하루 요약 레포트를 매일 21 : 00 시에 받아요</Text>
          
          <Text style={styles.sectionSubTitle}>오늘의 건강 상태</Text>
          <View style={styles.emojiContainer}>
            <View style={[styles.emojiCircle, styles.emojiSelected]}>
              <Text style={styles.emojiText}>😀</Text>
            </View>
            <View style={styles.emojiCircle}>
              <Text style={styles.emojiText}>😐</Text>
            </View>
            <View style={styles.emojiCircle}>
              <Text style={styles.emojiText}>😥</Text>
            </View>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>오늘 하루 요약</Text>
            <Text style={styles.summaryContent}>어머니의 오늘 건강 상태는 '좋음' 이예요!</Text>
            <Text style={styles.summaryContent}>어머니는 오늘 자녀에게 전화를 거셨어요</Text>
          </View>
        </View>

        {/* 2. 일정 관리 카드 */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpace}>
            <Text style={styles.cardTitle}>📅 일정 관리</Text>
            <View style={styles.miniTag}><Text style={styles.miniTagText}>일정 등록</Text></View>
          </View>
          
          <View style={styles.calendarContainer}>
            <Text style={styles.calendarMonth}>2026년 4월  ＜  ＞</Text>
            <View style={styles.weekLabels}>
              {['일', '월', '화', '수', '목', '금', '토'].map((w, i) => (
                <Text key={i} style={styles.weekText}>{w}</Text>
              ))}
            </View>
            <View style={styles.daysGrid}>
              {/* 디자인 레이아웃 정렬을 위한 공백 칸 */}
              <View style={{ width: '14.28%', height: 30 }} />
              <View style={{ width: '14.28%', height: 30 }} />
              <View style={{ width: '14.28%', height: 30 }} />
              {days.map((day) => (
                <View key={day} style={styles.dayCell}>
                  <Text style={styles.dayText}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 3. 복약 관리 카드 */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpace}>
            <Text style={styles.cardTitle}>💊 복약 관리</Text>
            <View style={styles.miniTag}><Text style={styles.miniTagText}>복약 추가</Text></View>
          </View>
          
          <View style={styles.pillsRow}>
            {/* 데이터 타입을 맞춰 true/false 바인딩 */}
            <MedicationPill timeLabel="아침" isCompleted={true} />
            <MedicationPill timeLabel="점심" isCompleted={true} />
            <MedicationPill timeLabel="저녁" isCompleted={false} />
          </View>
        </View>

        {/* 4. 위치 GPS 카드 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📍 위치 GPS</Text>
          </View>
          <View style={styles.mapMock}>
            <View style={styles.mapOverlay}>
              <Text style={styles.mapMarker}>🔵</Text>
            </View>
            <Text style={styles.mapText}>지도 실시간 위치 표시 영역</Text>
          </View>
        </View>

        {/* 5. 주변 공공 복지 시설 카드 */}
        <View style={styles.card}>
          <View style={styles.cardHeaderSpace}>
            <Text style={styles.cardTitle}>🔖 주변 공공 복지 시설</Text>
            <Text style={styles.moreText}>더보기 ＞</Text>
          </View>
          
          <View style={styles.facilityItem}>
            <Text style={styles.facilityIcon}>🏢</Text>
            <View>
              <Text style={styles.facilityName}>국가지원금 확인하기</Text>
              <Text style={styles.facilityDesc}>돌봄대상자를 위한 지원금 체크</Text>
            </View>
          </View>
          <View style={styles.facilityItem}>
            <Text style={styles.facilityIcon}>🏛️</Text>
            <View>
              <Text style={styles.facilityName}>보건복지부 지원 서비스 확인</Text>
              <Text style={styles.facilityDesc}>보건복지부에서 지원하는 돌봄 서비스</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* --- 하단 탭 바 --- */}
      <View style={styles.bottomTabBar}>
        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={[styles.tabLabel, styles.activeTab]}>홈</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>👥</Text>
          <Text style={styles.tabLabel}>돌봄대상자 관리</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabLabel}>마이페이지</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F2',
  },
  logoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF7A00',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconPlaceholder: {
    fontSize: 22,
    color: '#333',
  },
  scrollContent: {
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardHeaderSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  miniTag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  miniTagText: {
    fontSize: 11,
    color: '#636366',
  },
  reportSubText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  reportNotice: {
    fontSize: 9,
    color: '#8E8E93',
    marginBottom: 16,
  },
  sectionSubTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  emojiCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiSelected: {
    borderWidth: 2,
    borderColor: '#FF7A00',
    backgroundColor: '#FFF8F2',
  },
  emojiText: {
    fontSize: 30,
  },
  summaryBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  summaryContent: {
    fontSize: 12,
    color: '#48484A',
    marginBottom: 2,
  },
  calendarContainer: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 12,
  },
  calendarMonth: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  weekLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekText: {
    fontSize: 11,
    color: '#8E8E93',
    width: '14.28%',
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 13,
    color: '#1C1C1E',
  },
  pillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  mapMock: {
    height: 180,
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
  },
  mapMarker: {
    fontSize: 20,
  },
  mapText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 40,
  },
  moreText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  facilityIcon: {
    fontSize: 24,
  },
  facilityName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  facilityDesc: {
    fontSize: 11,
    color: '#8E8E93',
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  activeTab: {
    color: '#1C1C1E',
    fontWeight: 'bold',
  },
});