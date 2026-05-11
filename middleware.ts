import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth session refresh middleware.
 * Runs on most pages so Supabase tokens get refreshed before they expire.
 * Mirrors the official Supabase Next.js SSR pattern.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Touching getUser() is what actually refreshes the token cookies.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static, _next/image (Next internals)
     * - favicon, brand images, video, audio, fonts (static assets)
     * - api/ (we don't want to interfere with API routes)
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|brand|cover-art|video|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|woff2?)).*)",
  ],
};
