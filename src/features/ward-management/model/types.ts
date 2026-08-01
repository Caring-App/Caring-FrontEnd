export type FontSizeOption = 'small' | 'medium' | 'large';

export interface Ward {
  id: string;
  nickname: string;
  name: string;
  phone: string;
  address: string;
  ttsSpeed: number;
  fontSize: FontSizeOption;
}

export type WardInfo = Pick<Ward, 'nickname' | 'name' | 'phone' | 'address'>;
