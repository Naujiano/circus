import uuidV1 from 'uuid/v1'
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
Vue.use(Vuex) 
import queryString from 'query-string';
const parsedSearch = queryString.parse(location.search)
, apiURL = 	parsedSearch.api
, connectionsModel = {};
console.log(apiURL)
var storedVuexStore, vuexStore
export {vuexStore, parsedSearch}

let services = {connNameToDbName:{}}
$.ajax({
	url: apiURL + 'services',
  	data: '',
  	method: "POST",
  	async: false,
	success: (respuesta) => {
		const jsonRespuesta = JSON.parse(JSON.parse(respuesta))
		, connNameToDbName = {}
		Object.keys ( jsonRespuesta ).forEach ( key => {
			connNameToDbName[key.toLocaleLowerCase()] = jsonRespuesta[key]
		})
		Object.assign ( services.connNameToDbName, connNameToDbName )
	},
	error: (respuesta) => {
		console.log('error en services json')
  	}
});
let circusConfig = "puta"
$.ajax({
	url: apiURL + 'circusConfig',
  	data: '',
  	method: "POST",
  	async: false,
	success: (respuesta) => {
		circusConfig = JSON.parse(JSON.parse(respuesta))
	},
	error: (respuesta) => {
		console.log('error en circusConfig json')
  	}
});


if ( parsedSearch.reset ) {
	var fileName
	if ( parsedSearch.reset == 1 ) 
		fileName = 'circus.json'
	else
		fileName = parsedSearch.reset
	loadTree( treeModel=>{
			createStore(treeModel);
			console.log('Model loaded from ' + fileName );
	}, fileName )
} else {
	try {
		storedVuexStore = JSON.parse(localStorage["vuexStore"]);
	}
	catch(err) {
		alert('No se ha encontrado Cookie de configuración local.\n\nCargando configuración del servidor...');
		location = window.location.href + "&reset=1"
	}	
	createStore(storedVuexStore)
}
//console.log ( JSON.parse ( localStorage["vuexStore"] ) )
export 	function loadTree ( cb, fileName ) {
	//var fileName = fileName ? fileName : 'circus.json'
	$.ajax({
		  url: parsedSearch.api + 'readFile',
		data: { fileName },
		method: "POST",
		async: false,
		  success: (jsonString) => {
			  const obj = JSON.parse(jsonString)
			  //console.log(JSON.parse(jsonString))
			cb(obj)
		}
	});
}
export function loadConfig ( fileName ) {
	location = './?api=' + apiURL + '&dev=1&admin=1&reset=' + fileName
}
export function deleteConfig ( fileName, cb ) {
	$.ajax({
		url: parsedSearch.api + 'deleteFile',
	  data: { fileName },
	  method: "POST",
	  async: false,
		success: (jsonString) => {
			
			//const obj = JSON.parse(jsonString)
			//console.log(JSON.parse(jsonString))
		  cb(jsonString)
	  }
    });
}
function createStore (storedVuexStore) {
	const vuexTree = {
		state: {
			...storedVuexStore
		} ,
		...actions
	}
	vuexTree.state.database = circusConfig // Asigno la configuración de la aplicación al archivo de configuración global.
	//Object.assign ( vuexTree.state.database , circusConfig )
	vuexStore = new Vuex.Store(vuexTree)
	localStorage["vuexStore"] = JSON.stringify(vuexTree.state)

	console.log(circusConfig)
	//console.log(JSON.parse(JSON.stringify(vuexTree.state)))
	vuexStore.subscribe((mutation, state) => {
		const estado = {...state}
		localStorage["vuexStore"] = JSON.stringify(estado)
		resetApiStore()
		saveConfigFile ()
		console.log( JSON.cc ( estado ) )
	})
}
function saveConfigFile () {
	let fileName = parsedSearch.reset
	if ( !fileName ) fileName = 'circus.json'
	$.ajax({
		url: apiURL + 'writeFile',
		data: { json: localStorage["vuexStore"], fileName },
		method: "POST",
		//async: false,
		success: (storedVuexStore) => {
			//console.log('tree saved!')
			//window.circus.showHelpBox ( {title:'Configuración Guardada',text:'Se ha guardado automáticamente la configuración actual en el archivo ' + fileName })
		},
		error: (respuesta) => {
			console.log('error ajax saveConfigFile')
		}
	});
}
//alterTree()
function alterTree () {
	//loadFieldsForTables  ( vuexStore )
	let tree = JSON.stringify({...vuexStore.state})
	//vuexStore.state.database.listsModels = {}
	//vuexStore.state.database.listsModels.CLI_Estado = vuexStore.state.database.lists.CLI_Estado
	//vuexStore.state.ventanas.data[0].queryeditor.distinct=true
	localStorage["vuexStore"] = JSON.stringify({...vuexStore.state})
	saveTree("circus.json")
}

let store //= JSON.parse(localStorage["vuexStore"])//vuexStore.state
resetApiStore()

function resetApiStore () {
	store = JSON.parse(localStorage["vuexStore"])
}



//console.log(services.connNameToDbName)

//----------------------------------------------------------------------------------------------------------
export function tablesFromConnection ( connection ) {
	return [['clientes','clientes'],['polizas','polizas',],['recibos','recibos'],['colaboradores','colaboradores']]
}
export function getListColumnSql ( key, options ) {
	const listModel = getListModel(key)
	if ( !listModel ) return key
    if ( listModel.length ) { // Es Array. Lista estática
		if ( !options ) {
        	let newKey = `(case ${key}`
        	listModel.forEach ( item => {
        	    const val = item[0]
        	    , txt = item[1]
        	    newKey += ` when ${val} then '${txt}' `
        	})
        	newKey += `end)`
			return newKey
		} else {
			return key
		}
    } 
    if ( listModel && !listModel.length ) { // Es objeto. Lista dinámica
        const sqlValueFromId = listModel.sqlValueFromId.replace ( "{{id}}", key )
        const newKey = `(${sqlValueFromId})`
		return newKey
    }
}
export function getListModel ( listKey ) {
	const listsModels = store.database.listsModels
    , lists = store.database.lists
    , listModelName = lists[listKey]
	, listModel = JSON.cc(listsModels[listModelName])
	return listModel
}
export function getLiteral ( id ) {
	const literales = store.database.literales
	if ( literales[id] ) return literales[id]
	const computedFields = store.database.computedFields
	, computedField = computedFields.filter ( cf => cf.sql.indexOf(id) != -1 )
	if ( computedField.length ) return computedField[0].literal
	const idArr = id.split(".")
	return idArr[idArr.length-1]
	//return id
}

export function getFieldsForTable ( table, cb ) {
	table = getCaseSensitiveTableName ( table )
	    $fieldsForTable (table,fields => {
			const identities = fields.filter ( (field,index) => field.is_identity ).map ( field => field.column_name )
			//if ( table == "v_dif_produccion" ) console.log(fields)
			cb ( { fields,identities })
		})
}
function getCaseSensitiveTableName (tableName) {
	let csTableName
	Object.keys ( store.database.tables ).forEach ( key => {
		if ( key.toLowerCase() == tableName.toLowerCase() ) csTableName = key
	})
	return csTableName
}

export function getIdentitiesForTableSet ( table, cb ) {
	console.log('getIdentitiesForTableSet')
	    $fieldsForTable (table,fields => {
			const identities = fields.filter ( (field,index) => field.is_identity ).map ( field => ( { column_name: field.column_name, table_name: field.table_name } ) )
			cb ( identities )
		})
}
export function $fieldsForTable ( tableName, cb ) {
	const tables = getTablesRelation(tableName).names
	, finalCampos = []
	, promises = []
	//if ( tableName == "v_dif_produccion" ) console.log(tables)
	tables.forEach ( ( tableName ) => {
		const tna = tableName.split ( "." )
		, db = tna.length > 1 ? `${tna[0]}.${tna[1]}.` : ''
		, tabla = tna.length > 1 ? tna[2] : tableName
		, dbID = getTableConnectionId(tableName)
		//console.log(db+'**'+dbID+'**'+tableName)
		const promise = new Promise ( ( resolve, reject ) => {
            $dbq ({
                operation: 'sp'
                //, sp_name: `${db}sp_circus_fields '${tabla}'`
                , sp_name: `sp_circus_fields '${tabla}'`
				, dbID: dbID
            }, campos => {
				const newCampos = JSON.parse ( JSON.stringify ( campos ) )
				, custom_pkname = store.database.tables[tableName].pkname ? store.database.tables[tableName].pkname : ''
				const computedFields = store.database.computedFields
				computedFields.forEach ( cf => {
					const cfTable = cf.table
					if ( cfTable.toLowerCase() == tabla.toLowerCase() ) {
						newCampos.push({
							CHARACTER_MAXIMUM_LENGTH:10
							, column_name: cf.sql
							, data_type: cf.type
							, is_identity: false
							, table_name: tableName //tabla
							, literal: cf.literal
						})
					}
				})
				newCampos.forEach ( ( campo ) => {
					const fieldSettings = getFieldSettings ( campo.column_name, campo.table_name )
					Object.assign ( campo, { dbsettings: fieldSettings , form: { group: 'grupo2'}, list: { order: "", position: "1" } } )
					if ( campo.column_name.toLowerCase() == custom_pkname.toLowerCase() ) campo.is_identity = true
					if ( campo.is_identity ) campo.list.position = "0" 
				});
				resolve ( newCampos )
            })
		})
		promises.push ( promise )
	})
	function execPromises ( promiseNumber ) {
		const promise = promises [promiseNumber]
		promise.then( (newCampos) => {
			finalCampos.push ( ...newCampos )
			//console.log(JSON.cc(newCampos))

			if ( promiseNumber < promises.length - 1 ) {
				execPromises ( promiseNumber+1 )
			} else {
				cb ( finalCampos )
			}
		})
	}
	execPromises( 0 )
}
function getFieldSettings ( fieldName, tableName ) {
	const table = store.database.tables[tableName.toLowerCase()]
	, lists = store.database.lists
	//, dbsettings = table.fields ? table.fields[fieldName] : false
	, treatedSettings = {} // Object.assign ( {} , dbsettings )
	, listName = lists[tableName+'.'+fieldName]
	treatedSettings.list = store.database.listsModels[listName]
	return treatedSettings
}
export function getTableConnectionId ( tableName, databasename ) {
	let dbID = false
	Object.keys ( store.database.tables ).forEach ( key => {
		if ( key.toLocaleLowerCase() == tableName.toLocaleLowerCase() ) {
			//dbID = store.database.tables[key].connection
			const connID = store.database.tables[key].connection//.toLowerCase()
			//console.log(services.connNameToDbName+connID)
			//console.log(services.connNameToDbName[connID.toLowerCase()])
			dbID = databasename ? services.connNameToDbName[connID.toLowerCase()] : connID
			//dbID = connID
		}
	})
	//const dbID = store.database.tables[tableName].connection
	return dbID
}
export function getTablesRelation ( tableName ) {
	const dbID = getTableConnectionId(tableName,1)
	const relatedGroup = { names: [tableName], joinSyntax: cleanTableName(dbID)+'.dbo.'+cleanTableName(tableName) }
	//let relatedNames = [tableName]
	const relatedTables = getRelatedTables ( tableName )
	relatedGroup.joinSyntax +=  relatedTables.joinSyntax
	let nextRelatedNames = relatedTables.names
	//console.log('tablename'+tableName)
	do {
		let relatedNames = nextRelatedNames
		//_.pullAll(relatedNames, relatedGroup.names)
		nextRelatedNames = []
		for ( tableName of relatedNames ) {
			const relatedTables = getRelatedTables ( tableName, relatedGroup.names.concat(relatedNames) )
			nextRelatedNames = nextRelatedNames.concat(relatedTables.names)
			relatedGroup.names.push ( tableName )
			relatedGroup.joinSyntax +=  relatedTables.joinSyntax
		}
	} while ( nextRelatedNames.length )
	//relatedGroup.names = [tableName].concat ( relatedGroup.names )
	aliasIndex = -1
	involvedTablesNames = []
	return relatedGroup
}
const aliases = ['a','b','c','d','e','f','g','h','i']
var involvedTablesNames = []
var aliasIndex = -1
function getNextAlias ( ) {
	aliasIndex++
	return aliases[aliasIndex]
}
function getRelatedTables ( tableName, excludeNames=[] ) {
	const res = { names: [], joinSyntax: "" }
	const tables = store.database.tables
	, table = tables[tableName]
	, relatedTablesNames = []
	//res.joinSyntax += tableName
	if ( !table ) return res
	let joinTables = ""
	const relatedTables = table.relatedTables ? table.relatedTables : {}
	Object.keys(relatedTables).filter(tableName=>excludeNames.indexOf(tableName)==-1).forEach ( ( key, aliasIndex ) => {
		//if ( relatedTables[key].relation == "* => 1" ) {
		const relatedTable = relatedTables[key]
		, remoteField = relatedTable.remoteField
		, localField = relatedTable.localField
		, dbID = cleanTableName ( getTableConnectionId ( key, 1 ) )
		, dbID2 = cleanTableName ( getTableConnectionId ( tableName, 1 ) )
		, joinType = relatedTables[key].join ? relatedTables[key].join : "INNER JOIN"
		//joinTables += ` ${joinType} ${dbID}.dbo.${cleanTableName(key)} ON ${dbID2}.dbo.${cleanTableName(tableName)}.${localField} = ${dbID}.dbo.${cleanTableName(key)}.${remoteField}`
		, t1fullname = `${dbID}.dbo.${cleanTableName(key)}`
		, alias = isTableRepeated (key) ? getNextAlias() : ''
		, alias2 = alias != '' ? alias : t1fullname
		// AL FINAL HE DECIDIDO EXCLUIR CUALQUIER REPETICIÓN DE UNA TABLA EN LA SELECT. LA QUE LLEGUE PRIMERO SE LO QUEDA.
		if ( ! isTableRepeated (key)  ) 
			joinTables += ` ${joinType} ${t1fullname} ${alias} ON ${dbID2}.dbo.${cleanTableName(tableName)}.${localField} =  ${alias2}.${remoteField}`
		relatedTablesNames.push ( key )
		involvedTablesNames.push ( key )
		function isTableRepeated (tn) {
			return involvedTablesNames.indexOf (tn) != -1
		}
	})
	res.names = relatedTablesNames
	res.joinSyntax = joinTables
	return res
}
function cleanTableName ( tn ) {
	const tnArr = tn.split(".")
	, cleanedName = tnArr.length > 1 ? tnArr[tnArr.length - 1] : tn
	return cleanedName
}

export function getDirectParents ( tableName ) {
	const relatedTables = store.database.tables[tableName].relatedTables
	, parentTables = relatedTables ? relatedTables : {}
	return parentTables
}
export function getDirectSuns ( tableName ) {
	const tables = store.database.tables
	, childTablesNames = Object.keys(tables).filter(tName => {
		const tab = tables[tName]
		if ( !tab.relatedTables ) return false
		const relatedTables = Object.keys(tab.relatedTables).map(tName=>tName.toLowerCase())
		if ( relatedTables.indexOf(tableName.toLowerCase())==-1 ) return false
		return true
	})
	, childTablesRes = {}
	childTablesNames.forEach ( tName => {
		//tables[tName].relatedTables[tableName]
		childTablesRes[tName]=tables[tName].relatedTables[tableName]
	})
	return childTablesRes
}
//const api = 'http://82.223.111.21:8000/'
//const api = 'http://localhost:8000/'
export function saveTree ( fileName, doPrompt ) {
	if ( doPrompt ) {
		const givenName = window.prompt ( "Introduzca el nombre que quiere dar al archivo de configuración" , fileName )
		if ( !givenName ) return false
		fileName = givenName + ( givenName.indexOf ( '.json' ) == - 1 ? '.json' : '' )
	}
	if ( !fileName ) fileName = uuidV1()+'.json'
	//saveTree.fileName = fileName
	$.ajax({
  		url: apiURL + 'writeFile',
		data: { json: localStorage["vuexStore"], fileName },
		method: "POST",
		//async: false,
  		success: (storedVuexStore) => {
			console.log('Model saved to ' + fileName )
		}
	});
	return fileName
}
export function saveCircusConfig ( ) {
	circusConfig =  JSON.parse(localStorage["vuexStore"]).database 
	$.ajax({
  		url: apiURL + 'writeConfig',
		data: { json: JSON.stringify(circusConfig,null,2) },
		method: "POST",
		//async: false,
  		success: (storedVuexStore) => {
			console.log('Circus config saved.' )
		}
	});
	return fileName
}
export function listFiles (folder,cb) {
	$.ajax({
		url: apiURL + 'listFiles',
	  	data: { folder },
	  	method: "POST",
	  	//async: false,
		success: ( list ) => {
		  	cb ( JSON.parse ( list ) )
	  	}
  	});
}
export function getTablesList (cb) {
	const list = []
	, promises = []
	, connections = services.connNameToDbName
	//return list
	var promiseIndex = 0
	Object.keys ( connections  ).forEach ( key => {
		const connName = key
		, dbName = connections[connName]
		promises.push ( new Promise (
			function ( resolve, reject ) {
				$dbq (
					{
						columns: ['name']
						, schemaSyntax: "sys.tables"
						, dbID: connName
						, whereSyntax: "name is not null"
					},
					function ( tablas ) {
						list.push ( {label:connName, content:tablas.map ( ele => {return ele.name} ) } )
						resolve ('all cool')
						//cb(tablas)
					}
				)
			}
		) )
	})
	executePromise()
	function executePromise () {
		promises[promiseIndex].then ( 
			function ( result ) { 
				promiseIndex++; 
				if ( promiseIndex<promises.length ) {
					 executePromise () 
				} else {
					cb ( list )
				}
			}
			, function ( err ) {}
		)
	}
}
export function $dbq (
	params
	, cb
	, async
	, request
) {
	//if ( ! params.dbID ) params.dbID = 'visual'
	params.language = 'spanish'
	if ( ! async ) async = true
	const operation = request ? 'request' :  'dbq'
	//const operation = 'dbq'
	$.ajax({
  		url: apiURL + operation,
		data: `params=${encodeURIComponent(JSON.stringify(params))}`,
		method: "POST",
		async: async,
  		success: (respuesta) => {
			  const jsonRespuesta = JSON.parse(respuesta)
			  if ( jsonRespuesta.length && jsonRespuesta[0].Error ){
				  console.log(JSON.stringify(jsonRespuesta[0]))
				  window.circus.showHelpBox ( {title:'Error en consulta SQL', text:JSON.stringify(jsonRespuesta[0])}, true)
			  	//alert(JSON.stringify(jsonRespuesta[0]))
			  }
			if ( cb ) cb(jsonRespuesta)
		},
  		error: (respuesta) => {
			  console.log(respuesta)
		}
	});
	
}
export function keepDBConnAlive () {
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
}
export function downloadExcel ( sqlParams, types ) {
	
	window.open ( apiURL + 'downloadExcel?' + `params=${encodeURIComponent(JSON.stringify(sqlParams))}&types=${encodeURIComponent(JSON.stringify(types))}` )
	return
}
