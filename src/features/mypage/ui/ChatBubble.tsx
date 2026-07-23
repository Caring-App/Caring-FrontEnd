import React from 'react';
import { Text, View } from 'react-native';
import { ChatMessage } from '../model';

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';

  return (
    <View className={isUser ? 'items-end' : 'items-start'}>
      <View
        className={
          isUser
            ? 'max-w-[280px] rounded-tl-[25px] rounded-tr-[25px] rounded-bl-[25px] bg-primary px-4 py-3'
            : 'max-w-[280px] rounded-tl-[25px] rounded-tr-[25px] rounded-br-[25px] bg-surface-chat px-4 py-3'
        }>
        <Text
          className={
            isUser
              ? 'text-sm font-pretendard-bold text-surface'
              : 'text-sm font-pretendard-bold text-text-heading'
          }>
          {message.text}
        </Text>
      </View>
    </View>
  );
}
