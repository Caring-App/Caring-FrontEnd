import { useNavigation } from '@react-navigation/native';

export function useSeniorHome() {
  const navigation = useNavigation();

  const handleLogout = () => {
    // TODO: 로그아웃 로직 연결
    console.log('로그아웃 시도');
  };

  return {
    navigation,
    handleLogout,
  };
}