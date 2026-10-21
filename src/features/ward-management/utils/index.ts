import type { ConnectionFontSize } from '@features/account-link/model';
import type { FontSizeOption } from '../model/types';

const CONNECTION_FONT_SIZE_TO_OPTION: Record<ConnectionFontSize, FontSizeOption> = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

export function connectionFontSizeToOption(fontSize: ConnectionFontSize | null): FontSizeOption {
  return (fontSize && CONNECTION_FONT_SIZE_TO_OPTION[fontSize]) ?? 'medium';
}

const OPTION_TO_CONNECTION_FONT_SIZE: Record<FontSizeOption, ConnectionFontSize> = {
  small: 'SMALL',
  medium: 'MEDIUM',
  large: 'LARGE',
};

export function optionToConnectionFontSize(fontSize: FontSizeOption): ConnectionFontSize {
  return OPTION_TO_CONNECTION_FONT_SIZE[fontSize];
}
