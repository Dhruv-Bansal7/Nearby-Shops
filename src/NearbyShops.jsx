import React, { useEffect, useState } from 'react';

const NearbyShops = () => {
  const [location, setLocation] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(1000);

  const fetchNearbyShops = async (lat, lon , radius) => {
    
    const query = `
      [out:json];
      node["shop"](around:${radius},${lat},${lon});
      out;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    
    try {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      setShops(data.elements);
    } catch (error) {
      setError('Error fetching data from Overpass API');
      console.error("Error fetching data from Overpass API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (err) => setError('Could not retrieve location.')
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyShops(location.lat, location.lon , radius);
    }
  }, [location , radius]);

  const handleRadiusChange = (e) => {
    setRadius(Number(e.target.value));
  };

  return (
    <div>
      <h1>Nearby Shops</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        Enter radius (in meters):&nbsp;
        <input
          type="number"
          value={radius}
          onChange={handleRadiusChange}
          min="100"
          max="5000"
          step="100"
          style={{ margin: '10px', padding: '5px' }}
        />
      </label>
      {loading && <p>Loading shops...</p>}
      {!loading && !error && shops.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent : 'center' }}>
          {shops.map((shop) => (
            <div
              key={shop.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '20px',
                width: '250px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <img
                src="https://via.placeholder.com/100" // Placeholder image
                alt="Shop Placeholder"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <h3 style={{margin : '10px'}}>{shop.tags.name || 'Unnamed Shop'}</h3>
              <p style={{margin :'10px'}}>Type: {shop.tags.shop}</p>
              <p style={{margin :'10px'}}>
                Location : 
                <a
                  href={`https://www.openstreetmap.org/?mlat=${shop.lat}&mlon=${shop.lon}#map=18/${shop.lat}/${shop.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'skyblue' }}
                >
                View on Map
                </a>
              </p>
              <p style={{margin :'10px'}}>
                Coordinates: ({shop.lat.toFixed(4)}, {shop.lon.toFixed(4)})
              </p>
            </div>
          ))}
        </div>
      )}
      {!loading && shops.length === 0 && !error && (
        <p>No shops found nearby.</p>
      )}
    </div>
  );
};

export default NearbyShops;
