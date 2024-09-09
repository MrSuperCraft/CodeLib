import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    matcher: [
        // Match all paths, but ensure locale-specific paths are prioritized
        '/((?!_next|api|favicon.ico).*)',
    ]
};
