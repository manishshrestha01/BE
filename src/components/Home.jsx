import { BackgroundProvider } from '../context/BackgroundContext'
import Desktop from './Desktop/Desktop'
import '../styles/glass.css'

const Home = () => {
  return (
    <BackgroundProvider>
      <Desktop />
    </BackgroundProvider>
  )
}

export default Home