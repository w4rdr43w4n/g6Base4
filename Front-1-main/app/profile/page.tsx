import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { resetToken } from "../lib/Auth";
export default async function Page() {
  const resp = await resetToken('wardrawan535@gmail.com')
  console.log(resp)
  const session = getServerSession(options);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/profile");
  }

  return (
    <>
      <h1>Profile</h1>
    </>
  );
}
