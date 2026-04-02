export interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  profilePicture?: string;
  isActive: boolean;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  bio?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string | null;
  profilePicture?: string;
}