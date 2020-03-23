function $$ ( obj ) {
    if ( !obj ) return false
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
            function getCIeleFromArray ( searchArr, returnPath ) {
                if ( searchArr.length ) {
                    let ele = obj
                    , returnPathArr = []
                    searchArr.forEach ( pathEle => {
                        if ( !returnPath ) {
                            if ( !ele || typeof ele != "object" ) return ele
                        } else {
                            const CSkey = getCIele ( ele, pathEle, true )
                            returnPathArr.push ( CSkey ? CSkey : pathEle )
                        }
                        ele = getCIele ( ele, pathEle, false )
                    })
                    return returnPath ? returnPathArr : ele
                }
            }
        }
        , setCI ( searchArr, value ) {
            if ( searchArr.length ) {
                let ele = obj
                , parentElement = false
                , success = true
                searchArr.forEach ( ( pathEle, i ) => {
                    if ( typeof ele != "object" ) success = false
                    ele = getCIele ( ele, pathEle, false )
                    if ( !ele ) {
                        ele = parentElement[pathEle] = {}
                        //ele = parentElement[pathEle]
                        //Object.assign ( obj , { [pathEle]: {} } )
                    }
                    if ( i == searchArr.length - 1 ) {
                        ele = value
                    }
                    parentElement = ele
                })

                return success
            }
        }
        , getCIpath ( searchKey ) {
            return $$obj.getCI ( searchKey , true )
        }
        , parse () {
            try {
                obj = JSON.parse ( obj )
                return obj
            } catch ( err ) { return false }
        }
    } 
    function getCIele ( getObj, getKey, returnPath ) {
        let CIele = false
        Object.keys ( getObj ).forEach ( key => {
            if ( key.toLowerCase() == getKey.toLowerCase() ) CIele = returnPath ? key : getObj[key]
        } )
        return CIele
    }
    return $$obj
}