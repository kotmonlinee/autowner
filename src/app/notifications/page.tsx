import type { Metadata } from "next";
import {
  getAllNotifications,
  getCurrentUser,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadNotificationCount,
} from "@/lib/data/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notifications — AutOwner",
  description: "View your notifications on AutOwner.",
};

function NotificationIcon({ type }: { type: string }) {
  if (type === "post_comment") {
    return (
      <svg
        className="w-4 h-4 text-primary shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  if (type === "comment_reply") {
    return (
      <svg
        className="w-4 h-4 text-primary shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6 6-6" />
      </svg>
    );
  }
  return (
    <svg
      className="w-4 h-4 text-text-muted shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const notifications = await getAllNotifications(user.id);
  const unreadCount = await getUnreadNotificationCount(user.id);

  const hasNotifications = notifications.length > 0;

  return (
    <div className="min-h-screen bg-surface-0 relative flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-3xl mx-auto px-5 py-6 flex-1 w-full">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Notifications" }]} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-heading">
              Notifications
            </h1>
            {hasNotifications && (
              <p className="text-sm text-text-muted mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread of ${notifications.length} total`
                  : `${notifications.length} total`}
              </p>
            )}
          </div>

          {/* Mark all as read button */}
          {unreadCount > 0 && (
            <form
              action={async () => {
                "use server";
                await markAllNotificationsRead(user.id);
                revalidatePath("/notifications");
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-primary hover:text-primary-glow bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors font-heading"
              >
                Mark all as read
              </button>
            </form>
          )}
        </div>

        {/* Notification list */}
        {!hasNotifications ? (
          <div className="bg-surface-1 rounded-xl border border-surface-border p-16 text-center">
            <svg
              className="w-16 h-16 text-surface-3 mx-auto mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h2 className="text-lg font-semibold text-text-primary font-heading mb-2">
              No notifications yet
            </h2>
            <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
              When someone comments on your posts or replies to your comments, you will see it here.
            </p>
          </div>
        ) : (
          <div className="bg-surface-1 rounded-xl border border-surface-border divide-y divide-surface-border overflow-hidden">
            {notifications.map((notif) => (
              <form
                key={notif.id}
                action={async () => {
                  "use server";
                  await markNotificationRead(notif.id);
                  revalidatePath("/notifications");
                  if (notif.link) redirect(notif.link);
                }}
                className={`block w-full text-left px-5 py-4 hover:bg-surface-2 transition-colors ${
                  !notif.is_read ? "bg-primary/[0.03] border-l-2 border-l-primary" : ""
                }`}
              >
                <button type="submit" className="w-full text-left flex items-start gap-3">
                  <NotificationIcon type={notif.type} />

                  {/* Unread dot */}
                  {!notif.is_read && (
                    <span className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug ${
                        !notif.is_read ? "text-text-primary font-semibold" : "text-text-secondary"
                      }`}
                    >
                      {notif.message}
                    </p>
                    <p className="text-xs text-text-muted mt-1.5 flex items-center gap-2">
                      <span>{timeAgo(notif.created_at)}</span>
                      {notif.link && (
                        <span className="text-primary/60 truncate max-w-[200px]">
                          View &rarr;
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Click hint */}
                  {notif.link && (
                    <svg
                      className="w-4 h-4 text-surface-border shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </form>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
