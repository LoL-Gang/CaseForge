import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FormScreen from './screens/FormScreen'
import ArchiveScreen from './screens/ArchiveScreen'
import Layout from './screens/Layout'
import AppRouter from './router';


function App() {
  const [count, setCount] = useState(0)

  return (<AppRouter />
    
    // <div className='h-screen w-screen'>
    // {/* <FormScreen/>
    // <ArchiveScreen items={sampleChatTiles} />  */}
    // <Layout />
    // </div>

  )
}

export default App





