import firebase from '../firebase'
import { v4 as uuidv4 } from 'uuid';
 
const storage = firebase.storage()

const upload = (file) => {
  let rand = `${uuidv4()}-${file.name}`
  if(file.type.match(/image\/[a-z]+/)){
    return storage.ref(`/images/${rand}`).put(file).then(snapshot => {
      return snapshot.ref.getDownloadURL().then(url => {
        return new Promise((res,rej) => res({url: url, name: rand}))
      })
    })
  }
  if(file.type.match(/video\/[a-z]+/)){
    return storage.ref(`/videos/${rand}`).put(file).then(snapshot => {
      return snapshot.ref.getDownloadURL().then(url => {
        return new Promise((res,rej) => res({url: url, name: rand}))
      })
    })
  }
  if(file.type.match(/application\/[a-z]+/)){
    return storage.ref(`/documents/${rand}`).put(file).then(snapshot => {
      return snapshot.ref.getDownloadURL().then(url => {
        return new Promise((res,rej) => res({url: url, name: rand}))
      })
    })
  }
  if(file.type.match(/audio\/[a-z]+/)){
    return storage.ref(`/audios/${rand}`).put(file).then(snapshot => {
      return snapshot.ref.getDownloadURL().then(url => {
        return new Promise((res,rej) => res({url: url, name: rand}))
      })
    })
  }
  else{
    return storage.ref(`/any/${rand}`).put(file).then(snapshot => {
      return snapshot.ref.getDownloadURL().then(url => {
        return new Promise((res,rej) => res({url: url, name: rand}))
      })
    })
  }
}
const remove = (name, type) => {
  if(type.match(/image\/[a-z]+/)){
    return storage.ref(`/images/${name}`).delete()
  }
  if(type.match(/video\/[a-z]+/)){
    return storage.ref(`/videos/${name}`).delete()
  }
  if(type.match(/application\/[a-z]+/)){
    return storage.ref(`/documents/${name}`).delete()
  }
  if(type.match(/audio\/[a-z]+/)){
    return storage.ref(`/audios/${name}`).delete()
  }
  else{
    return storage.ref(`/any/${name}`).delete()
  }
}
 
export {
	storage, upload, remove
}