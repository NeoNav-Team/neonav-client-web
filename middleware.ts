import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const hasToken = request.cookies.has('accessToken');
    const { nextUrl: { search } } = request;
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if(!hasToken) {
      return NextResponse.redirect('https://auth.neonav.net');
    }
    // Legacy URL support; targeted at allowing users to join chat channels, but is dynamic enough to handle other URLs
    if(request.nextUrl.searchParams.has('p')
      && request.nextUrl.searchParams.has('c')
      && request.nextUrl.searchParams.has('a')) {
      let nextUrl = request.nextUrl.clone();
      return NextResponse.redirect(new URL("/" + params['p'] + "/" + params['c'] + "/" + params['a'], nextUrl));
    }
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|favicon.ico|neonav.svg).*)',
    ],
  }
