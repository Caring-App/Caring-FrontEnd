import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, FeGaussianBlur, Filter, Mask, Rect } from 'react-native-svg';
import { TourStep, TOUR_STEPS } from '../model/tourSteps';
import { TourTargetLayout, useTourStore } from '../model/useTourStore';
import { colors } from '@shared/theme/colors';
import CloseIcon from '@assets/icons/action/close-x.svg';

const SPOTLIGHT_RADIUS = 12;

interface TourOverlayContentProps {
  step: TourStep;
  currentStepIndex: number;
  // 하이라이트 박스까지 화면에 그릴 준비가 됐는지(측정 성공 + 유효한 위치)
  showSpotlight: boolean;
  // 위치 측정 시도 자체가 끝났는지(성공/실패 무관) — "다음" 버튼은 이 값으로만 막음.
  // showSpotlight로 막으면 측정이 끝내 실패했을 때 하이라이트도 안 뜨고 버튼도 영원히 안 풀리는
  // 상황이 생길 수 있어서, 최소한 측정 시도가 끝났으면 다음으로 넘어갈 수 있게 함
  ready: boolean;
  box: TourTargetLayout | undefined;
}

// 딤 처리 + 하이라이트 + 하단 안내 카드로 구성된 사용가이드 오버레이 UI.
// 화면(TourOverlay)에서는 자기 자신의 Modal 안에, 등록 모달(일정/복약 등록)에서는 그 모달의
// Modal 안에 그대로 얹어서 쓸 수 있도록 Modal 없이 순수 UI만 담당함
export function TourOverlayContent({ step, currentStepIndex, showSpotlight, ready, box }: TourOverlayContentProps) {
  const handleNext = () => useTourStore.getState().next(TOUR_STEPS.length);
  const handleClose = () => useTourStore.getState().close();

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const rawBox = box ?? { x: 0, y: 0, width: 0, height: 0 };
  const padding = step.spotlightPadding ?? 0;
  const spotlightBox = {
    x: rawBox.x - padding,
    y: rawBox.y - padding,
    width: rawBox.width + padding * 2,
    height: rawBox.height + padding * 2,
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width={screenWidth} height={screenHeight} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <Mask id="spotlightMask">
            <Rect x={0} y={0} width={screenWidth} height={screenHeight} fill="#fff" />
            {showSpotlight && (
              <Rect
                x={spotlightBox.x}
                y={spotlightBox.y}
                width={spotlightBox.width}
                height={spotlightBox.height}
                rx={SPOTLIGHT_RADIUS}
                fill="#000"
              />
            )}
          </Mask>
          <Filter id="spotlightGlow" x="-60%" y="-60%" width="220%" height="220%">
            <FeGaussianBlur stdDeviation={8} />
          </Filter>
        </Defs>

        {/* 딤 처리 + 둥근 모서리 스포트라이트 구멍 (마스크 사용, 사각형 4분할 방식과 달리 모서리가 자연스럽게 이어짐) */}
        <Rect x={0} y={0} width={screenWidth} height={screenHeight} fill="rgba(0,0,0,0.6)" mask="url(#spotlightMask)" />

        {showSpotlight && (
          <>
            {/* 은은하게 번지는 글로우 */}
            <Rect
              x={spotlightBox.x}
              y={spotlightBox.y}
              width={spotlightBox.width}
              height={spotlightBox.height}
              rx={SPOTLIGHT_RADIUS}
              fill="none"
              stroke={colors.primary}
              strokeWidth={6}
              strokeOpacity={0.55}
              filter="url(#spotlightGlow)"
            />
          </>
        )}
      </Svg>

      {/* 하단 안내 카드 */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardTitleRow}>
            {step.icon && <step.icon width={18} height={14} />}
            <Text style={styles.cardTitle}>{step.title}</Text>
          </View>
          <TouchableOpacity onPress={handleClose} hitSlop={12}>
            <CloseIcon width={16} height={16} />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardDescription}>{step.description}</Text>

        {/* 하이라이트 위치 측정이 끝나기 전에 연타하면 다음 스텝이 이전 스텝의 스크롤/측정 상태와
            겹쳐서 하이라이트가 어긋나 보일 수 있어, 측정 시도가 끝나기 전엔 버튼을 눌러도 무시함
            (showSpotlight가 아니라 ready로 막는 이유는 위 props 설명 참고) */}
        <TouchableOpacity
          style={[styles.nextButton, !ready && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!ready}
          activeOpacity={0.8}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>

        <View style={styles.dotsRow}>
          {TOUR_STEPS.map((tourStep, index) => (
            <View
              key={tourStep.targetId}
              style={[styles.dot, index === currentStepIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 16,
  },
  cardTitle: {
    flex: 1,
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  cardDescription: {
    marginTop: 8,
    // 스텝마다 설명 글자 수가 달라 카드 높이가 들쭉날쭉해지는 걸 막기 위해 2줄 기준으로 높이를 고정함
    // (짧은 설명은 아래쪽에 여백이 남고, 긴 설명은 이 높이에 맞춰 두 줄로 표시됨)
    minHeight: 38,
    fontFamily: 'Pretendard-Medium',
    fontSize: 13,
    lineHeight: 19,
    color: colors.textPlaceholder,
  },
  nextButton: {
    marginTop: 24,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: colors.surface,
  },
  dotsRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 16,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: colors.border,
  },
});
