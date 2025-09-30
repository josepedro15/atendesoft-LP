import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Para export estático, não executar middleware do Supabase
  // Isso evita loops de redirecionamento
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - site.webmanifest (web manifest)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ],
}
