#!/usr/bin/env bash
restart(){
	rm -rf myapp
	echo $1
}
system(){
	restart "> Sytem Test"
	node test.js --cli app myapp
	node test.js --cli edit
	node test.js --cli show env
	node test.js --cli prettier
}
react(){
	restart "> React Test"
	node test.js --cli react make:project
	node test.js --cli react install:mui
	node test.js --cli react make:component Sidebar.jsx sass
	node test.js --cli react make:store users.js reducer
	node test.js --cli react make:store users.js async http://localhost:8000/api/users
	node test.js --cli react make:route User.jsx sass users
	node test.js --cli react make:route:crud user
	node test.js --cli react make:crud:simple User.jsx user sass name,email,password,phone,place,company text,email,password,number,text,text name,email,company,place
	node test.js --cli react make:firebase
	node test.js --cli react make:gcs
	node test.js --cli react make:model:firestore user.js
	node test.js --cli react install:tailwindcss
}
vue(){
	restart "> Vue Test"
	node test.js --cli vue make:project
	node test.js --cli vue make:component Button.vue
	node test.js --cli vue make:route About.vue /about
	node test.js --cli vue make:firebase
	node test.js --cli vue make:gcs
	node test.js --cli vue make:model:firestore user.js
	node test.js --cli vue install:tailwindcss
}
express(){
	restart "> Express Test"
	node test.js --cli express make:project ejs mongoose
	node test.js --cli express make:api user.js mongoose name,email,phone
	node test.js --cli express make:model User.js mongoose name,email,phone
	node test.js --cli express make:gcs
}

# run test
node test.js --cli mode 0
if [[ $1 == "all" ]]; then
	system
	react
	vue
	express
fi
if [[ $1 == "system" ]]; then
	system
fi
if [[ $1 == "react" ]]; then
	react
fi
if [[ $1 == "vue" ]]; then
	vue
fi
if [[ $1 == "express" ]]; then
	express
fi