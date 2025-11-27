import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { STRAPI_BASE_URL } from "./lib/strapi"

const protectedRoutes = ['/dashboard']
const authRoutes = ['/signin', '/signup']

function checkIsProtectedRoute(path: string) {
  return protectedRoutes.includes(path)
}

function checkIsAuthRoute(path: string) {
  return authRoutes.some(route => path.startsWith(route))
}

export async function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname

  // Handle auth routes: redirect to dashboard if already logged in
  if (checkIsAuthRoute(currentPath)) {
    const jwt = request.cookies.get('jwt')
    if (jwt) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  const isProtectedRoute = checkIsProtectedRoute(currentPath)

  if (!isProtectedRoute) return NextResponse.next()

  // la ruta, es una ruta protegida, por lo que debemos verificar si el usuario está autenticado
  try {
    // 1. validat si el usuario tiene el token jwt
    // 2. si el usuario existe en la base de datos
    // 3. si el usuario esta activo (Bloqueado?)

    const cookieStore = await cookies()
    const jwt = cookieStore.get('jwt')?.value

    if (!jwt) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    const response = await fetch(`${STRAPI_BASE_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }
    })
    const userResponse = await response.json()
    console.log(userResponse)

    if (!userResponse) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    // le dejamos pasar a la solicitud
    return NextResponse.next()

  } catch (error) {
    console.error('Error verifying user authentication:', error)
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard",
    "/dashboard/:path*",
    "/signin",
    "/signin/:path*",
    "/signup",
    "/signup/:path*",
  ]
}

