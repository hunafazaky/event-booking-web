import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";
import { tagsApi } from "../api/tags";
import { ApiError } from "../lib/api";
import TagInput from "../components/ui/TagInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const { user, refreshUser, signOut } = useAuth();
  const navigate = useNavigate();

  // --- Name ---
  const [name, setName] = useState(user?.name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaved, setNameSaved] = useState(false);

  // --- Interests ---
  const [interests, setInterests] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [savingInterests, setSavingInterests] = useState(false);
  const [interestsError, setInterestsError] = useState<string | null>(null);
  const [interestsSaved, setInterestsSaved] = useState(false);

  // --- Delete account ---
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Re-seed both editors whenever `user` changes (e.g. after
  // refreshUser), so they stay in sync with what's actually saved.
  useEffect(() => {
    if (user) {
      setName(user.name);
      setInterests(user.interests.map((t) => t.name));
    }
  }, [user]);

  useEffect(() => {
    tagsApi
      .list()
      .then((tags) => setSuggestions(tags.map((t) => t.name)))
      .catch(() => {});
  }, []);

  if (!user) return null;

  async function handleSaveName() {
    setSavingName(true);
    setNameError(null);
    setNameSaved(false);
    try {
      await authApi.updateProfile(name);
      await refreshUser();
      setNameSaved(true);
    } catch (err) {
      setNameError(
        err instanceof ApiError ? err.message : "Failed to save name.",
      );
    } finally {
      setSavingName(false);
    }
  }

  async function handleSaveInterests() {
    setSavingInterests(true);
    setInterestsError(null);
    setInterestsSaved(false);
    try {
      await authApi.updateInterests(interests);
      await refreshUser();
      setInterestsSaved(true);
    } catch (err) {
      setInterestsError(
        err instanceof ApiError ? err.message : "Failed to save interests.",
      );
    } finally {
      setSavingInterests(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await authApi.deleteAccount();
      signOut();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(
        err instanceof ApiError ? err.message : "Failed to delete account.",
      );
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-heading text-2xl">Profile</h1>

      <Card className="mt-8">
        <CardContent>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameSaved(false);
            }}
            className="mt-1"
          />
          {nameError && (
            <p className="mt-2 text-sm font-base text-warning-foreground">
              {nameError}
            </p>
          )}
          {nameSaved && !nameError && (
            <p className="mt-2 text-sm font-base text-success-foreground">
              Saved.
            </p>
          )}
          <Button
            size="sm"
            onClick={handleSaveName}
            disabled={savingName || name === user.name}
            className="mt-3"
          >
            {savingName ? "Saving…" : "Save Name"}
          </Button>

          <p className="mt-6 font-base text-foreground/70">{user.email}</p>
          <p className="mt-1 text-sm font-base text-foreground/70 capitalize">
            {user.role}
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent>
          <Label>Favorite series</Label>
          <p className="mt-1 text-xs font-base text-foreground/70">
            Add anything — a series, a genre, a tag. Press Enter or comma after
            each one.
          </p>
          <div className="mt-2">
            <TagInput
              value={interests}
              onChange={(next) => {
                setInterests(next);
                setInterestsSaved(false);
              }}
              suggestions={suggestions}
              placeholder="e.g. Jujutsu Kaisen, shounen"
            />
          </div>

          {interestsError && (
            <p className="mt-2 text-sm font-base text-warning-foreground">
              {interestsError}
            </p>
          )}
          {interestsSaved && !interestsError && (
            <p className="mt-2 text-sm font-base text-success-foreground">
              Saved.
            </p>
          )}

          <Button
            size="sm"
            onClick={handleSaveInterests}
            disabled={savingInterests}
            className="mt-4"
          >
            {savingInterests ? "Saving…" : "Save Interests"}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-12 border-warning-foreground">
        <CardContent>
          <p className="font-heading text-warning-foreground">Delete Account</p>
          <p className="mt-1 text-sm font-base text-foreground/70">
            This permanently deletes your account. Events or bookings you've
            already created aren't removed — they'll just no longer show your
            name.
          </p>
          {deleteError && (
            <p className="mt-2 text-sm font-base text-warning-foreground">
              {deleteError}
            </p>
          )}

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="warning"
                  size="sm"
                  disabled={deleting}
                  className="mt-3"
                >
                  {deleting ? "Deleting…" : "Delete My Account"}
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This cannot be undone. Your account will be permanently
                  deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="warning"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
