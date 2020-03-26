import Vue from 'vue'
//import App from './App.vue'
import Circus from './components/circus.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Circus),
}).$mount('#app')


//require('../circus-layout.css')
//require('../simple-table.css')

import queryString from 'query-string';
const parsedSearch = queryString.parse(location.search)
, apiURL = 	parsedSearch.api

function keepDBConnAlive () {
	let fileName = parsedSearch.reset
	if ( !fileName ) fileName = 'circus.json'
	$.ajax({
		url: apiURL + 'ping',
	data: { json: localStorage["vuexStore"], fileName },
	method: "POST",
	//async: false,
		success: (storedVuexStore) => {
		console.log('keepDBConnAlive!')
		//window.circus.showHelpBox ( {title:'Configuración Guardada',text:'Se ha guardado automáticamente la configuración actual en el archivo ' + fileName })
	},
	error: (respuesta) => {
		console.log('error ajax ping')
		}
});
/*
$.ajax({
		url: apiURL + 'ping',
	    data: `dbID=visual`,
	    method: "POST",
	    //async: true,
		success: (respuesta) => {
			console.log('ping')
	  	},
		error: (respuesta) => {
			console.log('error ajax ping')
	  	}
  });
	*/
}
setInterval ( keepDBConnAlive, 60000 )
