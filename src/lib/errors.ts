/**
 * Standardized Error Handling
 * Use this for all API routes to maintain consistency
 */

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    field?: string;
  };
}

/**
 * Common error codes
 */
export const ErrorCodes = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  FORBIDDEN: 'FORBIDDEN',
  
  // Input Validation
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
} as const;

/**
 * Convert any error into a standard error response
 */
export function errorResponse(error: unknown): {
  error: ErrorResponse['error'];
  status: number;
} {
  if (error instanceof ApiError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        field: error.field,
      },
      status: error.statusCode,
    };
  }

  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as { issues: Array<{ path: string[]; message: string }> };
    const firstIssue = zodError.issues[0];
    return {
      error: {
        code: ErrorCodes.INVALID_INPUT,
        message: firstIssue.message,
        field: firstIssue.path.join('.'),
      },
      status: 400,
    };
  }

  // Handle database errors
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as { code: string; message: string };
    if (dbError.code === '23505') {
      // Unique constraint violation
      return {
        error: {
          code: ErrorCodes.ALREADY_EXISTS,
          message: 'Resource already exists',
        },
        status: 409,
      };
    }
  }

  // Generic error
  console.error('Unhandled error:', error);
  return {
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
    },
    status: 500,
  };
}

/**
 * Common error creators
 */
export const Errors = {
  unauthorized: (message = 'Authentication required') =>
    new ApiError(401, ErrorCodes.UNAUTHORIZED, message),

  invalidToken: (message = 'Invalid or expired token') =>
    new ApiError(401, ErrorCodes.INVALID_TOKEN, message),

  forbidden: (message = 'You do not have permission to perform this action') =>
    new ApiError(403, ErrorCodes.FORBIDDEN, message),

  notFound: (resource = 'Resource', message?: string) =>
    new ApiError(404, ErrorCodes.NOT_FOUND, message || `${resource} not found`),

  alreadyExists: (resource = 'Resource', message?: string) =>
    new ApiError(409, ErrorCodes.ALREADY_EXISTS, message || `${resource} already exists`),

  invalidInput: (message: string, field?: string) =>
    new ApiError(400, ErrorCodes.INVALID_INPUT, message, field),

  rateLimitExceeded: (message = 'Too many requests. Please try again later.') =>
    new ApiError(429, ErrorCodes.RATE_LIMIT_EXCEEDED, message),

  internalError: (message = 'Internal server error') =>
    new ApiError(500, ErrorCodes.INTERNAL_ERROR, message),
};
