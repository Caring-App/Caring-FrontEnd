import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

// features/auth 폴더 구조에 맞춘 정확한 경로
import { LoginStyles as styles } from '../styles/LoginStyles';
import { useLogin } from '../hooks/useLogin';
import { SocialButton } from './SocialButton';
import { useSessionStore } from '../../../shared/store/useSessionStore';

export default function LoginScreen() {
  const { id, setId, password, setPassword, handleLogin, handleSocialLogin } = useLogin();

  return (
    <View style={styles.container}>
      {/* 개발용 버튼 */}
      {__DEV__ && (
        <View style={styles.devRow}>
          <TouchableOpacity 
            style={styles.devButton} 
            onPress={() => useSessionStore.getState().login('PROTECTOR')}
          >
            <Text style={styles.devButtonText}>[DEV] 보호자로 바로 진입</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.mainTitle}>Caring</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="아이디를 입력하세요." 
        value={id} 
        onChangeText={setId} 
        placeholderTextColor="#999"
      />
      <TextInput 
        style={styles.input} 
        placeholder="비밀번호를 입력하세요." 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.socialButtonsRow}>
        <SocialButton color="#FEE500" onPress={() => handleSocialLogin('Kakao')} />
        <SocialButton color="#EAEAEA" onPress={() => handleSocialLogin('Google')} />
        <SocialButton color="#03C75A" onPress={() => handleSocialLogin('Naver')} />
      </View>
    </View>
  );
}