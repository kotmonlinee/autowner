// Upload avatar for the currently authenticated user.
// Requires the "avatars" bucket in Supabase Storage — create it manually:
//   1. Go to your Supabase project → Storage
//   2. Create a new bucket named "avatars"
//   3. Set it as Public
//   4. Add a policy: allow authenticated users to SELECT/INSERT
//      bucket_id = 'avatars' AND auth.role() = 'authenticated'
import { getCurrentUser } from "@/lib/data/server";
import { withRateLimit } from "@/lib/rate-limit";
import { createServiceSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const BUCKET = "avatars";

function randomHex(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[mimeType] ?? "bin";
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    // Rate limit: 5 avatar uploads per hour per user
    const limited = await withRateLimit(user.id, "upload:avatar", 5, 3600);
    if (limited) return limited;

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 2 MB." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP." },
        { status: 400 },
      );
    }

    const ext = getExtension(file.type);
    // Overwrite the user's previous avatar by using a stable path (user ID prefix).
    const filename = `${user.id.slice(0, 8)}/avatar-${Date.now()}-${randomHex(6)}.${ext}`;

    const supabase = await createServiceSupabase();

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
        upsert: true,
      });

    if (uploadError) {
      console.error("Avatar upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload avatar. Please try again." },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
