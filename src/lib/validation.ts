/**
 * Validation Helpers
 * Use with Zod schemas for consistent validation
 */

import { z } from 'zod';
import { Errors } from './errors';

/**
 * Validate request body against a Zod schema
 * @throws ApiError if validation fails
 */
export async function validateBody<T extends z.ZodType>(
  schema: T,
  body: unknown
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw Errors.invalidInput(
        firstError.message,
        firstError.path.join('.')
      );
    }
    throw error;
  }
}

/**
 * Validate query parameters
 * @throws ApiError if validation fails
 */
export async function validateQuery<T extends z.ZodType>(
  schema: T,
  query: unknown
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw Errors.invalidInput(
        firstError.message,
        firstError.path.join('.')
      );
    }
    throw error;
  }
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
