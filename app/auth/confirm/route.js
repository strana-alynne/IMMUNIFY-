// Import NextResponse from 'next/server' module
import { NextResponse } from "next/server";

// Import createClient function from '@/utils/supabase/server' module
import { createClient } from "@/utils/supabase/server";

// Export an async function to handle GET requests
export async function GET(request) {
  // Extract search parameters from the request URL
  const { searchParams } = new URL(request.url);

  // Get the token_hash, type, and next parameters from the search parameters
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/"; // default to '/' if next is not provided

  // Create a clone of the next URL
  const redirectTo = request.nextUrl.clone();

  // Set the pathname of the redirect URL to the 'next' parameter
  redirectTo.pathname = next;

  // Remove the token_hash and type parameters from the redirect URL
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  // If both token_hash and type are provided
  if (token_hash && type) {
    // Create a Supabase client instance
    const supabase = createClient();

    // Verify the OTP using Supabase auth
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    // If the OTP verification is successful (no error)
    if (!error) {
      // Redirect the user to the login page
      redirectTo.pathname = "/pages/LoginPage";
      return NextResponse.redirect(redirectTo);
    }
  }

  // If the OTP verification fails or token_hash and type are not provided
  // Redirect the user to an error page
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
