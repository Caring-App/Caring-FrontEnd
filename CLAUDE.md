# 케어링(Caring) 프론트엔드

시니어 케어 앱. 보호자(PROTECTOR)와 돌봄대상자/어르신(WARD) 두 역할이 하나의 앱을 함께 쓰며, 로그인 시 역할에 따라 완전히 다른 화면 흐름으로 분기된다.

핵심 가치: 보호자가 어르신의 건강/복약/위치를 원격으로 확인·관리하고, 어르신은 최대한 단순한 UI로 건강/복약 체크와 일정 음성 안내를 받는다.

작업 현황(완료/TODO 체크리스트)은 Notion에 정리되어 있음 — 새 기능 작업 전에 먼저 확인할 것. (링크는 사용자에게 물어볼 것, 이 파일엔 넣지 않음 — 계속 갱신되는 문서라 여기 박아두면 금방 stale해짐)

## 기술 스택
- React Native 0.85 (New Architecture), TypeScript
- 상태관리: Zustand
- 스타일: nativewind(Tailwind) — **디자인 토큰은 반드시 `tailwind.config.js` 기준**, 색상 하드코딩 금지
- 네비게이션: React Navigation (Native Stack + Bottom Tabs)
- 폰트: Pretendard (Regular/Medium/SemiBold/Bold, 웨이트별 별도 파일 필요 — RN은 CSS font-weight로 안 바뀜)
- 아이콘: SVG를 `react-native-svg` + `react-native-svg-transformer`로 컴포넌트처럼 import (`import X from '@assets/icons/.../x.svg'`)
- 지도: 네이버 지도(`@mj-studio/react-native-naver-map`) — 카카오/구글 대비 국내 데이터 품질과 관리 상태 보고 선택함
- 인증: 카카오/네이버/구글 소셜 로그인 + axios, 토큰은 `react-native-encrypted-storage`
- 환경변수: `react-native-config` (`.env` → `Config.XXX`) — **`.env`는 절대 읽거나 수정하지 말 것, 실제 키 들어있음**

## 폴더 구조 (FSD 축약형)
```
src/
  app/        # 라우팅(RootNavigator, GuardianStackNavigator, GuardianTabNavigator), Provider, 앱 진입점
  screens/    # 화면 단위. guardian/, senior/, auth/ 로 역할별 분리
  features/   # 도메인별 로직: auth, health, medication, schedule, location, notification,
              # account-link, ward-management, welfare-facility 등
              # 각 도메인 폴더 안에 ui/, model/, api/, utils/ 배치 — 새 도메인 추가 시 이 4개 그대로 따라갈 것
              # (model/에는 zustand store뿐 아니라 타입, mock 데이터, 커스텀 훅도 같이 둠 — 정상. 폴더명을
              # components/hook/type 등으로 임의로 바꾸지 말 것, 팀 전체 컨벤션이 ui/model/api/utils로 이미 통일됨)
  shared/     # 공용 컴포넌트(ui/), api 클라이언트, 전역 store, 유틸, 타입
```
경로 alias: `@app`, `@screens`, `@features`, `@shared`, `@assets` (tsconfig + babel-plugin-module-resolver 둘 다 설정되어 있어야 함)

## 상태 관리 컨벤션
- 여러 화면(특히 보호자 화면 ↔ 어르신 화면)이 공유해야 하는 상태는 `features/{domain}/model/`에 zustand store로 분리
  - `useSessionStore` (`@shared/store`) — 로그인 여부, role(`PROTECTOR`/`WARD`), 연동 코드
  - `useHealthStatusStore`, `useMedicationStore` (`@features/health`, `@features/medication`) — 어르신이 누른 상태를 보호자 화면에 반영하는 용도. **지금은 로컬 상태뿐**이라 기기 간 실시간 동기화는 안 됨 — 서버/소켓 연동 필요(TODO)
- 아직 존재하지 않는 화면(어르신 홈, 마이페이지 등)에서 같은 개념의 상태가 필요하면 새 store를 만들지 말고 기존 store 확장부터 검토
- 화면 구현 시 컴포넌트/훅/타입/mock 데이터는 파일로 분리해서 `features/{domain}/{ui,model}/`에 넣을 것 (`ward-management`, `welfare-facility`, `notification`이 이 패턴의 예시). `GuardianHomeScreen.tsx`는 아직 리팩터 전이라 섹션 컴포넌트들이 한 파일에 다 들어있는 예전 방식임 — 새로 참고할 때는 저 파일이 아니라 `ward-management`/`welfare-facility` 쪽 구조를 따라갈 것

## 화면/네비게이션 헤더 컨벤션
- 하단 탭 화면(홈, 돌봄대상자 관리, 마이페이지)만 공용 `AppHeader`(`@shared/ui`, 로고+종+메뉴)를 화면 본문에 렌더링함
- Stack으로 push되는 상세성 화면(위치 GPS, 알림, 복지시설 리스트/상세, 복약·일정 관리 등)은 `AppHeader`를 쓰지 않고 뒤로가기 아이콘(`chevron-right.svg` 180도 회전) + 제목만 있는 자체 헤더를 씀
  - 이유: React Navigation의 native-stack은 push 애니메이션 때 화면 전체(그 안에 렌더링된 헤더 포함)를 하나의 유닛으로 슬라이드시킴. `AppHeader`를 push되는 화면 본문 안에 넣으면 전환할 때마다 이미 보이던 것과 똑같은 헤더가 다시 슬라이드되며 나타나는 것처럼 보여 어색함(실제로 겪고 되돌린 이력 있음, `WelfareFacilities` 화면 참고)
  - `headerShown:true` + `Stack.Screen`의 `header` 옵션으로 넣어도 Android에서는 여전히 화면 단위로 같이 슬라이드됨 — 근본적으로 고치려면 `AppHeader`를 Stack.Navigator 바깥으로 완전히 빼는 구조 변경이 필요한데, 그러면 Map/알림 등 다른 push 화면까지 다 영향받는 큰 작업이라 보류함. 진짜 고정 헤더가 필요해지면 이 트레이드오프를 사용자에게 먼저 설명하고 진행할 것

## Figma 연동
- Figma 데스크톱 앱의 MCP 툴(`mcp__figma-desktop__*`)로 실제 화면의 색상/폰트/치수를 뽑아 쓸 것 — 임의로 색 추측하지 말 것
- `get_metadata`는 큰 프레임에서 결과가 너무 커서 에러날 수 있음 → 관심 있는 하위 노드 id로 좁혀서 호출
- `get_design_context`로 나온 코드는 참고용(웹/Tailwind 문법)이고, 그대로 쓰지 말고 프로젝트 컨벤션(nativewind className, 우리 토큰)으로 변환할 것
- 아이콘/이모지 에셋은 `get_design_context` 응답에 나오는 `http://localhost:3845/assets/....svg`(또는 `.png`)를 curl로 그대로 받아서 `assets/icons/`(아이콘) 또는 `assets/images/`(배너·포스터 등 실사 이미지) 아래에 저장 가능 (Figma 데스크톱이 로컬로 서빙해줌). 단, SVG에 `var(--fill-0, #hex)` / `var(--stroke-0, #hex)` 형태의 CSS 변수가 들어있으면 react-native-svg가 못 읽으므로 `#hex`로 치환해야 함
- PNG/JPG를 `import X from '@assets/images/....png'`로 쓰려면 타입 선언이 필요 — 루트 `images.d.ts`에 이미 등록해둠(`svg.d.ts`와 별개 파일). `react-native-svg-transformer`는 svg만 커버하므로 이 둘을 혼동하지 말 것

## 네이티브 빌드 관련 (Windows 환경 특이사항)
- **Windows Defender 실시간 보호 때문에 첫 빌드가 극도로 느려짐(6분+)** — 프로젝트 폴더, `~/.gradle`, `~/.android`를 Defender 예외에 이미 등록해둠. 새 환경이면 관리자 PowerShell에서 `Add-MpPreference -ExclusionPath`로 등록 필요
- `npx react-native run-android`를 Git Bash에서 실행하면 `gradlew.bat`을 못 찾는 경우가 있음 → 안 되면 PowerShell로 시도하거나, `cd android && ./gradlew.bat app:installDebug` 직접 실행
- 새 네이티브 모듈(SVG, 지도, 소셜로그인 SDK 등) 설치 후에는 **반드시 네이티브 재빌드** 필요 (JS만 새로고침해선 안 됨) — `npx react-native start --reset-cache` + `gradlew app:installDebug`
- 기기는 보통 무선 adb로 연결(`adb connect <IP>:5555`). **재부팅/와이파이 재연결하면 `adb reverse tcp:8081 tcp:8081`이 풀림** — 흰 화면/"Unable to load script" 뜨면 이것부터 의심
- 브랜치 전환/대량 파일 이동 직후 Metro가 있는 파일을 없다고 착각하는 캐시 오류가 종종 있음 → `--reset-cache`로 재시작하면 해결됨
- JS만 고친 뒤 `curl localhost:8081/reload`나 Fast Refresh로는 가끔 예전 번들이 그대로 남아있는 것처럼 보일 때가 있었음(실제로 겪음) — 확실히 최신 코드를 보려면 `adb shell am force-stop <package>` 후 `adb shell monkey -p <package> -c android.intent.category.LAUNCHER 1`로 완전히 콜드 스타트하는 게 제일 믿을만함
- `npx react-native start --reset-cache` 실행 시 `EADDRINUSE :::8081`이 뜨면 이미 다른 Metro가 떠 있는 것 — PowerShell에서 `Get-NetTCPConnection -LocalPort 8081 | Select -Expand OwningProcess`로 프로세스 찾아서 정리하거나, 이미 떠 있는 인스턴스를 그냥 재사용(`curl localhost:8081/status`로 살아있는지 확인)
- 실기기 스크린샷을 보고 좌표를 계산해서 `adb shell input tap x y`를 쏠 때: 스크린샷 뷰어가 보여주는 "표시된" 크기와 기기의 실제 해상도가 다름 — 표시된 좌표에 (실제 해상도 너비 ÷ 표시된 너비) 배율(보통 이 기기 기준 약 1.17배)을 곱해서 변환해야 정확한 위치를 누름. 안 하면 엉뚱한 요소(다른 설치된 앱, 시스템 UI 등)를 누르게 될 수 있어 주의 — 실제로 이 실수로 다른 앱이 열린 적 있음

## 로그인 없이 화면 테스트하기
`src/screens/auth/Login/LoginScreen.tsx`에 `__DEV__` 전용 버튼("[DEV] 보호자로 바로 진입" / "[DEV] 어르신으로 바로 진입")이 있음 — `useSessionStore`의 `login()`을 바로 호출해서 소셜 로그인 없이 역할별 화면 확인 가능. 릴리즈 빌드에는 포함 안 됨.

## Git 컨벤션
- 브랜치명: `type/kebab-description` (`feature/`, `fix/`, `chore/`, `refactor/`)
- 커밋 메시지: `type: 설명` (Conventional Commits 스타일, 기존 로그 참고)
- 작업 시작 전 항상 `develop`을 최신으로 받고 그 위에서 새 브랜치 생성
- 작업 단위로 커밋 분리(한 커밋에 여러 관심사 섞지 않기) — 이 저장소는 여러 팀원이 각자 브랜치로 작업 후 develop에 PR 머지하는 방식
- `.env`, `.expo/`는 `.gitignore` 처리되어 있음 — 커밋에 절대 포함되면 안 됨

## 팀 구조 참고
- 백엔드/다른 프론트 팀원들이 별도 브랜치로 로그인/회원가입/연동, 일정 관리(`feature/CalendarSchedule` 등) 작업 중일 수 있음 — 겹치는 화면/컨벤션 작업 전에 develop 최신 상태와 다른 브랜치 존재 여부 확인할 것
- 기존에 팀원이 다른 폴더 컨벤션(루트에 화면 파일, `src/api`, `src/store` 등)으로 짠 코드를 FSD 구조로 재배치한 이력 있음 — 새로 들어오는 팀원 코드도 병합 시 구조를 맞춰야 할 수 있음
