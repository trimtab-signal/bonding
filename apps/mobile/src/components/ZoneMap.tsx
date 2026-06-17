import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ZONES, type ZoneId } from '@bonding/shared-types';

// Default location (can be overridden by user's actual GPS)
const DEFAULT_CENTER: [number, number] = [-122.4194, 37.7749]; // SF

interface ZoneMapProps {
  onZoneSelect?: (zoneId: ZoneId) => void;
  selectedZone?: ZoneId | null;
  userLocation?: [number, number] | null;
}

export function ZoneMap({ onZoneSelect, selectedZone, userLocation }: ZoneMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // free demo tiles
      center: DEFAULT_CENTER,
      zoom: 13,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // Add zone circles
      Object.values(ZONES).forEach((zone) => {
        map.addSource(`zone-${zone.id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [zone.lng, zone.lat],
            },
          },
        });

        map.addLayer({
          id: `zone-circle-${zone.id}`,
          type: 'circle',
          source: `zone-${zone.id}`,
          paint: {
            'circle-radius': zone.radiusMeters / 10,
            'circle-color': zone.color,
            'circle-opacity': 0.2,
            'circle-stroke-width': 2,
            'circle-stroke-color': zone.color,
          },
        });

        map.on('click', `zone-circle-${zone.id}`, () => {
          onZoneSelect?.(zone.id);
        });
      });

      // Add zone labels
      Object.values(ZONES).forEach((zone) => {
        const el = document.createElement('div');
        el.className = 'zone-label';
        el.textContent = `${zone.emoji} ${zone.name}`;
        el.style.cssText = `
          background: ${zone.color}22;
          border: 1px solid ${zone.color};
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 12px;
          color: ${zone.color};
          cursor: pointer;
          backdrop-filter: blur(4px);
        `;
        el.addEventListener('click', () => onZoneSelect?.(zone.id));

        new maplibregl.Marker({ element: el })
          .setLngLat([zone.lng, zone.lat])
          .addTo(map);
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const el = document.createElement('div');
    el.style.cssText = `
      width: 16px; height: 16px;
      background: #4fc3f7;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(79, 195, 247, 0.6);
    `;

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat(userLocation)
      .addTo(mapRef.current);
    markersRef.current.push(marker);
    mapRef.current.flyTo({ center: userLocation, zoom: 14 });
  }, [userLocation]);

  const zoneDefs = Object.values(ZONES);
  const zonesRow = (
    <div style={{
      position: 'absolute', bottom: 24, left: 16, right: 16,
      display: 'flex', gap: 8, justifyContent: 'center', zIndex: 10,
    }}>
      {zoneDefs.map(zone => (
        <button
          key={zone.id}
          onClick={() => onZoneSelect?.(zone.id)}
          style={{
            background: selectedZone === zone.id ? zone.color : `${zone.color}44`,
            border: `2px solid ${zone.color}`,
            borderRadius: 12,
            padding: '8px 14px',
            color: selectedZone === zone.id ? '#fff' : zone.color,
            fontSize: 14,
            fontWeight: selectedZone === zone.id ? 700 : 400,
            cursor: 'pointer',
            transition: 'all .2s',
            flex: 1,
            maxWidth: 80,
            textAlign: 'center',
          }}
        >
          {zone.emoji}<br />
          {zone.name}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      {zonesRow}
    </div>
  );
}
