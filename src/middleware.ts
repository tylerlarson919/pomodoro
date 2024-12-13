import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase/auth";

export function middleware(req: NextRequest) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
