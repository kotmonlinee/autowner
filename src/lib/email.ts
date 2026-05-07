// Email notification helper.
// In development, emails are logged to the console.
// In production, configure EMAIL_PROVIDER to enable real email delivery.
//
// Supported providers:
//   - "none" (default): Log emails to console only
//   - "resend": Use Resend API (https://resend.com)
//   - "sendgrid": Use SendGrid API (https://sendgrid.com)
//
// Required env vars per provider:
//   Resend:    RESEND_API_KEY
//   SendGrid:  SENDGRID_API_KEY, SENDGRID_FROM_EMAIL

import { createServerSupabase } from "@/lib/supabase-server";

const EMAIL_PROVIDER = (process.env.EMAIL_PROVIDER ?? "none") as
  | "none"
  | "resend"
  | "sendgrid";

const SITE_NAME = "AutOwner";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.autowner.com";

async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const supabase = await createServerSupabase();

    // Try profiles table first (if email is stored there)
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!profile) {
      console.warn(`[email] No profile found for user ${userId}`);
      return null;
    }

    // Fetch user email from Supabase Auth admin API.
    // This requires the service_role key (SUPABASE_SERVICE_ROLE_KEY).
    // In dev mode where the service key may not be available, we log instead.
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      console.warn(
        `[email] SUPABASE_SERVICE_ROLE_KEY not set — cannot fetch email for user ${userId}`,
      );
      return null;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      console.warn("[email] NEXT_PUBLIC_SUPABASE_URL not set");
      return null;
    }

    const res = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );

    if (!res.ok) {
      console.warn(
        `[email] Failed to fetch user ${userId} from auth admin: ${res.status}`,
      );
      return null;
    }

    const user = await res.json();
    return user?.email ?? null;
  } catch (error) {
    console.error("[email] Error fetching user email:", error);
    return null;
  }
}

async function sendViaResend(
  to: string,
  subject: string,
  htmlBody: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `${SITE_NAME} <notifications@autowner.com>`,
        to,
        subject,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] Resend API error (${res.status}):`, body);
      return false;
    }

    console.log(`[email] Sent via Resend to ${to}: "${subject}"`);
    return true;
  } catch (error) {
    console.error("[email] Resend send error:", error);
    return false;
  }
}

async function sendViaSendGrid(
  to: string,
  subject: string,
  htmlBody: string,
): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    console.warn(
      "[email] SENDGRID_API_KEY or SENDGRID_FROM_EMAIL not set",
    );
    return false;
  }

  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: fromEmail },
        subject,
        content: [{ type: "text/html", value: htmlBody }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] SendGrid API error (${res.status}):`, body);
      return false;
    }

    console.log(`[email] Sent via SendGrid to ${to}: "${subject}"`);
    return true;
  } catch (error) {
    console.error("[email] SendGrid send error:", error);
    return false;
  }
}

/**
 * Send a notification email to a user.
 *
 * In development (or when EMAIL_PROVIDER is "none"), emails are logged to the
 * console. Set EMAIL_PROVIDER to "resend" or "sendgrid" and provide the
 * corresponding API keys to enable real email delivery.
 *
 * @param userId  - The recipient's Supabase Auth user ID
 * @param subject - Email subject line
 * @param htmlBody - Email body as HTML
 */
export async function sendNotificationEmail(
  userId: string,
  subject: string,
  htmlBody: string,
): Promise<void> {
  const email = await getUserEmail(userId);

  if (!email) {
    console.warn(
      `[email] Cannot send to user ${userId}: no email address found`,
    );
    return;
  }

  if (EMAIL_PROVIDER === "none") {
    console.log(
      `[email] DEV MODE — Would send to ${email}:\n  Subject: ${subject}\n  Body: ${htmlBody.slice(0, 200)}${htmlBody.length > 200 ? "..." : ""}`,
    );
    return;
  }

  if (EMAIL_PROVIDER === "resend") {
    await sendViaResend(email, subject, htmlBody);
    return;
  }

  if (EMAIL_PROVIDER === "sendgrid") {
    await sendViaSendGrid(email, subject, htmlBody);
    return;
  }

  console.warn(`[email] Unknown EMAIL_PROVIDER: ${EMAIL_PROVIDER}`);
}

/**
 * Convenience wrapper that builds a simple HTML notification email.
 */
export async function sendNotificationEmailSimple(
  userId: string,
  subject: string,
  message: string,
  link?: string,
): Promise<void> {
  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0b0f; color: #f0f1f3; padding: 0; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <tr>
      <td style="padding: 32px 0 24px; text-align: center;">
        <span style="font-family: 'Trebuchet MS', sans-serif; font-size: 24px; font-weight: bold; color: #f0f1f3; letter-spacing: 0.02em;">
          AUTO<span style="color: #ed1c24;">WNER</span>
        </span>
      </td>
    </tr>
    <tr>
      <td style="background-color: #111318; border: 1px solid #2a2d35; border-radius: 12px; padding: 24px;">
        <p style="font-size: 15px; line-height: 1.6; color: #f0f1f3; margin: 0 0 16px;">
          ${message}
        </p>
        ${link ? `<a href="${SITE_URL}${link}" style="display: inline-block; padding: 10px 20px; background-color: #ed1c24; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">View on AutOwner</a>` : ""}
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 0; text-align: center; font-size: 12px; color: #6b7280;">
        You received this email because you have an account on <a href="${SITE_URL}" style="color: #9ca3af;">AutOwner</a>.
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  await sendNotificationEmail(userId, subject, htmlBody);
}
