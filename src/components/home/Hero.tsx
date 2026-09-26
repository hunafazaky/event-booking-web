import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { buttonVariants } from "@/components/ui/button";
import { handleImageError } from "../../lib/format";

// Real convention/festival photos, cycling behind the hero text.
const SLIDES = [
  "https://animematsuri.com/wp-content/uploads/2021/07/Volunteer-1024x683.jpg",
  "https://i0.wp.com/cgf.sg/wp-content/uploads/2025/09/pressrelease1.jpeg?resize=1916%2C1075&ssl=1",
  "https://www.advantour.com/img/japan/festivals/hanabi-matsuri.jpg",
];
const INTERVAL_MS = 5000;

// The first thing anyone sees, signed in or not — explains what this
// site actually is before asking anything of the visitor. The CTA
// below only shows for a signed-out visitor: a signed-in attendee
// doesn't need to be told to sign up, and an organizer already has
// their own dashboard link in the header.
export default function Hero() {
  const { user } = useAuth();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-base border-2 border-border shadow-shadow">
      {/* Photos are stacked and crossfaded via opacity — only the
          active one is visible, but all three stay mounted so the
          transition doesn't pop/flash between them. */}
      <div className="absolute inset-0">
        {SLIDES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            onError={handleImageError}
            aria-hidden={i !== active}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}
        {/* Darker wash than a flat-illustration background would
            need — real photos are busier, so text needs more
            contrast to stay legible on top. */}
        <div className="absolute inset-0 bg-foreground/50" />
      </div>

      <div className="relative px-6 py-12 sm:px-10 sm:py-16">
        <p className="inline-block rounded-base border-2 border-border bg-secondary-background px-3 py-1 text-sm font-heading">
          For the anime community
        </p>
        <h1 className="mt-4 max-w-2xl font-heading text-background text-4xl leading-tight sm:text-5xl">
          Find your next convention, market, or meetup.
        </h1>
        <p className="mt-4 max-w-md font-base text-background/80">
          Conventions, doujin markets, screenings, cosplay contests, and game
          tournaments — posted by the community, for the community. Browse
          what's coming up, or start hosting your own.
        </p>

        {!user && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className={buttonVariants({ variant: "default" })}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className={buttonVariants({ variant: "neutral" })}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
