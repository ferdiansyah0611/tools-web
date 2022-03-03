import { db, addData, deleteData, updateData } from '@/firebase'
import {
  collection, query, orderBy, limit, where, onSnapshot, serverTimestamp, startAfter, endAt, getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"

const table = 'model'
const model = {
	modelAdd(data){
		data.created = serverTimestamp()
		return addData(table, data)
	},
	modelDelete(id){
		return deleteData(table, id)
	},
	modelUpdate(id, data){
		return updateData(table, id, data)
	},
	modelWhere(...where){
		return getDocs(query(collection(db, table), where(where)))
	},
	modelWatch(id, previous, next, callback){
		if(next){
			const first = query(collection(db, table), limit(20), where('id', '==', id), orderBy('created', 'desc'), startAfter(next))
			return onSnapshot(first, callback)
		}
		if(previous){
			const first = query(collection(db, table), limit(20), where('id', '==', id), orderBy('created', 'desc'), endAt(previous))
			return onSnapshot(first, callback)
		}
		else{
			const first = query(collection(db, table), limit(20), where('id', '==', id), orderBy('created', 'desc'))
			return onSnapshot(first, callback)
		}
	},
	modelWatchMore(id, total, callback){
		return onSnapshot(
			query(
				collection(db, table), limit(total), where('id', '==', id), orderBy('created', 'desc')
			),
			callback
		)
	}
}

export default model