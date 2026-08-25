import EncryptedStorage from 'react-native-encrypted-storage';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const getAccessToken = () => EncryptedStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => EncryptedStorage.getItem(REFRESH_TOKEN_KEY);

export const setAccessToken = (accessToken: string) => EncryptedStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

export const setTokens = async (accessToken: string, refreshToken: string) => {
  await EncryptedStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  await EncryptedStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = async () => {
  await EncryptedStorage.removeItem(ACCESS_TOKEN_KEY);
  await EncryptedStorage.removeItem(REFRESH_TOKEN_KEY);
};
