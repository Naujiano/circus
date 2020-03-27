import {$dbq} from './api.js'
function setKey ( state , {path ,value }) {
    if ( value )
        _.set ( state , path, value )
    else
        _.set ( state , path, false )
    //_.unset ( state , path )
}
const actions = {
    strict: false,
    mutations: {
        setKey ( state, {path ,value } ) {
            setKey ( state, {path ,value } )
            return
            var statePos = state
            path.forEach ( (p,i) => {
                if ( i < path.length - 1 ) {
                    statePos = statePos[p]
                } else {
                    if ( val )
                        statePos[p] = val
                    else
                        delete statePos[p];
                }
            })
        }
        , set_listModelAlias ( state , { listModelName, value } ) { state.database.listsModels[listModelName].alias = value }
        , setContainerType ( state, {index,type} ) {
            console.log({index,type})
            state.containers[index].type = type
            //return actions.getters.ventana(index)
        },
        setVentana ( state , {index,data} ) {
            console.log(index)
            //state.ventanas.data[index] = data
        },
        Query_add ( state, {query,cb} ) {
            //console.log(JSON.cc({rowIndex,key,value}))
            //state.queries.push ( query )
            const sqlParams = {
                operation: "insert"
                , columns: ["v_nombre","v_identificador","v_fecha","v_json"]
                , schemaSyntax: "views"
                , language: "spanish"
                , values: [query.customName,query.name,query.fecha,JSON.stringify(query)]
                , dbID: "circus"
            }
            $dbq (sqlParams,cb)
        },
        Query_setKey ( state, {id,key,value} ) {
            let col
            switch ( key ) {
                case 'customName':
                    col = 'v_nombre'
                    break
            }
            const sqlParams = {
                operation: "update"
                , columns: [col]
                , schemaSyntax: "circus.dbo.views"
                , language: "spanish"
                , values: [value]
                , whereSyntax: "v_id="+id
            }
            $dbq (sqlParams)
        },
        Query_delete ( state, id ) {
            const sqlParams = {
                operation: "delete"
                , schemaSyntax: "circus.dbo.views"
                , language: "spanish"
                , whereSyntax: "v_id="+id
            }
            console.log(sqlParams)
            $dbq (sqlParams)
        },
        database_setLiteral ( state, {key, literal} ) {
            state.database.literales[key] = literal
        },
        Ventana_setVisibility ( state, {indexVentana,visible} ) {
            state.ventanas.data.forEach ( win => win.visible = false )
            state.ventanas.data[indexVentana].visible = visible
        },
        Ventana_clone ( state, {index} ) {
            const configVentana = JSON.cc(state.ventanas.data[index])
            configVentana.queryeditor.parameters = []
            configVentana.name = "[NUEVA]"
            state.ventanas.data.push ( configVentana )
            //state.ventanas.data.push ( JSON.cc(state.ventanas.data[index]).queryeditor.parameters = [] )
        },
        Ventana_delete ( state, {index} ) {
            state.ventanas.data.splice ( index , 1 )
        },
        Ventana_injectQE ( state, {indexVentana,qeParams} ) {
            //console.log('injectedParams')
            //console.log(JSON.cc(qeParams))
            state.ventanas.data[indexVentana].queryeditor.parameters = qeParams
            //console.log(JSON.cc(state.ventanas.data[indexVentana].queryeditor.parameters))
        },
        Ventana_setName ( state, {indexVentana,ventanaName} ) {
            state.ventanas.data[indexVentana].name = ventanaName
        },
        Ventana_setTable ( state, {indexVentana,tableName} ) {
            state.ventanas.data[indexVentana].table = tableName
        },
/*
        Ventana_setFields ( state , {indexVentana, fields, identities} ) {
            state.ventanas.data[indexVentana].identities = identities
            state.ventanas.data[indexVentana].fields = fields
        },
*/
        ContextMenu_open ( state, data ) {
            //console.log(data)
            state.contextMenu = JSON.cc(data)
            //state.contextMenu.cursor[2] = 4
        },
        ContextMenu_clear ( state ) {
            //console.log(data)
            state.contextMenu = {}
            //state.contextMenu.cursor[2] = 4
        },
        ContextMenu_formUpdate ( state, item ) {
            //console.log({campos,cursor})
            state.contextMenu.item = item
            //state.contextMenu.cursor[2] = 4
        },
        ContextMenu_commit ( state ) {
            const cursor = state.contextMenu.cursor
            , newData = state.contextMenu.item
            var stateCursor = new objeto(state).get(cursor)
            log(newData)
            Object.assign ( stateCursor , newData )

        },
        checked_assign ( state, {indexVentana,ids} ) {
            state.ventanas.data[indexVentana].list.checkedIds = ids
            //if ( ! state.ventanas.data[indexVentana].list.checkedIds ) state.ventanas.data[indexVentana].list.checkedIds = []
            //state.ventanas.data[indexVentana].list.checkedIds.push ( ids )
        },
        set_distinct ( state, {indexVentana,value} ) {
            state.ventanas.data[indexVentana].queryeditor.distinct = value
            //Object.assign ( state.ventanas.data[indexVentana].queryeditor , { distinct : value } )
            console.log(state.ventanas.data[indexVentana].queryeditor)
            //if ( ! state.ventanas.data[indexVentana].list.checkedIds ) state.ventanas.data[indexVentana].list.checkedIds = []
            //state.ventanas.data[indexVentana].list.checkedIds.push ( ids )
        },
        log ( state, msg ) {
            if ( ! state.log ) state.log = []
            var event = new Date()
            // British English uses day-month-year order and 24-hour time without AM/PM
            , fecha = event.toLocaleString('en-GB', { timeZone: 'UTC' })
            state.log.unshift ( fecha + '<br>' + msg ) 
        },
        set_databaseConfig ( state, {path, value} ) {
            path =  `database.${path}` //LO QUE VA LA DB LLEVA EL PATH COMO CADENA DE TEXTO SEPARADA POR PUNTOS PORQUE ES MÁS FÁCIL DE ENVIAR A NODE QUE UN ARRAY QUE LUEGO HAY QUE PARSEAR.
            //debugger
            setKey ( state , { path , value })
            state.database.literales = JSON.cc ( state.database.literales )
        },
        set_contextDialogProps ( state, value ) {
            const path = ['contextDialog','props']
            setKey ( state , { path, value } )
        }
    },
    getters: {
        ventanas: ( state ) => state.ventanas.data,
        ventana: (state, getters) => (id) => {
          return getters.ventanas[id]
        },
        qeParams: (state, getters) => (windowId) => {
          return state.ventanas.data[windowId].queryeditor.parameters
        }
        
    },
    actions: {
        setVentana: ({getters,commit},id) => {
          
            //commit( 'write' , { cursor: getters.ventana(id) , data: "juan" } )
            commit( 'setVentana' , { index: id , data: "juan" } )
        },
        "context-menu": ( {commit,state}, {action,item,cursor,title,branchs,keysSettings} ) => {
            switch ( action ) {
                case 'open':
                    //console.log(data)
                    var campos = new objeto(item).toArray()
                    const data = {item,cursor,title,branchs,keysSettings}
                    //console.log(data)
                    commit ( 'ContextMenu_open', data )
                    break;
                case 'formChange':
                     //log(item)
                     //var campos = data
                     commit ( 'ContextMenu_formUpdate', item )
                     break;
                case 'save':
                     commit ( 'ContextMenu_commit' )
                     break;
                case 'clear':
                     commit ( 'ContextMenu_clear' )
                     break;
            }
        }
    }
}

export default actions