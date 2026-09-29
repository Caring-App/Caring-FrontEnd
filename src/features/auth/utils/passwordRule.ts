// 비밀번호 규칙: 영문, 숫자, 특수문자를 모두 포함한 8자 이상 (Figma 970:7578 안내 문구 기준)
export const PASSWORD_RULE_MESSAGE = '영문, 숫자, 특수문자 포함 8자 이상';

export const isValidPassword = (password: string) =>
  password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
