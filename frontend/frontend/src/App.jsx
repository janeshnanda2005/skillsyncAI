import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { AuthProvider } from '../components/Authcontext'
import viteLogo from './assets/vite.svg'
import Login from '../components/Login'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return(<>
    <AuthProvider>
      <div className="App">
        <Login/>
      </div>
    </AuthProvider>
  </>)
}

export default App
