export enum AuthErrors {
  RefreshTokenNotFound = 'Refresh token not found',
  InvalidOrExpiredRefreshToken = 'Invalid or expired refresh token',
  EmailAlreadyInUse = 'Email already in use',
  InvalidCredentials = 'Invalid credentials',
}

export const TOKEN_EXPIRES_IN = 150000; // 150 sec
