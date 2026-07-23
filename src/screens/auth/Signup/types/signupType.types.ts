export type UserRole = 'PROTECTOR' | 'WARD';

export interface RoleSelectHandler {
  onSelectRole: (role: UserRole) => void;
}