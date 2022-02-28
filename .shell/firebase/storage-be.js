const {Storage} = require('@google-cloud/storage');

const storage = new Storage({keyFilename: 'service.json'}).bucket('yourbucket.appspot.com')
const exported = {}

exported.getURL = async function(path, callback){
	await storage.file(path).getSignedUrl({
   		action: 'read',
   		expires: '03-01-2500'
    }, callback)
}
exported.uploaded = async function(file, dest, callback, buffer = null){
	try{
    	await storage.file(dest).save((buffer || file.buffer), {
        	contentType: file.mimetype
     	}, (err) => {
    		callback(err)
    	})
    }catch(e){
    	callback(e.message)
    }
}
exported.removed = async function(dest){
	return storage.file(dest).delete()
}
exported.getFiles = function(dest, custom = null){
	return storage.getFiles(custom || {
		prefix: dest, maxResults: 15
	})
}
module.exports = exported