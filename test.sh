#!/usr/bin/env bash
restart(){
	rm -rf myapp
	echo $1
}
system(){
	restart "> Sytem Test"
	node test.js --cli app myapp
	node test.js --cli edit
	node test.js --cli disable react
	node test.js --cli enable react
	node test.js --cli show env
}
react(){
	restart "> React Test"
	node test.js --cli react make:project
	node test.js --cli react add:mui
	node test.js --cli react make:component Sidebar.jsx sass
	node test.js --cli react make:store users.js reducer
	node test.js --cli react make:store users.js async http://localhost:8000/api/users
	node test.js --cli react make:route User.jsx sass users
	node test.js --cli react make:route:crud user
	node test.js --cli react make:crud:simple User.jsx user sass name,email,password,phone,place,company text,email,password,number,text,text name,email,company,place
	node test.js --cli react add:tailwindcss
	node test.js --cli react add:antd
}
vue(){
	restart "> Vue Test"
	node test.js --cli vue make:project
	node test.js --cli vue make:component Button.vue
	node test.js --cli vue make:route About.vue /about
	node test.js --cli vue add:tailwindcss
	node test.js --cli vue add:quasar
}
express(){
	restart "> Express Test"
	node test.js --cli express make:project ejs mongoose
	node test.js --cli express make:api user.js mongoose name,email,phone
	node test.js --cli express make:model User.js mongoose name,email,phone
}
firebase(){
	restart "> Firebase Test"
	node test.js --cli firebase init
	node test.js --cli firebase make:model user.js
	node test.js --cli firebase storage
	node test.js --cli firebase gcs
}
tool(){
	restart "> Tool Test"
	node test.js --cli tool prettier all
	node test.js --cli tool test:api product.js
}
helps(){
	restart "> Helps Test"
	node test.js --cli -h
	sleep 5
	echo "> React Helps"
	node test.js --cli react -h
	sleep 5
	echo "> Vue Helps"
	node test.js --cli vue -h
	sleep 5
	echo "> Express Helps"
	node test.js --cli express -h
	sleep 5
	echo "> Firebase Helps"
	node test.js --cli firebase -h
	sleep 5
	echo "> Tool Helps"
	node test.js --cli tool -h
	sleep 5
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
if [[ $1 == "firebase" ]]; then
	firebase
fi
if [[ $1 == "tool" ]]; then
	tool
fi
if [[ $1 == "helps" ]]; then
	helps
fi