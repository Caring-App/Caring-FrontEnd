import React from 'react';
import { Text, View } from 'react-native';

export function SectionCard({
  title,
  icon,
  action,
  children,
  className = 'mt-4',
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={`${className} rounded-card border border-border bg-surface p-4`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="text-md font-bold text-text-primary">{title}</Text>
        </View>
        <View pointerEvents="box-none">
          {action}
        </View>
      </View>
      {children}
    </View>
  );
}