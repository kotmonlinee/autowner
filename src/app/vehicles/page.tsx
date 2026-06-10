import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getVehicleImageUrl } from "@/lib/vehicle-images";

export const metadata: Metadata = {
  title: "Browse Vehicles by Make & Model",
  description: "Find repair costs, OBD codes, and diagnostics for your specific vehicle.",
  alternates: { canonical: "https://www.autowner.com/vehicles" },
};

const vehicles = [
  { make: "Acura", makeSlug: "acura", model: "MDX", modelSlug: "mdx" },
  { make: "Acura", makeSlug: "acura", model: "RDX", modelSlug: "rdx" },
  { make: "Audi", makeSlug: "audi", model: "A3", modelSlug: "a3" },
  { make: "Audi", makeSlug: "audi", model: "A4", modelSlug: "a4" },
  { make: "Audi", makeSlug: "audi", model: "Q5", modelSlug: "q5" },
  { make: "BMW", makeSlug: "bmw", model: "3 Series", modelSlug: "3-series" },
  { make: "BMW", makeSlug: "bmw", model: "X5", modelSlug: "x5" },
  { make: "Cadillac", makeSlug: "cadillac", model: "Escalade", modelSlug: "escalade" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Equinox", modelSlug: "equinox" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Malibu", modelSlug: "malibu" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Silverado 1500", modelSlug: "silverado-1500" },
  { make: "Chevrolet", makeSlug: "chevrolet", model: "Tahoe", modelSlug: "tahoe" },
  { make: "Chrysler", makeSlug: "chrysler", model: "Pacifica", modelSlug: "pacifica" },
  { make: "Dodge", makeSlug: "dodge", model: "Charger", modelSlug: "charger" },
  { make: "Ford", makeSlug: "ford", model: "Bronco", modelSlug: "bronco" },
  { make: "Ford", makeSlug: "ford", model: "Escape", modelSlug: "escape" },
  { make: "Ford", makeSlug: "ford", model: "Explorer", modelSlug: "explorer" },
  { make: "Ford", makeSlug: "ford", model: "F-150", modelSlug: "f-150" },
  { make: "Ford", makeSlug: "ford", model: "Maverick", modelSlug: "maverick" },
  { make: "Ford", makeSlug: "ford", model: "Mustang", modelSlug: "mustang" },
  { make: "GMC", makeSlug: "gmc", model: "Sierra 1500", modelSlug: "sierra-1500" },
  { make: "Honda", makeSlug: "honda", model: "Accord", modelSlug: "accord" },
  { make: "Honda", makeSlug: "honda", model: "Civic", modelSlug: "civic" },
  { make: "Honda", makeSlug: "honda", model: "CR-V", modelSlug: "cr-v" },
  { make: "Honda", makeSlug: "honda", model: "Odyssey", modelSlug: "odyssey" },
  { make: "Honda", makeSlug: "honda", model: "Pilot", modelSlug: "pilot" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Elantra", modelSlug: "elantra" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Palisade", modelSlug: "palisade" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Santa Fe", modelSlug: "santa-fe" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Sonata", modelSlug: "sonata" },
  { make: "Hyundai", makeSlug: "hyundai", model: "Tucson", modelSlug: "tucson" },
  { make: "Jeep", makeSlug: "jeep", model: "Grand Cherokee", modelSlug: "grand-cherokee" },
  { make: "Jeep", makeSlug: "jeep", model: "Wrangler", modelSlug: "wrangler" },
  { make: "Kia", makeSlug: "kia", model: "Sorento", modelSlug: "sorento" },
  { make: "Kia", makeSlug: "kia", model: "Sportage", modelSlug: "sportage" },
  { make: "Kia", makeSlug: "kia", model: "Telluride", modelSlug: "telluride" },
  { make: "Lexus", makeSlug: "lexus", model: "ES", modelSlug: "es" },
  { make: "Lexus", makeSlug: "lexus", model: "NX", modelSlug: "nx" },
  { make: "Lexus", makeSlug: "lexus", model: "RX", modelSlug: "rx" },
  { make: "Mazda", makeSlug: "mazda", model: "CX-5", modelSlug: "cx-5" },
  { make: "Mazda", makeSlug: "mazda", model: "CX-50", modelSlug: "cx-50" },
  { make: "Mazda", makeSlug: "mazda", model: "Mazda3", modelSlug: "mazda3" },
  { make: "Mercedes-Benz", makeSlug: "mercedes-benz", model: "C-Class", modelSlug: "c-class" },
  { make: "Mercedes-Benz", makeSlug: "mercedes-benz", model: "E-Class", modelSlug: "e-class" },
  { make: "Mercedes-Benz", makeSlug: "mercedes-benz", model: "GLC", modelSlug: "glc" },
  { make: "Nissan", makeSlug: "nissan", model: "Altima", modelSlug: "altima" },
  { make: "Nissan", makeSlug: "nissan", model: "Pathfinder", modelSlug: "pathfinder" },
  { make: "Nissan", makeSlug: "nissan", model: "Rogue", modelSlug: "rogue" },
  { make: "Nissan", makeSlug: "nissan", model: "Sentra", modelSlug: "sentra" },
  { make: "Porsche", makeSlug: "porsche", model: "911", modelSlug: "911" },
  { make: "Porsche", makeSlug: "porsche", model: "Cayenne", modelSlug: "cayenne" },
  { make: "Porsche", makeSlug: "porsche", model: "Macan", modelSlug: "macan" },
  { make: "Ram", makeSlug: "ram", model: "1500", modelSlug: "1500" },
  { make: "Subaru", makeSlug: "subaru", model: "Ascent", modelSlug: "ascent" },
  { make: "Subaru", makeSlug: "subaru", model: "Crosstrek", modelSlug: "crosstrek" },
  { make: "Subaru", makeSlug: "subaru", model: "Forester", modelSlug: "forester" },
  { make: "Subaru", makeSlug: "subaru", model: "Outback", modelSlug: "outback" },
  { make: "Tesla", makeSlug: "tesla", model: "Model 3", modelSlug: "model-3" },
  { make: "Tesla", makeSlug: "tesla", model: "Model Y", modelSlug: "model-y" },
  { make: "Toyota", makeSlug: "toyota", model: "4Runner", modelSlug: "4runner" },
  { make: "Toyota", makeSlug: "toyota", model: "Camry", modelSlug: "camry" },
  { make: "Toyota", makeSlug: "toyota", model: "Corolla", modelSlug: "corolla" },
  { make: "Toyota", makeSlug: "toyota", model: "Highlander", modelSlug: "highlander" },
  { make: "Toyota", makeSlug: "toyota", model: "RAV4", modelSlug: "rav4" },
  { make: "Toyota", makeSlug: "toyota", model: "Sienna", modelSlug: "sienna" },
  { make: "Toyota", makeSlug: "toyota", model: "Tacoma", modelSlug: "tacoma" },
  { make: "Toyota", makeSlug: "toyota", model: "Tundra", modelSlug: "tundra" },
  { make: "Volkswagen", makeSlug: "volkswagen", model: "Atlas", modelSlug: "atlas" },
  { make: "Volkswagen", makeSlug: "volkswagen", model: "Golf GTI", modelSlug: "golf-gti" },
  { make: "Volkswagen", makeSlug: "volkswagen", model: "Jetta", modelSlug: "jetta" },
  { make: "Volkswagen", makeSlug: "volkswagen", model: "Tiguan", modelSlug: "tiguan" },
  { make: "Volvo", makeSlug: "volvo", model: "XC60", modelSlug: "xc60" },
  { make: "Volvo", makeSlug: "volvo", model: "XC90", modelSlug: "xc90" },
];

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main id="main-content" className="max-w-6xl mx-auto px-5 py-8 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-3">Browse Vehicles</h1>
          <p className="text-text-muted text-sm max-w-xl">Find repair costs, OBD codes, and diagnostics for your specific make and model.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {vehicles.map((v) => {
            const img = getVehicleImageUrl(v.makeSlug, v.modelSlug);
            return (
              <Link
                key={`${v.makeSlug}/${v.modelSlug}`}
                href={`/vehicles/${v.makeSlug}/${v.modelSlug}`}
                className="group bg-surface-1 rounded-xl border border-surface-border hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5 transition-all overflow-hidden"
              >
                <div className="aspect-[4/3] bg-surface-2 overflow-hidden">
                  {img && <img src={img} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                </div>
                <div className="p-3">
                  <p className="text-xs font-heading font-semibold text-text-primary group-hover:text-primary transition-colors truncate">{v.make} {v.model}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
