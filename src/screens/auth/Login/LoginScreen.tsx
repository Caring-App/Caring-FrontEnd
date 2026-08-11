import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSessionStore } from '@shared/store/useSessionStore';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('로그인 시도:', id, password);
  };

  // [DEV] 보호자 진입 핸들러
  const handleDevProtector = () => {
    useSessionStore.getState().login('PROTECTOR');
  };

  // [DEV] 어르신 진입 핸들러
  const handleDevSenior = () => {
    useSessionStore.getState().login('WARD');
  };

  return (
    <SafeAreaView style={loginStyles.safeArea}>
      <ScrollView contentContainerStyle={loginStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* 상단 [DEV] 버튼 영역 */}
        {__DEV__ && (
          <View style={loginStyles.devButtonContainer}>
            <TouchableOpacity
              style={loginStyles.devButton}
              activeOpacity={0.8}
              onPress={handleDevProtector}
            >
              <Text style={loginStyles.devButtonText}>[DEV] 보호자로 바로 진입</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={loginStyles.devButton}
              activeOpacity={0.8}
              onPress={handleDevSenior}
            >
              <Text style={loginStyles.devButtonText}>[DEV] 어르신으로 바로 진입</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 타이틀 영역 */}
        <View style={loginStyles.titleContainer}>
          <Text style={loginStyles.subTitle}>돌봄의 시작, 케어링</Text>
          <Text style={loginStyles.mainTitle}>Caring</Text>
        </View>

        {/* 로그인 입력 폼 */}
        <View style={loginStyles.formContainer}>
          <TextInput 
            style={loginStyles.input} 
            placeholder="아이디를 입력하세요."
            placeholderTextColor="#A0A0A0"
            value={id}
            onChangeText={setId}
          />

          <TextInput 
            style={loginStyles.input} 
            placeholder="비밀번호를 입력하세요."
            placeholderTextColor="#A0A0A0"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity 
            style={loginStyles.loginButton} 
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={loginStyles.loginButtonText}>로그인</Text>
          </TouchableOpacity>

          {/* 하단 링크 영역 */}
          <View style={loginStyles.linkRow}>
            <TouchableOpacity>
              <Text style={loginStyles.linkText}>아이디 찾기</Text>
            </TouchableOpacity>
            
            <Text style={loginStyles.barText}>|</Text>
            
            <TouchableOpacity>
              <Text style={loginStyles.linkText}>비밀번호 찾기</Text>
            </TouchableOpacity>
            
            <Text style={loginStyles.barText}>|</Text>
            
            <TouchableOpacity onPress={() => navigation.navigate('SignupTypeSelect')}>
              <Text style={loginStyles.linkText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 간편 로그인 원형 버튼 영역 */}
        <View style={loginStyles.socialContainer}>
          <Text style={loginStyles.socialTitle}>간편 로그인</Text>
          <View style={loginStyles.socialIconRow}>
            <View style={[loginStyles.socialCircle, { backgroundColor: '#FEE500' }]} />
            <View style={[loginStyles.socialCircle, { backgroundColor: '#E0E0E0' }]} />
            <View style={[loginStyles.socialCircle, { backgroundColor: '#03C75A' }]} />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  devButtonContainer: {
    marginBottom: 20,
    gap: 8,
  },
  devButton: {
    borderWidth: 1,
    borderColor: '#FF7F00',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  devButtonText: {
    color: '#FF7F00',
    fontSize: 13,
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF7F00',
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
    marginBottom: 12,
    color: '#000',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF7F00',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  linkText: {
    color: '#666',
    fontSize: 13,
  },
  barText: {
    color: '#DDD',
    marginHorizontal: 10,
  },
  socialContainer: {
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  socialIconRow: {
    flexDirection: 'row',
    gap: 15,
  },
  socialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});