import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { api } from "../api/client";
import type { Facility } from "../types";

// Leaflet's default marker icons reference image files by relative path,
// which breaks under bundlers like Vite. Point them at a CDN instead —
// simplest fix for the backbone; can be swapped for local/custom icons later.
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// Rosario, Batangas — matches the seeded sample facility coordinates.
const DEFAULT_CENTER: [number, number] = [13.8459, 121.2044];

export function MapPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getFacilities()
      .then(setFacilities)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  return (
    <div>
      <h1>Nearby Facilities</h1>

      {error && <p>Error: {error}</p>}

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilities.map((f) => (
          <Marker key={f.id} position={[f.latitude, f.longitude]}>
            <Popup>
              <strong>{f.name}</strong>
              <br />
              {f.type}
              <br />
              {f.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {facilities.length === 0 && !error && <p>Loading...</p>}
    </div>
  );
}
