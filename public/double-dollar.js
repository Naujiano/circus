function $$ ( obj ) {
    if ( typeof obj != "object" ) return obj
    const $$obj = {} //JSON.parse ( JSON.stringify ( obj ) )
    $$obj.getCI = ( searchKey ) => {
        let val 
        Object.keys ( obj ).forEach ( key => {
            if ( key.toLowerCase() == searchKey.toLowerCase() ) val = obj[key]
        } )
        return val
    }
    return $$obj
}