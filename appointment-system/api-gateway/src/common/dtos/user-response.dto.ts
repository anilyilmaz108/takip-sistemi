export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}