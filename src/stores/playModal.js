import {observable, action, runInAction, computed} from 'mobx'
import {removeDuplicate, shuffle} from "../utils/utils"
import {getSongList} from "../api/recommend"
import {getLyric} from "../api/song"
import Lyric from 'lyric-parser'

class PlayModal {
    playModals = ['sequence', 'repeat']
    @observable playTime = 0
    @observable modalShow = false
    @observable playModal = this.playModals[0] //默认顺序播放
    @observable currentLyric = null //播放歌曲的歌词
    @observable  pureMusicLyric = '' //纯音乐
    @observable pause = true //是否暂停
    @observable currentIndex = 0 //当前播放音乐的序号
    @observable disc = {}

    @action
    switchModal = (isShow, index) => {
        this.modalShow = !!isShow
        if (isShow) {
            this.currentIndex = index
        }
    }

    @action
    getDisc = (dissid) => {
        this.disc = {}
        if (dissid) {
            getSongList(dissid).then(res => {
                const cdlist = res && res.cdlist[0]
                if (cdlist) {
                    const logo = cdlist.logo
                    const dissname = cdlist.dissname
                    const songlist = cdlist.songlist
                    runInAction(() => {
                        this.disc = {logo, dissname, songlist: removeDuplicate(songlist)}
                    })
                }
            }).catch(e => console.log(e))
        }
    }

    @action
    getLyric = (songmid) => {
        return getLyric(songmid).then(res => {
            runInAction(() => {
                this.currentLyric = new Lyric(res)
            })
            return Promise.resolve()
        }).catch(e => console.log(e))
    }

    @action
    nextIndex = () => {
        const songLength = this.disc.songlist.length
        this.currentIndex = (this.currentIndex + 1) % songLength
        this.getLyric(this.playing.songmid)
    }

    @action
    prevIndex = () => {
        const songLength = this.disc.songlist.length
        this.currentIndex = (this.currentIndex - 1) < 0 ? songLength - 1 : this.currentIndex - 1
        this.getLyric(this.playing.songmid)
    }

    @action
    startPlaying = () => {
        this.pause = false
    }

    @action
    stopPlaying = () => {
        this.pause = true
    }

    @action
    timeUpdate = (time) => {
        this.playTime = time
    }

    @action
    changePlayModal = (modal) => {
        const index = (this.playModals.indexOf(modal) + 1) % this.playModals.length
        this.playModal = this.playModals[index]
    }

    @computed get playing() {
        return this.disc.songlist && this.disc.songlist[this.currentIndex]
    }

    @computed get percent() {
        if(this.playing){
            return (this.playTime / this.playing.interval) * 100
        }
        return 0
    }

    @computed get currentTime() {
        let interval = this.playTime | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
    }

    @computed get duration() {
        let interval = this.playing.interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
    }


    /** 2018/4/4
     * author: XU ZHI WEI
     * function: 返回一个数组
     */
    @computed get playingLyric() { //正在播放的歌词
        if (this.currentLyric && this.currentLyric.lines && this.currentLyric.lines.length) {
            const currentTime = this.playTime * 1000
            const _lyric = this.currentLyric.lines
            for (let i = 0; i < _lyric.length; i++) {
                if (i === _lyric.length - 1) {
                    return [_lyric[i].txt,i]
                }
                if (currentTime > _lyric[i].time && currentTime < _lyric[i + 1].time) {
                    return [_lyric[i].txt,i]
                }
            }
        } else {
            return '此歌曲为纯音乐，请您欣赏'
        }
    }


    _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
            num = '0' + num
            len++
        }
        return num
    }
}

const playModal = new PlayModal()

export default playModal