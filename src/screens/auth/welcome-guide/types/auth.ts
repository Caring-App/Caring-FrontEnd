export type WelcomeStepType = 'completed' | 'guide';

export interface SignupWelcomeProps {
  userName: string;
  step: WelcomeStepType;
  onNext: () => void;
  onClose?: () => void;
}