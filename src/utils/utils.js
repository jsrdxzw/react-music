export function removeDuplicate(arr) {
    let arrs = [...arr]
    const unique = {}
    arrs.forEach((item) => {
        unique[item.albumid] = item
    })
    arrs = []
    for (let key in unique) {
        if (unique.hasOwnProperty(key)) {
            arrs.push(unique[key])
        }
    }
    return arrs
}

export function shuffle(arr) {
    const _arr = arr.slice()
    let m = _arr.length
    while (m) {
        const i = Math.floor(Math.random() * m--)
        const t = _arr[m]
        _arr[m] = _arr[i]
        _arr[i] = t
    }
    return _arr
}

let elementStyle = document.createElement('div').style

let vendor = () => {
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    }

    for (let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key
        }
    }

    return false
}

export function prefixStyle(style) {
    const _transform = vendor()
    if (_transform === false) {
        return false
    }

    if (_transform === 'standard') {
        return style
    }

    return _transform + style.charAt(0).toUpperCase() + style.substr(1)
}

export function parseQuery(str) {
    const _arr = decodeURIComponent(str.substring(1))
    const titleIndex = _arr.indexOf('title')
    return {bgImage:_arr.substring(0,titleIndex).split("=")[1],title:_arr.substring(titleIndex).split("=")[1]}
}

export function debounce(func,delay) {
    let timer = null
    return function (...args) {
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            func.apply(this,args)
        },delay)
    }
}