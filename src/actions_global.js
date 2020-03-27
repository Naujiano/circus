const state = getVuexDatabaseState ()
const actions_global = {
    set_favoriteToField ( {tableKeyName, fieldName} ) {
        const path = ['tables',`${tableKeyName}`,'fields_config',`${fieldName}`,'favorite']
        , CSpath = $$(state).getCIpath ( path )
        , actualValue = $$(state).getCI ( path )
        //debugger
        return ( { path: _.join ( CSpath, "." ) ,value: actualValue ? 0 :  1 } )
    },
    set_listModelNameToField ( { listModelName, tableName, fieldName } ) { 
        const path = ['tables',`${tableName}`,'fields_config',`${fieldName}`,'listModel']
        , CSpath = $$(state).getCIpath ( path )
        return ( { path: _.join ( CSpath, "." ) , value: listModelName } )
    }
}
export default actions_global;
function getVuexDatabaseState () {
    return JSON.parse ( localStorage["vuexStore"] ).database
}
