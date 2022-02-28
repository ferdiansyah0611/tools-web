import {
	useNavigate
} from 'react-router-dom'
import { useState } from 'react'
import logo from '@/logo.svg'

export default function Home(){
  const [count, setCount] = useState(0)
  const to = useNavigate()
	return(
		<div>
			<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React + React Router Dom + Redux Toolkit!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
          <button onClick={() => to('about')}>Go About</button>
        </p>
        <p>
          Edit <code>App.jsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
		</div>
	)
}