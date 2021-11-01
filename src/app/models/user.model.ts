export class UserAuthRequest {
  public email: string;
  public password: string;
}

export class User {
  public id: number;
  public firstname: string;
  public lastname: string;
  public email: string;
  public image?: string;
  public role?: string;
  public hasVerifiedEmail?: boolean;
  public password?: string;
}

export class ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}
