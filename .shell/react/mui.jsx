import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import palette from '@service/color'

function mui(props){
	const stateTheme = useSelector(state => state.theme)

	const theme = useMemo(() => {
    return palette(stateTheme.theme)
  }, [stateTheme.theme])
	return(
		<>
			<CssBaseline/>
	    <ThemeProvider theme={theme}>
	      {props.children}
	    </ThemeProvider>
    </>
	)
}