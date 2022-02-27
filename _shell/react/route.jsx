import React, {
	useState, useRef, useEffect, useMemo, useCallback, useReducer
} from 'react'
import {
	useDispatch, useSelector
} from 'react-redux'
import {
	useNavigate, Link, useParams, useLocation
} from 'react-router-dom'

export default function caseName() {
	const to = useNavigate()
	const dispatch = useDispatch()
	// const app = useSelector(state => state.app)
	return(
		<div>
			<p>this is caseName page</p>
		</div>
	)
}