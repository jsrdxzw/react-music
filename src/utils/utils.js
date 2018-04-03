export function removeDuplicate(arr) {
    let arrs = [...arr]
    const unique = {}
    arrs.forEach((item)=>{
        unique[item.albumid] = item
    })
    arrs = []
    for(let key in unique){
        if(unique.hasOwnProperty(key)){
            arrs.push(unique[key])
        }
    }
    return arrs;
}