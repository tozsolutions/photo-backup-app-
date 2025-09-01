/**
 * Error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 503);
    this.name = 'NetworkError';
  }
}

export class FileError extends AppError {
  constructor(message: string) {
    super(message, 'FILE_ERROR', 400);
    this.name = 'FileError';
  }
}

export class DeviceError extends AppError {
  constructor(message: string) {
    super(message, 'DEVICE_ERROR', 404);
    this.name = 'DeviceError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Bilinmeyen bir hata oluştu';
}

export function handleAsyncError<T>(
  promise: Promise<T>
): Promise<[T | null, AppError | null]> {
  return promise
    .then<[T, null]>((data: T) => [data, null])
    .catch<[null, AppError]>((error: AppError) => [null, error]);
}