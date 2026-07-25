import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

const MapComponent = ({
  location,
  setSelectedLocation,
  defaultOption,
  zoomControl = true,
  zoom = 4,
}) => {
  const { lat, lng } = location;

  if (!lat || !lng) {
    return <p>No location data available</p>;
  }

  const MapClickHandler = () => {
    useMapEvents({
      async click(e) {
        if (setSelectedLocation) {
          const { lat, lng } = e.latlng;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            const addr = data?.display_name
              ? data.display_name.split(",").slice(0, 4).join(",").trim()
              : `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
            setSelectedLocation({ lat, lng, address: addr });
          } catch (err) {
            setSelectedLocation({
              lat,
              lng,
              address: `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
            });
          }
        }
      },
    });
    return null;
  };

  const mapKey = `${lat}-${lng}`;

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ height: "500px", width: "100%" }}
    >
      <MapContainer
        key={mapKey}
        center={[lat, lng]}
        zoom={location ? zoom : 2}
        scrollWheelZoom={true}
        style={{ height: "500px", width: "100%", borderRadius: "10px" }}
        className="cursor-crosshair"
        zoomControl={zoomControl}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[lat, lng]}>
          <Popup>Selected Location</Popup>
        </Marker>

        <MapClickHandler />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
