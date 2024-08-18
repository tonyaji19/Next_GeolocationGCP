import React, { useState, useCallback } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Daftar libraries sebagai variabel statik
const libraries = ["places"];

const Geocoding = () => {
  const [address, setAddress] = useState(
    "1600 Amphitheatre Parkway, Mountain View, CA"
  );
  const [coordinates, setCoordinates] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const handleGeocode = useCallback(async () => {
    if (!apiKey) {
      console.error(
        "Missing Google Maps API key. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable."
      );
      return;
    }

    if (!isLoaded) {
      console.error("Google Maps API is not loaded yet.");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    try {
      const results = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (response, status) => {
          if (status === "OK") {
            resolve(response);
          } else {
            reject(new Error(`Geocode failed: ${status}`));
          }
        });
      });

      const location = results[0].geometry.location;
      setCoordinates({ lat: location.lat(), lng: location.lng() });
    } catch (error) {
      console.error(error);
    }
  }, [address, apiKey, isLoaded]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Geocoding Example</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          type="button"
          className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onClick={handleGeocode}
        >
          Geocode
        </button>
      </div>
      {!isLoaded ? (
        <p>Loading map...</p>
      ) : (
        <div className="h-96 w-full">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={coordinates || { lat: -3.745, lng: -38.523 }}
            zoom={14}
          >
            {coordinates && <Marker position={coordinates} />}
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

export default Geocoding;
