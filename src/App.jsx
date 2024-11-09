import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NearbyShops from './NearbyShops';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <header className="App-header">
        <h1>Nearby Shops Finder</h1>
        <NearbyShops />
      </header>
    </div>
  )
}

export default App
