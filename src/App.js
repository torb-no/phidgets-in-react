/* eslint-disable no-undef */
// We need to disable no-undef eslint rule since
// eslint doesn't know about phidgets

import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  // Use this to set the distance so we can display it in the UI
  const [distance, setDistance] = useState(-1);

  // We use this ref so we can access the led in the button event
  const ledRef = useRef();

  // useEffect hook since the Phidgets libary doens't work
  // in a functional style like React
  useEffect(() => {
    // Setup the connection
    const phidgetConnection = new phidget22.Connection({
      hostname: 'localhost',
      port: 8989,
    });

    // Keep a list of devices to we can close them later
    const phidgetDevices = [];

    // Connect to the Phidgets server
    phidgetConnection.connect().then(() => {
      console.log('Connected to Phidgets')

      // SETUP DISTANCE SENSOR
      const distanceSensor = new phidget22.DistanceSensor();

      // The way you add event handlers with phidgets is
      // by setting an event directly
      distanceSensor.onDistanceChange = function(distance) {
        setDistance(distance);
      };

      // Actually open the connection to the distance sensor
      distanceSensor.open().then(() => {
        // Add to list of devices to we can close it later
        phidgetDevices.push(distanceSensor);
      }).catch(err => {
        console.error('Error opening sensor: ' + err)
      });

      // SETUP THE LED
      const led = new phidget22.DigitalOutput();

      // We need to set these properties since
      // the LED is not a smart VINT device
      led.setHubPort(2);
      led.setIsHubPortDevice(true);

      led.open().then(() => {
        // Set ref so we can refer to it in the
        // button event handlers
        ledRef.current = led;

        // Add to devices so we can close it later 
        phidgetDevices.push(led);
      }).catch(err => {
        console.error('Error opening LED: ' + err);
      });

    }).catch(err => {
      console.error('Error during connect: ' + err);
    }) ;

    // Clean up after us
    return () => {
      // Important that devices are closed *before*
      // the connection
      phidgetDevices.forEach(pd => pd.close());
      phidgetConnection.close();
    };
  }, [])



  return (
    <div className="App">
      <p>Distance: {distance}</p>

      <button onClick={() => {
        ledRef.current.setState(true);
      }}>
        On
      </button>

      <button onClick={() => {
        ledRef.current.setState(false);
      }}>
        Off
      </button>
    </div>
  );
}

export default App;