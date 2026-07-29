import { ImageSourcePropType } from 'react-native';

export interface WelfareFacility {
  id: string;
  name: string;
  benefit: string;
  phone: string;
  address: string;
  hours: string;
  posterImage?: ImageSourcePropType;
}
