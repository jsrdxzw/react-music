import {commonParams} from './config'
import axios from 'axios'
import {Base64} from 'js-base64'

function MusicJsonCallback(data) {
    return data
}

export function getLyric(mid) {
    const url = '/apiMusic/getRecommend/lyric'

    const data = Object.assign({}, commonParams, {
        songmid: mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        const data = eval(res.data)
        const lyric = Base64.decode(data.lyric)
        return Promise.resolve(lyric)
    })
}