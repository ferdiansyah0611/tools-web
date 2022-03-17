import { createTheme } from '@mui/material/styles'
import {
  green,
  pink, red, blue, purple, deepPurple, indigo, lightBlue, cyan, teal,
  lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey
} from '@mui/material/colors'

export const color = [
	'primary', 'secondary', 'red', 'pink', 'purple', 'deep purple', 'indigo', 'blue',
	'light blue', 'cyan', 'teal', 'green', 'light green', 'lime', 'yellow', 'amber',
	'orange', 'deep orange', 'brown', 'grey', 'blue grey'
]

export default function palette(mode) {
	const config = createTheme({
		palette: {
			mode: mode,
			primary: {
				main: '#6C63FF',
			},
			secondary: {
				main: green[500],
			},
			error: {
				main: red[500]
			},
			white: {
				main: '#ffffff',
				dark: '#000000'
			},
			backdrop: {
				main: '#ffffffa6',
				dark: '#000000'
			},
			red: {
				main: red[500],
				contrastText: '#fff'
			},
			pink: {
				main: pink[500],
				contrastText: '#fff'
			},
			purple: {
				main: purple[500],
				contrastText: '#fff'
			},
			'deep purple': {
				main: deepPurple[500],
				contrastText: '#fff'
			},
			indigo: {
				main: indigo[500],
				contrastText: '#fff'
			},
			blue: {
				main: blue[500],
				contrastText: '#fff'
			},
			'light blue': {
				main: lightBlue[500],
				contrastText: '#fff'
			},
			cyan: {
				main: cyan[500],
				contrastText: '#fff'
			},
			teal: {
				main: teal[500],
				contrastText: '#fff'
			},
			green: {
				main: green[500],
				contrastText: '#fff'
			},
			'light green': {
				main: lightGreen[500],
				contrastText: '#fff'
			},
			lime: {
				main: lime[500],
				contrastText: '#fff'
			},
			yellow: {
				main: yellow[500],
				contrastText: '#fff'
			},
			amber: {
				main: amber[500],
				contrastText: '#fff'
			},
			orange: {
				main: orange[500],
				contrastText: '#fff'
			},
			'deep orange': {
				main: deepOrange[500],
				contrastText: '#fff'
			},
			brown: {
				main: brown[500],
				contrastText: '#fff'
			},
			grey: {
				main: grey[500],
				contrastText: '#fff'
			},
			'blue grey': {
				main: blueGrey[500],
				contrastText: '#fff'
			},
		},
	})
	return config
}