// Fetch vehicle image from Wikipedia (public domain / CC-licensed photos)
// Cached for 7 days — images rarely change

interface WikiImageResult {
  source: string;
  width: number;
  height: number;
}

export async function getVehicleImage(make: string, model: string): Promise<WikiImageResult | null> {
  // Try multiple search queries (most specific first)
  const queries = [
    `${make} ${model}`,
    `${make} ${model} front`,
    `${make}_${model}`,
  ];

  for (const query of queries) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&format=json&pithumbsize=600&origin=*`;

    try {
      const res = await fetch(url, { next: { revalidate: 604800 } }); // 7-day cache
      const data = await res.json();
      const pages = data?.query?.pages ?? {};
      for (const page of Object.values(pages) as any[]) {
        if (page.thumbnail?.source) {
          return {
            source: page.thumbnail.source,
            width: page.thumbnail.width ?? 400,
            height: page.thumbnail.height ?? 300,
          };
        }
      }
    } catch {
      continue;
    }
  }

  return null;
}
