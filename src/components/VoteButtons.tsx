"use client";

import { useState, useEffect } from "react";
import { getUserVote } from "@/lib/data/browser";
import { useRouter } from "next/navigation";

const LOCALSTORAGE_KEY = "autowner_votes";

interface VotesStore {
  [key: string]: "up" | "down" | null;
}

function getAnonymousVotes(): VotesStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as VotesStore;
  } catch {
    return {};
  }
}

function setAnonymousVotes(votes: VotesStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(votes));
}

/**
 * Compute the adjusted score for an anonymous vote.
 * When a user votes up, we add 1 to the base score.
 * When a user votes down, we subtract 1.
 * When unchanged, we show the base score.
 * If the user switches from up to down, the delta changes from +1 to -1.
 */
function computeAnonymousScore(
  baseScore: number,
  vote: "up" | "down" | null,
): number {
  if (vote === "up") return baseScore + 1;
  if (vote === "down") return baseScore - 1;
  return baseScore;
}

export default function VoteButtons({
  targetType,
  targetId,
  initialScore,
  userId,
}: {
  targetType: "post" | "comment";
  targetId: string;
  initialScore: number;
  userId?: string;
}) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      getUserVote(userId, targetType, targetId).then((direction) => {
        if (direction) setUserVote(direction);
      });
    } else {
      const votes = getAnonymousVotes();
      const key = `${targetType}_${targetId}`;
      const vote = votes[key] ?? null;
      setUserVote(vote);
      setScore(computeAnonymousScore(initialScore, vote));
    }
  }, [userId, targetType, targetId, initialScore]);

  const vote = async (direction: "up" | "down") => {
    if (userId) {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, direction }),
      });
      if (res.ok) {
        const { newScore, newVote } = await res.json();
        setScore(newScore);
        setUserVote(newVote);
      }
    } else {
      const votes = getAnonymousVotes();
      const key = `${targetType}_${targetId}`;
      const currentVote = votes[key] ?? null;

      let newVote: "up" | "down" | null;
      if (currentVote === direction) {
        // Toggle off
        delete votes[key];
        newVote = null;
      } else {
        // Set or switch vote
        votes[key] = direction;
        newVote = direction;
      }

      setAnonymousVotes(votes);
      setUserVote(newVote);
      setScore(computeAnonymousScore(initialScore, newVote));
    }
  };

  return (
    <div className="flex flex-col items-center shrink-0 w-9">
      <button
        onClick={() => vote("up")}
        className={`w-6 h-6 flex items-center justify-center rounded transition-all duration-150 ${
          userVote === "up"
            ? "text-primary bg-primary/10"
            : "text-text-muted hover:text-primary hover:bg-surface-3"
        }`}
        aria-label="Upvote"
        aria-pressed={userVote === "up"}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l-8 8h5v8h6v-8h5z" />
        </svg>
      </button>
      <span className={`text-xs font-bold my-0.5 font-heading tabular-nums ${
        userVote === "up" ? "text-primary" : userVote === "down" ? "text-blue-400" : "text-text-muted"
      }`}>
        {score}
      </span>
      <button
        onClick={() => vote("down")}
        className={`w-6 h-6 flex items-center justify-center rounded transition-all duration-150 ${
          userVote === "down"
            ? "text-blue-400 bg-blue-400/10"
            : "text-text-muted hover:text-blue-400 hover:bg-surface-3"
        }`}
        aria-label="Downvote"
        aria-pressed={userVote === "down"}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l8-8h-5V4H9v8H4z" />
        </svg>
      </button>
    </div>
  );
}
