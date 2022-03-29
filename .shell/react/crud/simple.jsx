import {
    useNavigate
} from 'react-router-dom'
import {
    useSelector,
    useDispatch,
} from 'react-redux'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { createUser, paginateUser, removeUser, updateUser } from '@s/STORE'

export default function caseName() {
    // state
    const [state, setstate] = useState({
    	id: 0,
    })
    const [search, setsearch] = useState('')
    const [page, setpage] = useState({
        offset: 1,
        limit: 5,
        sort: {
            order: 'asc',
            name: 'id'
        }
    })
    // init
    const to = useNavigate()
    const dispatch = useDispatch()
    const STORE = useSelector(app => app.STORE)
    const [allnumber, setallnumber] = useState(1)
    useEffect(() => {
        let data = [...STORE.data], name = page.sort.name;
        const value = search.toLowerCase()
        const lower = (v) => v.toLowerCase()
        const filter = (v) => v.id === value

        if(page.sort.order == 'asc'){
            data = data.sort((a, b) => String(a[name]).localeCompare(String(b[name])))
        } else {
            data = data.sort((a, b) => String(b[name]).localeCompare(String(a[name])))
        }
        (() => {
            if(search){
                data = data.filter(filter)
            }
        })();
        dispatch(paginateUser({ ...page, data: data }))
        setallnumber(Math.ceil(data.length / page.limit))
    }, [page, STORE.data, search])
    // action
    const submit = (e) => {
        e.preventDefault()
        if (state.id !== 0) {
            dispatch(updateUser(state))
        } else {
            dispatch(createUser({ ...state, id: (STORE.data.at(-1)?.id || 0) + 1 }))
        }
        reset()
    }
    const reset = useCallback(() => setstate({
        id: 0,
    }), [])
    const handle = (e) => setstate({ ...state, [e.target.name]: e.target.value })
    const edit = useCallback((id) => () => setstate(STORE.data.find(v => v.id === id)), [STORE.data])
    const deleted = useCallback((id) => () => {
        dispatch(removeUser(id))
    }, [page])
    const next = () => {
        if (page.offset < allnumber) {
            setpage({ ...page, offset: page.offset + 1 })
        }
    }
    const previous = () => {
        if (page.offset > 1) {
            setpage({ ...page, offset: page.offset - 1 })
        }
    }
    const changepage = (number) => () => {
        setpage({ ...page, offset: number })
    }
    const changelimit = (e) => setpage({ ...page, limit: e.target.value })
    const sort = (name) => (e) => {
        if (e.target.classList.contains('asc')) {
            setpage({ ...page, sort: { name, order: 'asc'} })
            e.target.classList.remove('asc')
        } else {
            setpage({ ...page, sort: { name, order: 'desc'} })
            e.target.classList.add('asc')
        }
    }
    return (
        <div className="sassClass">
			<form action="" className="mb-3">
                <div className="input">
				    {/*input*/}
                </div>
				<div className="mt-2">
				 	<button className="primary" onClick={submit}>Save</button>
				</div>
			</form>
			<div>
				<div className="flex space-x-1">
					<input onChange={(e) => setsearch(e.target.value)} className="flex-1" placeholder="Search data" type="search" />
					<select onChange={changelimit} value={page.limit}>
						{[5,10,50,100].map((v) => <option key={v} value={v}>{v} item</option>)}
					</select>
				</div>
				<div className="overflow-auto">
					<table>
				        <thead>
					       <tr>
					           <th className="cursor-pointer asc" onClick={sort('id')}>ID</th>
					           {/*table*/}
					           <th style={{minWidth: 150}}>ACTION</th>
					       </tr>
				        </thead>
					  <tbody>
					  {
						STORE.paginate.map((v, i) => (
							<tr key={i}>
								<td>{v.id}</td>
								<td>
									<button className="primary" onClick={edit(v.id)}>Edit</button>
									<button className="ml-2 danger" onClick={deleted(v.id)}>delete</button>
								</td>
							</tr>
						))
					  }
					  {
							STORE.paginate.length === 0 ?
							<tr className="text-center">
								<td colSpan="4">No Records</td>
							</tr>
							: false
					  }
					  </tbody>
					</table>
				</div>
				<div className="footer">
					<div className="info">
						<p>{STORE.data.length} of data</p>
					</div>
					<div className="btn">
						<button className="primary" onClick={previous}>Previous</button>
						{Array.from(new Array(allnumber)).map((v,i) => (
							<button key={i} className={page.offset === (i + 1) ? "primary active": "primary"} onClick={changepage(i + 1)}>{i + 1}</button>
						))}
						<button className="primary" onClick={next}>Next</button>
					</div>
				</div>
			</div>
		</div>
    )
}