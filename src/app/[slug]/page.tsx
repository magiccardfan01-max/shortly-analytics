"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getLinkBySlug,
  isExpired,
  recordClick,
  type ShortLink,
} from "@/lib/store";
import { parseUserAgent } from "@/lib/utils";

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [status, setStatus] = useState<"loading" | "redirecting" | "notfound" | "expired">("loading");
  const [link, setLink] = useState<ShortLink | null>(null);
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const found = getLinkBySlug(slug);
    if (!found) {
      setStatus("notfound");
      return;
    }
    if (isExpired(found)) {
      setStatus("expired");
      setLink(found);
      return;
    }

    setLink(found);
    setStatus("redirecting");

    // Record click
    const ua = navigator.userAgent;
    const { device, browser } = parseUserAgent(ua);
    const referrer = document.referrer || "Direct";
    recordClick(slug, { referrer, device, browser });

    // Countdown then redirect
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          window.location.href = found.originalUrl;
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Looking up link…</div>
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Link not found</h1>
        <p className="text-zinc-400 text-center max-w-md mb-6">
          This short link doesn't exist in this browser. Shortly stores links locally for
          privacy — create your own short links on the homepage.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium"
        >
          Create a short link
        </Link>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">⏰</div>
        <h1 className="text-2xl font-bold mb-2">Link expired</h1>
        <p className="text-zinc-400 text-center max-w-md mb-2">
          This short link has expired and is no longer active.
        </p>
        {link && (
          <p className="text-sm text-zinc-500 mb-6 font-mono truncate max-w-sm">
            {link.originalUrl}
          </p>
        )}
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium"
        >
          Create a new link
        </Link>
      </div>
    );
  }

  // Redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-6 animate-pulse">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold mb-2">Redirecting…</h1>
      <p className="text-zinc-400 text-sm mb-1">in {countdown}s</p>
      {link && (
        <p className="text-zinc-500 text-xs font-mono truncate max-w-sm mt-2">
          {link.originalUrl}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => link && (window.location.href = link.originalUrl)}
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          Go now
        </button>
        <Link href={`/analytics/${slug}`} className="text-sm text-zinc-500 hover:text-zinc-300">
          View analytics
        </Link>
      </div>
    </div>
  );
}
