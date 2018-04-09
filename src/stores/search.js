import {observable, action, runInAction} from 'mobx'
import {getHotKey, searchSong} from '../api/search'
import {debounce} from '../utils/utils'

class Search {
    @observable hotKey = []
    @observable searchResult = []
    @observable searchValue = ''

    @action
    getHotKey = () => {
        getHotKey().then(res => {
            const hotkey = res.data.hotkey
            runInAction(() => {
                this.hotKey = hotkey.slice(0, 10)
            })
        })
    }

    @action
    getSearchSong = (page = 1, showSinger = true, perpage = 40) => {
        const TYPE_SINGER = 'singer'
        let ret = []
        if (this.searchValue.trim()) {
            debounce(() => {
                searchSong(this.searchValue, page, showSinger, perpage).then(res => {
                    const data = res.data
                    if (data.zhida && data.zhida.singerid) {
                        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
                    }
                    if (data.song) {
                        ret = ret.concat(data.song.list)
                    }
                    runInAction(() => {
                        this.searchResult = ret
                    })
                })
            }, 200)()
        } else {
            this.searchResult = []
        }
    }

    @action
    changeSearchValue = (value) => {
        this.searchValue = value
        this.getSearchSong()
    }

    // _normalizeSongs(list) {
    //     let ret = []
    //     list.forEach((musicData) => {
    //         if (musicData.songid && musicData.albummid) {
    //             ret.push(createSong(musicData))
    //         }
    //     })
    //     return ret
    // }
}

const search = new Search()

export default search