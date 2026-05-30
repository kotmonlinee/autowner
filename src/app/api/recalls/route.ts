import { searchRecalls, getVehicleMakes, getVehicleModels } from "@/lib/nhtsa";
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  // Rate limit: 30 searches per minute per IP
  const limited = await rateLimit(getClientIp(request), "recalls:search", 30, 60);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    if (action === "makes") {
      const makes = await getVehicleMakes();
      return NextResponse.json({ makes });
    }

    if (action === "models") {
      const make = searchParams.get("make") ?? "";
      const year = searchParams.get("year") ?? "";
      if (!make) return NextResponse.json({ models: [] });
      const models = await getVehicleModels(make, year);
      return NextResponse.json({ models });
    }

    if (action === "search") {
      const make = searchParams.get("make") ?? "";
      const model = searchParams.get("model") ?? "";
      const year = searchParams.get("year") ?? "";
      if (!make || !model || !year) {
        return NextResponse.json({ recalls: [] });
      }
      const recalls = await searchRecalls(make, model, year);
      return NextResponse.json({ recalls });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
