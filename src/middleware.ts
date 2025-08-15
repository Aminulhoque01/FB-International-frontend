import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { parse } from "cookie";  

function checkAuth(request: NextRequest) {
  const cookiesHeader = request.headers.get("cookie");  
  const cookies = cookiesHeader ? parse(cookiesHeader) : {};  


  return NextResponse.next(cookies);
}

// Middleware function that checks protected paths
export function middleware(request: NextRequest) {
  const protectedPaths = [
    "/dashboard",
    "/dashboard/add-company",
    "/dashboard/edit-company",
    "/dashboard/wishlist",
    "/dashboard/orders",
    "/dashboard/settings",
  ];

  if (protectedPaths.some((path) => request.url.includes(path))) {
    return checkAuth(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/add-company",
    "/dashboard/edit-company",
    "/dashboard/wishlist",
    "/dashboard/orders",
    "/dashboard/settings",
  ],
};
