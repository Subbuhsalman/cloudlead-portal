import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import { allPrivateRoutes, dashboardHome, protectedRedirectionUrl } from './utils/menuItem';


const protectedRoutes:Array<string> = allPrivateRoutes;
const publicRoutes = ['/']
 
export default async function middleware(req: NextRequest) {
  

  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  const currentTime = Math.floor(Date.now() / 1000);

  // 3. Decrypt the session from the cookie
  const accessToken = (await cookies()).get('accessToken')?.value ||  "";


  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute &&  accessToken ==="" ) {
    return NextResponse.redirect(new URL(protectedRedirectionUrl, req.nextUrl))
  }
  if( accessToken !== ""){
    const decoded: any = jwtDecode<JwtPayload>(accessToken);
    const validLoggedIn = decoded.aud && decoded.jti && decoded.iat && decoded.nbf && decoded.exp && decoded.sub && decoded.exp > currentTime;
    //return NextResponse.json({ validLoggedIn: validLoggedIn, decoded }, { status: 200 });

    if (isPublicRoute && validLoggedIn ) {
     return NextResponse.redirect(new URL(dashboardHome, req.nextUrl))
    }
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}