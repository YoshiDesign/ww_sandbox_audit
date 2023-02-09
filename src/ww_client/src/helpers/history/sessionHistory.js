export function incrSessionInt(key){
    var n = Number(sessionStorage.getItem(key))
    return ++n
}