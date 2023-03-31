import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MapContainer } from 'react-leaflet';
import { TileLayer } from 'react-leaflet';
import { Marker } from 'react-leaflet';
import { Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';

// Init position to center map
const position: LatLngTuple = [32.9011791237137, -117.33099401826159];

// Color for the flight path
const limeOptions = { color: 'lime' }

// Initialize with an empty list of lat/lon poitions.
const initPos: LatLngExpression[] = []

function App() {

  const [objectList, setObjectList] = useState([]);
  const [flightPathPos, setFlightPathPos] = useState(initPos);

  /**
   * Load the flight path and objects
   * at startup from JSON files locally.
   */
  useEffect(() => {
    loadFlightPathData();
    loadObjectData();
  }, []);

  /**
   * Read in the JSON file containing the flight path data.
   */
  async function loadFlightPathData() {
    await fetch(`paths.json`)
      .then(response => response.json())
      .then(data => {
        processFlightData(data);
      })

  }

  /**
   * Get the coordinates for each point in the flight path.
   * This will use the first point in each bounding box.
   * @param data Json Data containing flight path.
   */
  function processFlightData(data: any) {
    let posLine: LatLngExpression[] = []
    for (let x = 0; x < data.length; x++) {
      // Reverse the order
      // Use the first point in the bounding box 
      let latlon: LatLngTuple = [data[x].coordinates[0][1], data[x].coordinates[0][0]];
      posLine.push(latlon);
    }

    setFlightPathPos(posLine);
  }

  /**
   * Read in the JSON file containing the object data.
   */
  async function loadObjectData() {
    await fetch(`objects.json`)
      .then(response => response.json())
      .then(data => {
        processObjectData(data);
      })

  }

  /**
   * Get the coordinates for each point in the flight path.
   * This will use the first point in each bounding box.
   * @param data Json Data containing flight path.
   */
  function processObjectData(data: any) {
    let markers: any = []
    for (let x = 0; x < data.length; x++) {
      // Reverse the order
      // Use the first point in the bounding box 
      let latlon: LatLngTuple = [data[x].coordinates[0][0][1], data[x].coordinates[0][0][0]];
      let marker = {
        lat: data[x].coordinates[0][0][1],
        lon: data[x].coordinates[0][0][0],
        key: data[x].id,
      }
      markers.push(marker);
    }
    console.log(markers);
    setObjectList(markers);
  }


  return (
    <div className="App">
      <header className="App-header">

        <MapContainer center={position} zoom={9} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {objectList.map((item: any, index) => (
            <Marker
              position={[item.lat, item.lon]}
              key={item.key}>
              <Popup>
                <strong>
                  {item.key}
                </strong>
              </Popup>
            </Marker>
          ))
          }
          <Polyline pathOptions={limeOptions} positions={flightPathPos} />
        </MapContainer>

      </header>
    </div>
  );
}

export default App;
