import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locations as locations2024 } from './locations'; // Import 2024 locations data
import { locations2025 } from './locations2025'; // Import 2025 locations data

// Years available
const YEARS = {
  2024: locations2024,
  2025: locations2025
};

// Monument categories
const CATEGORIES = {
  BATTLEFIELD: 'Battlefields',
  MILITARY_CEMETERY: 'Military Cemeteries',
  WAR_MEMORIAL_GROUP: 'War Memorials (Group)',
  WAR_MEMORIAL_INDIVIDUAL: 'War Memorials (Individual)',
  PEACE_MEMORIAL: 'Peace Memorials',
  VA_HOSPITAL: 'VA Hospitals',
  MILITARY_CORPORATION: 'Military Corporations',
  MILITARY_BASE: 'Military Bases',
  OTHER: 'Other'
};

// Custom icons for each category
const CATEGORY_ICONS = {
  'Battlefields': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  }),
  'Military Cemeteries': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  }),
  'War Memorials (Group)': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  }),
  'War Memorials (Individual)': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  }),
  'Peace Memorials': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  }),
  'VA Hospitals': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  }),
  'Military Corporations': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  }),
  'Military Bases': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  }),
  'Other': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  })
};

function CenterMap({ position, zoom }) {
  const map = useMap();
  map.setView(position, zoom);
  return null;
}

export default function MonumentMaps() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2024);

  // Filter locations based on the search query, selected category, and year
  const filteredLocations = YEARS[selectedYear].filter((location) => {
    const matchesSearch = 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (location.address && location.address.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || location.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle click on a search result
  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div style={{ height: '100vh' }}>
      {/* Year selector bar at top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#2c3e50',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          {Object.keys(YEARS).map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(Number(year))}
              style={{
                padding: '8px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedYear === Number(year) ? '#3498db' : '#34495e',
                color: 'white',
                transition: 'background-color 0.3s ease'
              }}
            >
              {year} Map
            </button>
          ))}
        </div>
      </div>

      {/* Search Controls - adjusted top margin to account for year selector */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '250px',
              marginBottom: '8px'
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '250px',
              marginBottom: '8px'
            }}
          >
            <option value="">All Categories</option>
            {Object.values(CATEGORIES).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {searchQuery && (
          <ul
            style={{
              listStyleType: 'none',
              padding: '0',
              margin: '5px 0 0 0',
              maxHeight: '300px',
              overflowY: 'auto',
              width: '250px',
            }}
          >
            {filteredLocations.map((location, index) => (
              <li
                key={index}
                onClick={() => handleLocationClick(location)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  backgroundColor:
                    selectedLocation === location ? '#f0f0f0' : 'white',
                  borderBottom: '1px solid #eee',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{location.name}</div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  {location.address}
                </div>
                <div style={{ fontSize: '0.8em', color: '#888' }}>
                  {location.category}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Legend at bottom left */}
      <div style={{ 
        position: 'absolute',
        bottom: '20px',
        left: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        width: '200px',
      }}>
        <button
          onClick={() => setIsLegendVisible(!isLegendVisible)}
          style={{
            width: '100%',
            padding: '8px',
            border: 'none',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            backgroundColor: '#e9ecef',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          <span>Legend</span>
          <span style={{ 
            transform: isLegendVisible ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}>▼</span>
        </button>
        <div style={{ 
          maxHeight: isLegendVisible ? '500px' : '0',
          transition: 'max-height 0.3s ease-in-out',
          overflow: 'hidden',
          padding: isLegendVisible ? '8px' : '0 8px',
          backgroundColor: '#f8f9fa',
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
        }}>
          {Object.values(CATEGORIES).map((category) => (
            <div key={category} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '2px',
              opacity: isLegendVisible ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              fontSize: '12px',
            }}>
              <img 
                src={CATEGORY_ICONS[category].options.iconUrl} 
                alt={category}
                style={{ width: '12px', height: '20px', marginRight: '4px' }}
              />
              <span>{category}</span>
            </div>
          ))}
        </div>
      </div>

      <MapContainer
        center={[41.6032, -73.0877]} // Center of Connecticut
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredLocations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            icon={CATEGORY_ICONS[location.category] || CATEGORY_ICONS['Other']}
            eventHandlers={{
              click: () => handleLocationClick(location),
            }}
          >
            <Popup>
              <div>
                <strong>{location.name}</strong>
                <br />
                {location.description && (
                  <>
                    {location.description}
                    <br />
                  </>
                )}
                <em>{location.address}</em>
                <br />
                <span style={{ color: '#666', fontSize: '0.9em' }}>
                  {location.category}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
        {selectedLocation && (
          <CenterMap
            position={[selectedLocation.lat, selectedLocation.lng]}
            zoom={12}
          />
        )}
      </MapContainer>
    </div>
  );
}
