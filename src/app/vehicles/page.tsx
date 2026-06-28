import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getVehicleImageUrl } from "@/lib/vehicle-images";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Browse Vehicles by Make & Model",
  description: "Find repair costs, OBD codes, and diagnostics for your specific vehicle.",
  alternates: { canonical: "https://www.autowner.com/vehicles" },
};

const vehicles = [
  { make: "Acura", makeSlug: "acura", model: "Integra", modelSlug: "integra" },
  { make: "Acura", makeSlug: "acura", model: "MDX", modelSlug: "mdx" },
  { make: "Acura", makeSlug: "acura", model: "NSX", modelSlug: "nsx" },
  { make: "Acura", makeSlug: "acura", model: "RDX", modelSlug: "rdx" },
  { make: "Acura", makeSlug: "acura", model: "RLX", modelSlug: "rlx" },
  { make: "Acura", makeSlug: "acura", model: "TLX", modelSlug: "tlx" },
  { make: "Audi", makeSlug: "audi", model: "A3", modelSlug: "a3" },
  { make: "Audi", makeSlug: "audi", model: "A4", modelSlug: "a4" },
  { make: "Audi", makeSlug: "audi", model: "A6", modelSlug: "a6" },
  { make: "Audi", makeSlug: "audi", model: "Q5", modelSlug: "q5" },
  { make: "Audi", makeSlug: "audi", model: "Q7", modelSlug: "q7" },
  { make: "BMW", makeSlug: "bmw", model: "3 Series", modelSlug: "3-series" },
  { make: "BMW", makeSlug: "bmw", model: "X1", modelSlug: "x1" },
  { make: "BMW", makeSlug: "bmw", model: "5 Series", modelSlug: "5-series" },
  { make: "BMW", makeSlug: "bmw", model: "X3", modelSlug: "x3" },
  { make: "BMW", makeSlug: "bmw", model: "X5", modelSlug: "x5" },
  { make: "Cadillac", makeSlug: "cadillac", model: "CT4", modelSlug: "ct4" },
  { make: "Cadillac", makeSlug: "cadillac", model: "CT5", modelSlug: "ct5" },
  { make: "Cadillac", makeSlug: "cadillac", model: "Escalade", modelSlug: "escalade" },
  { make: "Cadillac", makeSlug: "cadillac", model: "Escalade ESV", modelSlug: "escalade-esv" },
  { make: "Cadillac", makeSlug: "cadillac", model: "XT5", modelSlug: "xt5" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Blazer", modelSlug: "blazer" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Colorado", modelSlug: "colorado" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Equinox", modelSlug: "equinox" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Equinox EV", modelSlug: "equinox-ev" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Malibu", modelSlug: "malibu" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Silverado 1500", modelSlug: "silverado-1500" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Suburban", modelSlug: "suburban" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Tahoe", modelSlug: "tahoe" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Traverse", modelSlug: "traverse" },
  { make: "Chrysler", makeSlug: "chrysler", model: "300", modelSlug: "300" },
  { make: "Chrysler", makeSlug: "chrysler", model: "Pacifica", modelSlug: "pacifica" },
  { make: "Chrysler", makeSlug: "chrysler", model: "Voyager", modelSlug: "voyager" },
  { make: "Dodge", makeSlug: "dodge", model: "Challenger", modelSlug: "challenger" },
  { make: "Dodge", makeSlug: "dodge", model: "Charger", modelSlug: "charger" },
  { make: "Dodge", makeSlug: "dodge", model: "Durango", modelSlug: "durango" },
  { make: "Dodge", makeSlug: "dodge", model: "Hornet", modelSlug: "hornet" },
  { make: "Ford", makeSlug: "ford", model: "Bronco", modelSlug: "bronco" },
  { make: "Ford", makeSlug: "ford", model: "Edge", modelSlug: "edge" },
  { make: "Ford", makeSlug: "ford", model: "Escape", modelSlug: "escape" },
  { make: "Ford", makeSlug: "ford", model: "Expedition", modelSlug: "expedition" },
  { make: "Ford", makeSlug: "ford", model: "Explorer", modelSlug: "explorer" },
  { make: "Ford", makeSlug: "ford", model: "F-150", modelSlug: "f-150" },
  { make: "Ford", makeSlug: "ford", model: "Fusion", modelSlug: "fusion" },
  { make: "Ford", makeSlug: "ford", model: "Maverick", modelSlug: "maverick" },
  { make: "Ford", makeSlug: "ford", model: "Mustang", modelSlug: "mustang" },
  { make: "Ford", makeSlug: "ford", model: "Mustang Mach-E", modelSlug: "mustang-mach-e" },
  { make: "Ford", makeSlug: "ford", model: "Ranger", modelSlug: "ranger" },
  { make: "Genesis", makeSlug: "genesis", model: "GV70", modelSlug: "gv70" },
  { make: "Genesis", makeSlug: "genesis", model: "GV80", modelSlug: "gv80" },
  { make: "GMC", makeSlug: "gmc", model: "Acadia", modelSlug: "acadia" },
  { make: "GMC", makeSlug: "gmc", model: "Canyon", modelSlug: "canyon" },
  { make: "GMC", makeSlug: "gmc", model: "Sierra 1500", modelSlug: "sierra-1500" },
  { make: "GMC", makeSlug: "gmc", model: "Terrain", modelSlug: "terrain" },
  { make: "GMC", makeSlug: "gmc", model: "Yukon", modelSlug: "yukon" },
  { make: "Honda", makeSlug: "honda", model: "Accord", modelSlug: "accord" },
  { make: "Honda", makeSlug: "honda", model: "Civic", modelSlug: "civic" },
  { make: "Honda", makeSlug: "honda", model: "CR-V", modelSlug: "cr-v" },
  { make: "Honda", makeSlug: "honda", model: "Odyssey", modelSlug: "odyssey" },
  { make: "Honda", makeSlug: "honda", model: "Passport", modelSlug: "passport" },
  { make: "Honda", makeSlug: "honda", model: "Pilot", modelSlug: "pilot" },
  { make: "Honda", makeSlug: "honda", model: "Ridgeline", modelSlug: "ridgeline" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Elantra", modelSlug: "elantra" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Ioniq 5", modelSlug: "ioniq-5" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Kona", modelSlug: "kona" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Palisade", modelSlug: "palisade" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Santa Fe", modelSlug: "santa-fe" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Sonata", modelSlug: "sonata" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Tucson", modelSlug: "tucson" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Venue", modelSlug: "venue" },
  { make: "Infiniti", makeSlug: "infiniti", model: "Q50", modelSlug: "q50" },
  { make: "Infiniti", makeSlug: "infiniti", model: "QX50", modelSlug: "qx50" },
  { make: "Infiniti", makeSlug: "infiniti", model: "QX60", modelSlug: "qx60" },
  { make: "Infiniti", makeSlug: "infiniti", model: "QX80", modelSlug: "qx80" },
  { make: "Jeep", makeSlug: "jeep", model: "Cherokee", modelSlug: "cherokee" },
  { make: "Jeep", makeSlug: "jeep", model: "Compass", modelSlug: "compass" },
  { make: "Jeep", makeSlug: "jeep", model: "Gladiator", modelSlug: "gladiator" },
  { make: "Jeep", makeSlug: "jeep", model: "Grand Cherokee", modelSlug: "grand-cherokee" },
  { make: "Jeep", makeSlug: "jeep", model: "Renegade", modelSlug: "renegade" },
  { make: "Jeep", makeSlug: "jeep", model: "Wrangler", modelSlug: "wrangler" },
  { make: "Kia", makeSlug: "kia", model: "EV6", modelSlug: "ev6" },
  { make: "Kia", makeSlug: "kia", model: "Forte", modelSlug: "forte" },
  { make: "Kia", makeSlug: "kia", model: "Niro", modelSlug: "niro" },
  { make: "Kia", makeSlug: "kia", model: "Seltos", modelSlug: "seltos" },
  { make: "Kia", makeSlug: "kia", model: "Sorento", modelSlug: "sorento" },
  { make: "Kia", makeSlug: "kia", model: "Soul", modelSlug: "soul" },
  { make: "Kia", makeSlug: "kia", model: "Sportage", modelSlug: "sportage" },
  { make: "Kia", makeSlug: "kia", model: "Telluride", modelSlug: "telluride" },
  { make: "Lexus", makeSlug: "lexus", model: "ES", modelSlug: "es" },
  { make: "Lexus", makeSlug: "lexus", model: "NX", modelSlug: "nx" },
  { make: "Mitsubishi", makeSlug: "mitsubishi", model: "Outlander", modelSlug: "outlander" },
  { make: "Mini", makeSlug: "mini", model: "Cooper", modelSlug: "cooper" },
  { make: "Lexus", makeSlug: "lexus", model: "RX", modelSlug: "rx" },
  { make: "Mazda", makeSlug: "mazda", model: "CX-5", modelSlug: "cx-5" },
  { make: "Mazda", makeSlug: "mazda", model: "CX-50", modelSlug: "cx-50" },
  { make: "Mazda", makeSlug: "mazda", model: "Mazda3", modelSlug: "mazda3" },
  { make: "Mercedes-Benz", makeSlug: "mercedes-benz", model: "C-Class", modelSlug: "c-class" },
  { make: "Mercedes-Benz", makeSlug: "mercedes-benz", model: "E-Class", modelSlug: "e-class" },
  { make: "Mercedes-Benz", makeSlug: "mercedes-benz", model: "GLC", modelSlug: "glc" },
  { make: "Mercedes-Benz", makeSlug: "mercedes-benz", model: "GLE", modelSlug: "gle" },
  { make: "Nissan", makeSlug: "nissan", model: "Altima", modelSlug: "altima" },
  { make: "Nissan", makeSlug: "nissan", model: "Frontier", modelSlug: "frontier" },
  { make: "Nissan", makeSlug: "nissan", model: "Kicks", modelSlug: "kicks" },
  { make: "Nissan", makeSlug: "nissan", model: "Murano", modelSlug: "murano" },
  { make: "Nissan", makeSlug: "nissan", model: "Pathfinder", modelSlug: "pathfinder" },
  { make: "Nissan", makeSlug: "nissan", model: "Rogue", modelSlug: "rogue" },
  { make: "Nissan", makeSlug: "nissan", model: "Sentra", modelSlug: "sentra" },
  { make: "Nissan", makeSlug: "nissan", model: "Titan", modelSlug: "titan" },
  { make: "Porsche", makeSlug: "porsche", model: "911", modelSlug: "911" },
  { make: "Porsche", makeSlug: "porsche", model: "Cayenne", modelSlug: "cayenne" },
  { make: "Porsche", makeSlug: "porsche", model: "Macan", modelSlug: "macan" },
  { make: "Ram", makeSlug: "ram", model: "1500", modelSlug: "1500" },
  { make: "Ram", makeSlug: "ram", model: "2500", modelSlug: "2500" },
  { make: "Ram", makeSlug: "ram", model: "3500", modelSlug: "3500" },
  { make: "Rivian", makeSlug: "rivian", model: "R1S", modelSlug: "r1s" },
  { make: "Rivian", makeSlug: "rivian", model: "R1T", modelSlug: "r1t" },
  { make: "Subaru", makeSlug: "subaru", model: "Ascent", modelSlug: "ascent" },
  { make: "Subaru", makeSlug: "subaru", model: "Crosstrek", modelSlug: "crosstrek" },
  { make: "Subaru", makeSlug: "subaru", model: "Forester", modelSlug: "forester" },
  { make: "Subaru", makeSlug: "subaru", model: "Impreza", modelSlug: "impreza" },
  { make: "Subaru", makeSlug: "subaru", model: "Legacy", modelSlug: "legacy" },
  { make: "Subaru", makeSlug: "subaru", model: "Outback", modelSlug: "outback" },
  { make: "Tesla", makeSlug: "tesla", model: "Model 3", modelSlug: "model-3" },
  { make: "Tesla", makeSlug: "tesla", model: "Model S", modelSlug: "model-s" },
  { make: "Tesla", makeSlug: "tesla", model: "Model X", modelSlug: "model-x" },
  { make: "Tesla", makeSlug: "tesla", model: "Model Y", modelSlug: "model-y" },
  { make: "Toyota", makeSlug: "toyota", model: "4Runner", modelSlug: "4runner" },
  { make: "Toyota", makeSlug: "toyota", model: "Prius", modelSlug: "prius" },
  { make: "Toyota", makeSlug: "toyota", model: "Camry", modelSlug: "camry" },
  { make: "Toyota", makeSlug: "toyota", model: "Corolla", modelSlug: "corolla" },
  { make: "Toyota", makeSlug: "toyota", model: "Highlander", modelSlug: "highlander" },
  { make: "Toyota", makeSlug: "toyota", model: "RAV4", modelSlug: "rav4" },
  { make: "Toyota", makeSlug: "toyota", model: "Sienna", modelSlug: "sienna" },
  { make: "Toyota", makeSlug: "toyota", model: "Tacoma", modelSlug: "tacoma" },
  { make: "Toyota", makeSlug: "toyota", model: "Tundra", modelSlug: "tundra" },
  { make: "Volkswagen", makeSlug: "volkswagen", model: "Atlas", modelSlug: "atlas" },
  { make: "Volkswagen", makeSlug: "volkswagen", model: "Golf GTI", modelSlug: "golf-gti" },
  { make: "Volkswagen", makeSlug: "volkswagen", model: "ID.4", modelSlug: "id4" },
  { make: "Volkswagen", makeSlug: "volkswagen", model: "Jetta", modelSlug: "jetta" },
  { make: "Volkswagen", makeSlug: "volkswagen", model: "Taos", modelSlug: "taos" },
  { make: "Volkswagen", makeSlug: "volkswagen", model: "Tiguan", modelSlug: "tiguan" },
  { make: "Volvo", makeSlug: "volvo", model: "S60", modelSlug: "s60" },
  { make: "Volvo", makeSlug: "volvo", model: "S90", modelSlug: "s90" },
  { make: "Volvo", makeSlug: "volvo", model: "V60", modelSlug: "v60" },
  { make: "Volvo", makeSlug: "volvo", model: "XC40", modelSlug: "xc40" },
  { make: "Volvo", makeSlug: "volvo", model: "XC60", modelSlug: "xc60" },
  { make: "Volvo", makeSlug: "volvo", model: "XC90", modelSlug: "xc90" },
];

export default function VehiclesPage() {
  // Group by make, preserving brand order
  const grouped = new Map<string, typeof vehicles>();
  for (const v of vehicles) {
    if (!grouped.has(v.make)) grouped.set(v.make, []);
    grouped.get(v.make)!.push(v);
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-6xl mx-auto px-5 py-6 flex-1 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-text-muted font-heading" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3 h-3 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24" width={12} height={12}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-text-secondary">Vehicles</span>
        </nav>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-3">Browse Vehicles</h1>
          <p className="text-text-muted text-sm sm:text-base max-w-xl">Find repair costs, OBD codes, and diagnostics for your specific make and model.</p>
        </div>

        {Array.from(grouped.entries()).map(([make, models]) => (
          <section key={make} className="mb-8">
            <h2 className="text-lg font-heading font-bold text-text-primary mb-3 flex items-center gap-2">
              {make}
              <span className="text-xs font-normal text-text-muted">({models.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {models.map((v) => {
                const img = getVehicleImageUrl(v.makeSlug, v.modelSlug);
                return (
                  <Link
                    key={`${v.makeSlug}/${v.modelSlug}`}
                    href={`/vehicles/${v.makeSlug}/${v.modelSlug}`}
                    className="group bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5 transition-all overflow-hidden"
                  >
                    <div className="aspect-[4/3] bg-surface-2 overflow-hidden">
                      {img && <img src={img} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-heading font-semibold text-text-primary group-hover:text-primary transition-colors truncate">{v.model}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
