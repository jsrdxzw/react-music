import {observable, action, runInAction, computed} from 'mobx'
import {removeDuplicate} from "../utils/utils"
import {getSongList} from "../api/recommend"

class PlayModal {
    playModals = ['sequence', 'repeat', 'random']
    @observable playTime = 0
    @observable modalShow = false
    @observable playModal = this.playModals[0] //默认顺序播放
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
    nextIndex = () => {
        const songLength = this.disc.songlist.length
        this.currentIndex = (this.currentIndex + 1) % songLength
    }

    @action
    prevIndex = ()=>{
        const songLength = this.disc.songlist.length
        this.currentIndex = (this.currentIndex - 1)<0? songLength-1 : this.currentIndex-1
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
        return (this.playTime / this.playing.interval) * 100
    }

    @computed get currentTime() {
        let interval = this.playTime | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
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