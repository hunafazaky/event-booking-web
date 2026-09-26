import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";
import type { Role } from "../types/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("attendee");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signUp({ name, email, password, role });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to sign up.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-heading text-2xl">Sign Up</h1>

      <Card className="mt-6">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <fieldset>
              <Label>I want to</Label>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant={role === "attendee" ? "default" : "neutral"}
                  onClick={() => setRole("attendee")}
                  className="flex-1"
                >
                  Attend events
                </Button>
                <Button
                  type="button"
                  variant={role === "organizer" ? "default" : "neutral"}
                  onClick={() => setRole("organizer")}
                  className="flex-1"
                >
                  Organize events
                </Button>
              </div>
              <p className="mt-1 text-xs font-base text-foreground/70">
                This can't be changed after signing up yet.
              </p>
            </fieldset>

            {error && (
              <p className="text-sm font-base text-warning-foreground">
                {error}
              </p>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? "Signing up…" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-4 text-sm font-base text-foreground/70">
        Already have an account?{" "}
        <Link to="/login" className="font-heading underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
