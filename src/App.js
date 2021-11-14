/* eslint-disable no-undef */
// We need to disable no-undef eslint rule since
// eslint doesn't know about phidgets

import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [distance, setDistance] = useState(-1);

  const ledRef = useRef();

  useEffect(() => {
    const phidgetConnection = new phidget22.Connection({
      hostname: 'localhost',
      port: 8989,
    });

    phidgetConnection.connect().then(() => {
      console.log('Connected to Phidgets')

      const distanceSensor = new phidget22.DistanceSensor();
      distanceSensor.onDistanceChange = function(distance) {
        setDistance(distance);
      };

      distanceSensor.open().catch(err => {
        console.error('Error opening sensor: ' + err)
      });

      const led = new phidget22.DigitalOutput();
      led.setHubPort(2);
      led.setIsHubPortDevice(true);

      led.open().then(() => {
        ledRef.current = led;
      }).catch(err => {
        console.error('Error opening LED: ' + err);
      });

    }).catch(err => {
      console.error('Error during connect: ' + err);
    }) ;

    return () => {
      distanceSensor.close();
      led.close();
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