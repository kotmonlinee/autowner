import { getVehicleMakes, getVehicleModels, getVehicleGenerations } from "@/lib/data/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    if (action === "makes") {
      const makes = await getVehicleMakes();
      return NextResponse.json({
        makes: makes.map((m: Record<string, unknown>) => ({
          name: m.name,
          slug: m.slug,
          country: m.country,
        })),
      });
    }

    if (action === "models") {
      const makeSlug = searchParams.get("makeSlug") ?? "";
      if (!makeSlug) return NextResponse.json({ models: [] });
      const models = await getVehicleModels(makeSlug);
      return NextResponse.json({
        models: models.map((m: Record<string, unknown>) => ({
          name: m.name,
          slug: m.slug,
        })),
      });
    }

    if (action === "generations") {
      const makeSlug = searchParams.get("makeSlug") ?? "";
      const modelSlug = searchParams.get("modelSlug") ?? "";
      if (!makeSlug || !modelSlug) return NextResponse.json({ generations: [] });
      const gens = await getVehicleGenerations(modelSlug, makeSlug);
      return NextResponse.json({
        generations: gens.map((g: Record<string, unknown>) => ({
          name: g.name,
          yearStart: g.year_start,
          yearEnd: g.year_end,
        })),
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to load vehicle data" }, { status: 500 });
  }
}
