import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import MicrophoneIcon from '@assets/icons/action/microphone.svg';
import SendIcon from '@assets/icons/action/send.svg';
import { ChatMessage } from '@features/mypage/model';
import { ChatBubble } from '@features/mypage/ui';

export function InquiryChatScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'system', text: '안녕하세요 ! 어떤 점을 도와드릴까요?' },
  ]);
  const [draft, setDraft] = useState('');

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: String(prev.length + 1), sender: 'user', text }]);
    setDraft('');
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-bold text-text-primary">1:1 문의 하기</Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView className="flex-1 px-4" contentContainerClassName="gap-3 py-4">
          {messages.map(message => (
            <ChatBubble key={message.id} message={message} />
          ))}
        </ScrollView>

        <View className="flex-row items-center gap-2 px-4 pb-4">
          <View className="flex-1 flex-row items-center gap-2 rounded-full bg-surface px-4 py-3 shadow-card">
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="메세지를 입력하세요!"
              placeholderTextColor="#A1A1A1"
              className="flex-1 text-sm font-pretendard-bold text-text-primary"
            />
            <MicrophoneIcon width={22} height={22} />
            <Pressable onPress={sendMessage} hitSlop={8}>
              <SendIcon width={22} height={22} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
