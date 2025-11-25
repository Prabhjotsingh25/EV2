import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

// Fix for default leaflet marker icon
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIcon2xPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new Icon({
  iconUrl: markerIconPng,
  iconRetinaUrl: markerIcon2xPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface EventMapProps {
  events: any[];
}

export const EventMap = ({ events }: EventMapProps) => {
  // Default center (e.g., New York or your preferred default)
  const defaultCenter: [number, number] = [40.7128, -74.0060];
  
  // Filter events that have coordinates
  const eventsWithRx = events.filter(e => e.latitude && e.longitude);

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border shadow-sm">
      <MapContainer 
        center={eventsWithRx[0] ? [eventsWithRx[0].latitude, eventsWithRx[0].longitude] : defaultCenter} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {eventsWithRx.map((event) => (
          <Marker 
            key={event.id} 
            position={[event.latitude, event.longitude]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{event.location}</p>
                <Button asChild size="sm" className="w-full">
                  <Link to={`/register?event=${event.id}`}>View Event</Link>
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};