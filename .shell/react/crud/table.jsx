import React from 'react'
import {
	useDispatch, useSelector
} from 'react-redux'
import {
	useNavigate, useParams, Navigate, Link
} from 'react-router-dom'
import {storenameShow, storenameDelete} from '@s/storename'

export default function nameTable() {
	const to = useNavigate()
	const dispatch = useDispatch()
	// handle
	const [error, seterror] = React.useState('')
	// list store
	const data = useSelector((data) => data.storename.data)
	// remove data
	const remove = React.useCallback((e, value) => {
		e.preventDefault()
		(async() => {
			try{
				var res = await dispatch(storenameDelete(value))
			}catch(e){
				seterror(e.message)
			}
		})()
	}, [])
	return(
		<div>
			{
				error && <div className="alert-error">{error}</div>
			}
			<section className="table">
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>action</th>
						</tr>
					</thead>
					<tbody>
						{data.map((value) => (
							<tr key={value.id}>
								<td>{value.id}</td>
								<td>
									<Link to={'/storename/' + value.id + '/edit'}>edit</Link>
									<a href="/" onClick={(e) => remove(e, value)}>delete</a>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</div>
	)
}