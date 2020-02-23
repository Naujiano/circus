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
	$.ajax({
		url: apiURL + 'writeFile',
	data: { json: localStorage["vuexStore"], fileName:'circus.json' },
	method: "POST",
	//async: false,
		success: (storedVuexStore) => {
		console.log('tree saved!')
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
