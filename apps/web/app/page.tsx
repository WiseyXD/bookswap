import { redirect } from "next/navigation";
import { auth, signIn } from "../auth";

export default async function Home() {
  const session = await auth();
  if (session) {
    console.log(session?.user);
    return redirect("/dashboard");
  }
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}
