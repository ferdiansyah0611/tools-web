import React from 'react'
import {
	useDispatch, useSelector
} from 'react-redux'
import {
	useNavigate, Link, useParams, useLocation
} from 'react-router-dom'
import {storenameAdd, storenameUpdate, storenameShow} from '@s/storename'

export default function nameCreateOrEdit(props) {
	const to = useNavigate()
	const {id} = useParams()
	const dispatch = useDispatch()
	const storename = useSelector(state => state.storename.data)
	// handle
	const [error, seterror] = React.useState('')
	const [onsubmit, setonsubmit] = React.useState(false)
	// change your field input
	const [input, setinput] = React.useState({
		username: ''
	})
	// if edit
	React.useEffect(() => {
		(async() => {
			if(id){
				var find
				find = storename.find((v) => v.id === id)
				// if not in the store
				if(!find){
					find = await dispatch(storenameShow(id))
					find = find.payload.data
				}
				if(find){
					setinput({
						...input,
						...find
					})
				}
			}
		})()
	}, [storename, id])
	// input change
	const change = (e) => setinput({...input, [e.target.name]: e.target.value})
	// submit form
	const submit = (e) => {
		e.preventDefault()
		try{
			setonsubmit(true)
			if(id){
				await dispatch(storenameUpdate({...input, id: id}))
				console.log('Edited')
			}else{
				await dispatch(storenameAdd(input))
				console.log('Saved')
			}
		}catch(e){
			seterror(e.message)
		}finally{
			setonsubmit(false)
		}
	}
	return(
		<div className="form-container">
			<form onSubmit={submit} action="/">
				<div className="container-form">
					<h3>{id ? 'Edit' :'Add'} Data</h3>
					{
						error && <div className="alert-error">{error}</div>
					}
					<div>
						<label htmlFor=""></label>
						<input type="text" className="input-primary" placeholder="username" name="username" value={input.username} onChange={change} />
					</div>
					<div>
						<button disabled={onsubmit} type="submit" className="btn-primary">Submit</button>
					</div>
				</div>
			</form>
		</div>
	)
}