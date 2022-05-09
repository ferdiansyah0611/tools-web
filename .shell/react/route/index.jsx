import {
	BrowserRouter, Routes, Route, Outlet
} from 'react-router-dom'
import Template from '@component/template'
// dont remove this comment 1
import Home from './Home'
import About from './About'

export default function route(){
	return(
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Template/>}>
					<Route index element={<Home/>}/>
					<Route path="about" element={<About/>}/>
					{/*dont remove this comment 2*/}
				</Route>
			</Routes>
		</BrowserRouter>
	)
}