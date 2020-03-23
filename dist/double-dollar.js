function $$ ( obj ) {
    const $$obj = {
        getCI ( searchKey, returnPath ) {
            if ( typeof obj != "object" ) return false
            if ( typeof searchKey == "object" && searchKey.length ) {
                //SI ES UN ARRAY ITERO LA RUTA DE PATHS
                //const searchArr = JSON.parse ( searchKey )
                return getCIeleFromArray ( searchKey, returnPath )
            } else {
                //SI NO ES ARRAY BUSCO LA PRIMERA CLAVE COINCIDENTE
                return getCIele ( obj, searchKey, returnPath )
            }
            function getCIele ( getObj, getKey, returnPath ) {
                let CIele = false
                Object.keys ( getObj ).forEach ( key => {
                    if ( key.toLowerCase() == getKey.toLowerCase() ) CIele = returnPath ? key : getObj[key]
                } )
                return CIele
            }
            function getCIeleFromArray ( searchArr, returnPath ) {
                if ( searchArr.length ) {
                    let ele = obj
                    , returnPathArr = []
                    searchArr.forEach ( pathEle => {
                        if ( !returnPath ) {
                            if ( !ele || typeof ele != "object" ) return ele
                        } else {
                            const CSkey = getCIele ( ele, pathEle, true )
                            if ( !CSkey ) return false
                            returnPathArr.push ( CSkey )
                        }
                        ele = getCIele ( ele, pathEle, false )
                    })
                    return returnPath ? returnPathArr : ele
                }
            }
        }
        , returnCSpath ( searchKey ) {
            return $$obj.getCI ( searchKey , true )
        }
        , parse () {
            try {
                obj = JSON.parse ( obj )
                return obj
            } catch ( err ) { return false }
        }
    } 
    return $$obj
}