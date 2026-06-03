import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/unsubscribe")({
  head: () => ({ meta: [{ title: "Unsubscribe — LanceConnect" }] }),
  component: Unsub,
});

function Unsub() {
  const [done, setDone] = useState(false);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Link to="/" className="flex items-center gap-2"><Logo size={36}/><span className="font-display text-lg font-bold">LanceConnect</span></Link>
      <div className="mt-12 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary"><Mail className="h-7 w-7"/></div>
      {done ? (
        <>
          <h1 className="mt-5 font-display text-3xl font-bold">You're unsubscribed.</h1>
          <p className="mt-3 max-w-md text-muted-foreground">We've removed you from our marketing emails. You'll still receive critical account messages (password resets, billing).</p>
          <Link to="/" className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Back home</Link>
        </>
      ) : (
        <>
          <h1 className="mt-5 font-display text-3xl font-bold">Unsubscribe from emails?</h1>
          <p className="mt-3 max-w-md text-muted-foreground">You'll stop receiving the weekly digest and product updates. We won't email you again unless you ask.</p>
          <button onClick={()=>{setDone(true);toast.success("You're unsubscribed");}} className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Confirm unsubscribe</button>
          <Link to="/" className="mt-3 text-xs text-muted-foreground hover:text-foreground">No, keep me subscribed</Link>
        </>
      )}
    </div>
  );
}
