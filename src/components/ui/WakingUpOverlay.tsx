import { useEffect, useState } from "react";
import { subscribeWakeUp } from "@/lib/wakeUp";
import { Card, CardContent } from "@/components/ui/card";

// Mounted once, at the top of the app (see App.tsx) — shows a
// full-screen notice whenever a request has been pending long enough
// to suggest the free-tier backend is cold-starting, rather than
// leaving the person staring at a page that looks frozen.
export default function WakingUpOverlay() {
  const [waking, setWaking] = useState(false);

  useEffect(() => subscribeWakeUp(setWaking), []);

  if (!waking) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay p-4">
      <Card className="max-w-sm text-center">
        <CardContent>
          <p className="font-heading text-lg">Waking up the server…</p>
          <p className="mt-2 text-sm font-base text-foreground/70">
            This app runs on a free tier that sleeps when idle. It can take up
            to 30 seconds to wake back up — hang tight, this only happens on the
            first request.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
