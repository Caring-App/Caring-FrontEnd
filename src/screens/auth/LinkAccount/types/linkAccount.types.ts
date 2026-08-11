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