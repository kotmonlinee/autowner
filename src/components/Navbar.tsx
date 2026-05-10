"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSessionUser, onAuthChange, signOut, fetchProfile } from "@/lib/data/browser";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";
import Avatar from "./Avatar";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileUsername, setProfileUsername] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getSessionUser().then((u) => {
      setUser(u);
      if (u) {
        fetchProfile(u.id).then((p) => {
          if (p) {
            setAvatarUrl(p.avatar_url ?? null);
            setProfileUsername(p.username);
          }
        });
      }
    });
    const subscription = onAuthChange((u) => {
      setUser(u);
      if (u) {
        fetchProfile(u.id).then((p) => {
          if (p) {
            setAvatarUrl(p.avatar_url ?? null);
            setProfileUsername(p.username);
          }
        });
      } else {
        setAvatarUrl(null);
        setProfileUsername("");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    router.refresh();
  };

  const displayName = profileUsername || user?.email;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-surface-0/80 backdrop-blur-xl" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center gap-6 border-b border-surface-border">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="w-8 h-8 rounded-md bg-primary flex items-center justify-center group-hover:bg-primary-glow transition-colors">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
            <span className="text-display text-lg text-text-primary tracking-wide">
              AUTO<span className="text-primary">WNER</span>
            </span>
          </Link>

          {/* Desktop SearchBar */}
          <div className="flex-1 hidden sm:block">
            <SearchBar />
          </div>

          {/* Desktop right-side buttons */}
          <div className="hidden sm:flex items-center gap-3 ml-auto shrink-0">
            {user ? (
              <>
                <Link
                  href="/submit"
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow hover:-translate-y-px transition-all duration-150 shadow-sm shadow-primary/20"
                >
                  + New Post
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-surface-border">
                  <NotificationBell userId={user.id} />
                  <Link
                    href="/bookmarks"
                    className="p-1.5 rounded-lg text-text-muted hover:text-amber hover:bg-surface-2 transition-colors"
                    title="Bookmarks"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </Link>
                  <Link
                    href="/drafts"
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors"
                    title="Drafts"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <Link
                    href="/settings"
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors"
                    title="Settings"
                  >
                    <svg
                      className="w-4.5 h-4.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </Link>
                  <ThemeToggle />
                  <Avatar
                    username={displayName}
                    avatarUrl={avatarUrl}
                    size="md"
                  />
                  <button
                    onClick={handleLogout}
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-semibold font-heading text-text-secondary hover:text-text-primary border border-surface-border rounded-lg hover:border-surface-4 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="sm:hidden ml-auto shrink-0 w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-md hover:bg-surface-2 transition-colors"
          >
            {/* Top line */}
            <span
              className={`block w-5 h-0.5 bg-text-primary rounded-full transition-all duration-200 origin-center ${
                menuOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            {/* Middle line */}
            <span
              className={`block w-5 h-0.5 bg-text-primary rounded-full transition-all duration-200 ${
                menuOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            {/* Bottom line */}
            <span
              className={`block w-5 h-0.5 bg-text-primary rounded-full transition-all duration-200 origin-center ${
                menuOpen ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile slide-down menu */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-200 ease-in-out ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-5 pb-4 pt-1 space-y-3 bg-surface-0/95 backdrop-blur-xl">
            {/* SearchBar */}
            <SearchBar />

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-surface-border">
              {user ? (
                <>
                  <Link
                    href="/submit"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold font-heading rounded-lg hover:bg-primary-glow transition-all duration-150 shadow-sm shadow-primary/20"
                  >
                    + New Post
                  </Link>
                  <div className="flex items-center gap-3">
                    <NotificationBell userId={user.id} />
                    <Link
                      href="/bookmarks"
                      onClick={() => setMenuOpen(false)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-amber hover:bg-surface-2 transition-colors"
                      title="Bookmarks"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </Link>
                    <Link
                      href="/drafts"
                      onClick={() => setMenuOpen(false)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors"
                      title="Drafts"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors"
                      title="Settings"
                    >
                      <svg
                        className="w-4.5 h-4.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </Link>
                    <ThemeToggle />
                    <Avatar
                      username={displayName}
                      avatarUrl={avatarUrl}
                      size="md"
                    />
                    <button
                      onClick={handleLogout}
                      className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm font-semibold font-heading text-text-secondary hover:text-text-primary border border-surface-border rounded-lg hover:border-surface-4 transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay when menu is open */}
      {menuOpen && (
        <div
          className="sm:hidden fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
