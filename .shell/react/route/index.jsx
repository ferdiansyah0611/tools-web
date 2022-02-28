import {
	BrowserRouter, Routes, Route, Outlet
} from 'react-router-dom'
import Template from '@c/template'
// route
import Home from './Home'
import About from './About'

export default function route(){
	return(
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Template/>}>
					<Route index element={<Home/>}/>
					<Route path="about" element={<About/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}