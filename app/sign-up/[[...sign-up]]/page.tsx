import { redirect } from "next/navigation";

// With Google OAuth, sign-up and sign-in are the same flow
export default function SignUpPage() {
  redirect("/sign-in");
}
