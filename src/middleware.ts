/**
 * Next.js Middleware for Authentication
 * Protects API routes and attaches user context
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from './lib/db/client';
import { ErrorCodes } from './lib/errors';
import { logger } from './lib/logger';

/**
 * Routes that require authentication
 */
const PROTECTED_ROUTES = [
  '/api/v1/posts',
  '/api/v1/comments',
  '/api/v1/stories',
  '/api/v1/reactions',
  '/api/v1/follows',
  '/api/v1/users',
  '/api/v1/marketplace',
  '/api/v1/ai',
];

/**
 * Routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  '/api/v1/auth/login',
  '/api/v1/auth/signup',
  '/api/v1/auth/callback',
  '/api/health',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const requiresAuth = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (!requiresAuth) {
    return NextResponse.next();
  }

  // Extract token from Authorization header
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    logger.warn('Unauthorized request - missing token', { pathname });
    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.UNAUTHORIZED,
          message: 'Authentication required',
        },
      },
      { status: 401 }
    );
  }

  try {
    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      logger.warn('Invalid token', { pathname, error: error?.message });
      return NextResponse.json(
        {
          error: {
            code: ErrorCodes.INVALID_TOKEN,
            message: 'Invalid or expired token',
          },
        },
        { status: 401 }
      );
    }

    // Attach user ID to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-email', user.email || '');

    logger.debug('Authenticated request', {
      pathname,
      userId: user.id,
    });

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    logger.error('Auth middleware error', error, { pathname });
    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: 'Authentication failed',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Configure which routes middleware applies to
 */
export const config = {
  matcher: [
    /*
     * Match all API routes except:
     * - Static files (_next/static)
     * - Image optimization files (_next/image)
     * - Favicon
     */
    '/api/:path*',
  ],
};
