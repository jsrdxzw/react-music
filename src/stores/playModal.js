import {observable, action, runInAction, computed} from 'mobx'
import {removeDuplicate} from "../utils/utils"
import {getSongList} from "../api/recommend"
import {getSingerDetail} from '../api/singer'
import {getLyric} from "../api/song"
import {getMusicList} from '../api/rank'
import Lyric from 'lyric-parser'

class PlayModal {
    playModals = ['sequence', 'repeat']
    @observable playTime = 0
    @observable modalShow = false
    @observable playModal = this.playModals[0] //默认顺序播放
    @observable currentLyric = null //播放歌曲的歌词
    @observable pureMusicLyric = '' //纯音乐
    @observable pause = true //是否暂停
    @observable currentIndex = 0 //当前播放音乐的序号
    @observable fullScreen = true //是否为全屏播放
    @observable disc = {}

    @action
    switchModal = (isShow) => {
        this.modalShow = !!isShow
    }

    @action
    getDisc = (dissid) => {
        this._clearStatus()
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
    getSingerSong = (dissid, bgImage, title) => {
        this._clearStatus()
        if (dissid) {
            getSingerDetail(dissid).then(res => {
                const cdlist = res && res.data.list
                const songlist = cdlist.map(cd => cd.musicData)
                if (cdlist) {
                    const logo = bgImage
                    const dissname = title
                    runInAction(() => {
                        this.disc = {logo, dissname, songlist: songlist}
                    })
                }
            }).catch(e => console.log(e))
        }
    }

    @action
    getRankSong = (id)=>{
        this._clearStatus()
        getMusicList(id).then(res=>{
            const cdlist = res && res.songlist
            const songlist = cdlist.map(cd => cd.data)
            runInAction(()=>{
                this.disc = {logo:res.topinfo.pic_album,dissname:res.topinfo.ListName,songlist: songlist}
            })
        })
    }

    @action
    getSearchSong = (song)=>{
        if(song){
            this.disc = {songlist:[song]}
        } else {
            this._clearStatus()
        }
    }

    @action
    selectSong = (index)=>{
        this.currentIndex = index
        this.startPlaying()
        this.getLyric(this.playing.songmid)
    }

    @action
    getLyric = () => {
         getLyric(this.playing.songmid).then(res => {
            runInAction(() => {
                this.currentLyric = new Lyric(res)
            })
        }).catch(e => console.log(e))
    }

    @action
    nextIndex = () => {
        const songLength = this.disc.songlist.length
        this.currentIndex = (this.currentIndex + 1) % songLength
        this.getLyric(this.playing.songmid) //歌词还是得获取一下
    }

    @action
    prevIndex = () => {
        const songLength = this.disc.songlist.length
        this.currentIndex = (this.currentIndex - 1) < 0 ? songLength - 1 : this.currentIndex - 1
        this.getLyric(this.playing.songmid) //歌词还是得获取一下
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

    @action
    changeFullScreen = () => {
        this.fullScreen = !this.fullScreen
    }

    @computed get playing() {
        return this.disc.songlist ? this.disc.songlist[this.currentIndex] : {}
    }

    @computed get percent() {
        if (this.playing) {
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
        let interval = this.playing ? this.playing.interval | 0 : 0
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
                    return [_lyric[i].txt, i]
                }
                if (currentTime > _lyric[i].time-1000 && currentTime < _lyric[i + 1].time) {
                    return [_lyric[i].txt, i]
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

    _clearStatus() {
        this.playModals = ['sequence', 'repeat']
        this.playTime = 0
        this.modalShow = false
        this.playModal = this.playModals[0]
        this.currentLyric = null
        this.pureMusicLyric = ''
        this.pause = true
        this.currentIndex = 0
        this.fullScreen = true
        this.disc = {}
    }

}

const playModal = new PlayModal()

export default playModal