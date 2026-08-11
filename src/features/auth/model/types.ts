export interface SignupFormState {
  name: string;
  phone: string;
  authCode: string;
  password: string;
  passwordConfirm: string;
  birthDate: string;
  address: string;
  diseases: string[];
}

export interface BirthDatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

export interface LinkAccountForm {
  code: string;
}

export interface UseLinkAccountReturn {
  code: string;
  setCode: (code: string) => void;
  handlePaste: () => Promise<void>;
  handleSubmit: () => void;
  isValidCode: boolean;
}
