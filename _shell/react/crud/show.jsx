import React from 'react'
import {
	useDispatch, useSelector
} from 'react-redux'
import {
	useNavigate, useParams, Navigate, Link
} from 'react-router-dom'
import {storenameShow} from '@s/storename'

export default function storenameShow() {
	const {id} = useParams()
	const to = useNavigate()
	const dispatch = useDispatch()
	// show store
	const store = useSelector((data) => data.storename.data)
	const data = useMemo(() => {
		var find = store.find((value) => value.id === id)
		if(!find){
			(asyn() => {
				find = await dispatch(storenameShow(id))
				find = find.payload
			})()
		}
		return find || {}
	}, [])
	return(
		<section className="show">
			{/*show your data in here*/}

		</section>
	)
}