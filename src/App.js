import React from 'react';

import Map from './Components/OpenLayer'
import MapControl from './Components/MapControl'

function App() {
  return (
    <div className="App">
      <MapControl />
      <Map />
    </div>
  );
}

export default App;
