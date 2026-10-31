'use client';

import Link from "next/link";
import { LogOut, Settings, UserRound } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { signOut, useSession } from "../lib/auth-client";

export function Navbar() {
  const { isPending, data } = useSession();

  return (
    <header className="border-b border-border">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6"
      >
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Senior
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/jobs"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
          >
            Browse jobs
          </Link>
          {isPending ? null : data?.user ? (
            <details className="relative">
              <summary className="list-none [&::-webkit-details-marker]:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open profile menu"
                  render={<span />}
                  nativeButton={false}
                >
                  <UserRound aria-hidden="true" />
                </Button>
              </summary>
              <div className="absolute right-0 z-10 mt-2 min-w-44 rounded-md border border-border bg-background p-1 shadow-md">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
                >
                  <Settings aria-hidden="true" className="size-4" />
                  Settings
                </Link>
                <Link
                  href="/applications"
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
                >
                  Applications
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <LogOut aria-hidden="true" className="size-4" />
                  Logout
                </button>
              </div>
            </details>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/login" />}
                nativeButton={false}
              >
                Log in
              </Button>
              <Button
                size="sm"
                render={<Link href="/signup" />}
                nativeButton={false}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
