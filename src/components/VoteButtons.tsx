"use client";

import { useState, useEffect } from "react";
import { getUserVote } from "@/lib/data/browser";
import { useRouter } from "next/navigation";

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
    if (!userId) return;
    getUserVote(userId, targetType, targetId).then((direction) => {
      if (direction) setUserVote(direction);
    });
  }, [userId, targetType, targetId]);

  const vote = async (direction: "up" | "down") => {
    if (!userId) {
      router.push("/auth/login");
      return;
    }
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
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l8-8h-5V4H9v8H4z" />
        </svg>
      </button>
    </div>
  );
}
