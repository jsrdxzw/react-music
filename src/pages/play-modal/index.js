import React from 'react'
import './index.scss'
import {prefixStyle} from '../../utils/utils'
import DownIcon from 'react-icons/lib/io/chevron-down'
import PrevIcon from 'react-icons/lib/fa/backward'
import NextIcon from 'react-icons/lib/fa/forward'
import PlayIcon from 'react-icons/lib/fa/play-circle'
import PauseIcon from 'react-icons/lib/fa/pause-circle'
import LikeIcon from 'react-icons/lib/fa/heart'
import RepeatIcon from 'react-icons/lib/md/repeat'
import RepeatOneIcon from 'react-icons/lib/md/repeat-one'
import ProgressBar from "../../components/progress-bar"
import {observer, inject} from 'mobx-react'

@observer
@inject((states) => ({
    playing: states.playModal.playing,
    pause: states.playModal.pause,
    percent: states.playModal.percent,
    currentTime: states.playModal.currentTime,
    playModal: states.playModal.playModal,
    timeUpdate: states.playModal.timeUpdate,
    playingLyric: states.playModal.playingLyric,
    currentLyric: states.playModal.currentLyric,
    startPlaying: states.playModal.startPlaying,
    stopPlaying: states.playModal.stopPlaying,
    changePlayModal: states.playModal.changePlayModal,
    prevIndex: states.playModal.prevIndex,
    nextIndex: states.playModal.nextIndex,
    duration: states.playModal.duration,
    getLyric: states.playModal.getLyric,
}))
export default class PlaySong extends React.Component {

    constructor(props) {
        super(props)
        this.hiddenModal = this.hiddenModal.bind(this)
        this.timer = null
        this.touch = {}
        this.lyric = ''
        this.state = {
            currentShow: 'cd'
        }
        this.transform = prefixStyle('transform')
        this.transitionDuration = prefixStyle('transitionDuration')
        this.middleTouchStart = this.middleTouchStart.bind(this)
        this.middleTouchMove = this.middleTouchMove.bind(this)
        this.middleTouchEnd = this.middleTouchEnd.bind(this)
        this.playEnded = this.playEnded.bind(this)
        this.pauseMusic = this.pauseMusic.bind(this)
        this.continuePlay = this.continuePlay.bind(this)
        this.timeUpdate = this.timeUpdate.bind(this)
        this.onProgressChanged = this.onProgressChanged.bind(this)
        this.changePlayModal = this.changePlayModal.bind(this)
        this.nextMusic = this.nextMusic.bind(this)
        this.prevMusic = this.prevMusic.bind(this)
    }

    componentDidMount() {
        const {playing, getLyric} = this.props
        getLyric(playing.songmid).then(() => {
            this.initMusic()
        })
    }

    getLeftIcon() { //随机，顺序，单曲循环
        const modal = this.props.playModal
        switch (modal) {
            case 'sequence':
                return <RepeatIcon className={'icon i-left'} onClick={this.changePlayModal}/>
            case 'repeat':
                return <RepeatOneIcon className={'icon i-left'} onClick={this.changePlayModal}/>
        }
    }

    render() {
        const {playing, pause, percent, currentTime, playModal, duration, playingLyric, currentLyric} = this.props
        return (
            <div className={'play-song-container'} ref={self => this.modal = self}>
                <div className="background">
                    <img
                        src={`https://y.gtimg.cn/music/photo_new/T002R300x300M000${playing.albummid}.jpg?max_age=2592000`}
                        alt="" width={'100%'} height={'100%'}/>
                </div>
                <div className="top">
                    <div className="back">
                        <DownIcon className={'icon-back'} onClick={this.hiddenModal}/>
                    </div>
                    <h1 className={'title'}>{playing.songname}</h1>
                    <h1 className={'sub-title'}>{playing.singer[0].name}</h1>
                </div>
                <div className="middle" onTouchStart={this.middleTouchStart} onTouchMove={this.middleTouchMove}
                     onTouchEnd={this.middleTouchEnd}>
                    <div className="middle-l" ref={self => this.middleL = self}>
                        <div className="cd-wrapper" ref="cdWrapper">
                            <img className={`image play${pause ? ' pause' : ''}`}
                                 src={`https://y.gtimg.cn/music/photo_new/T002R300x300M000${playing.albummid}.jpg?max_age=2592000`}
                                 alt=""
                            />
                        </div>
                        <div className="playing-lyric-wrapper">
                            <div className="playing-lyric">{playingLyric[0]}</div>
                        </div>
                    </div>
                    <div className="middle-r" ref={self => this.lyricList = self}>
                        <div className="lyric-wrapper">
                            <div>
                                <p className={`text current`}>{playingLyric[0]}</p>
                                <p className={`text`}>{currentLyric&&currentLyric.lines[playingLyric[1] + 1]&&currentLyric.lines[playingLyric[1] + 1].txt}</p>
                                <p className={`text`}>{currentLyric&&currentLyric.lines[playingLyric[1] + 2]&&currentLyric.lines[playingLyric[1] + 2].txt}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="dot-wrapper">
                        <span className={`dot${this.state.currentShow === 'cd' ? ' active' : ''}`}/>
                        <span className={`dot${this.state.currentShow === 'cd' ? '' : ' active'}`}/>
                    </div>
                    <div className="progress-wrapper">
                        <span className={'time time-l'}>
                            {currentTime}
                        </span>
                        <div className="progress-bar-wrapper">
                            <ProgressBar
                                percent={percent}
                                onProgressChanged={this.onProgressChanged}
                            />
                        </div>
                        <span className="time time-r">{duration}</span>
                    </div>
                    <div className="operators">
                        {this.getLeftIcon()}
                        <PrevIcon className={'icon i-left'} onClick={this.prevMusic}/>
                        {pause ? <PlayIcon className={'icon i-center'} onClick={this.continuePlay}/> :
                            <PauseIcon className={'icon i-center'} onClick={this.pauseMusic}/>}
                        <NextIcon className={'icon i-right'} onClick={this.nextMusic}/>
                        <LikeIcon className={'icon i-right'}/>
                    </div>
                </div>
                <audio
                    ref={self => this.audio = self}
                    src={`http://ws.stream.qqmusic.qq.com/C100${playing.songmid}.m4a?fromtag=0`}
                    onError={this.playError}
                    onEnded={this.playEnded}
                    autoPlay={true}
                    onTimeUpdate={this.timeUpdate}
                    loop={playModal === 'repeat'}
                >
                </audio>
            </div>
        )
    }

    initMusic() {
        this.props.startPlaying()
    }

    hiddenModal() {
        this.modal.setAttribute('class', 'play-song-container dismiss')
        this.timer = setTimeout(() => {
            this.props.hiddenModal()
        }, 400)
    }

    middleTouchStart(e) {
        this.touch.initiated = true
        this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY

    }

    middleTouchMove(e) {
        if (!this.touch.initiated) return
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return
        }
        if (!this.touch.moved) {
            this.touch.moved = true
        }
        const left = this.state.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.lyricList.style[this.transform] = `translate(${offsetWidth}px,0)`
        this.lyricList.style.opacity = this.touch.percent
    }


    middleTouchEnd() {
        if (!this.touch.moved) return
        let offsetWidth
        let opacity
        if (this.state.currentShow === 'cd') {
            if (this.touch.percent > 0.1) {
                offsetWidth = -window.innerWidth
                opacity = 0
                this.setState({
                    currentShow: 'lyric'
                })
            } else {
                offsetWidth = 0
                opacity = 1
            }
        } else {
            if (this.touch.percent < 0.9) {
                offsetWidth = 0
                this.setState({
                    currentShow: 'cd'
                })
                opacity = 1
            } else {
                offsetWidth = -window.innerWidth
                opacity = 0
            }
        }
        const time = 300
        this.lyricList.style[this.transform] = `translate(${offsetWidth}px,0)`
        this.lyricList.style[this.transitionDuration] = `${time}ms`
        this.middleL.style.opacity = opacity
        this.middleL.style[this.transitionDuration] = `${time}ms`
        this.touch.initiated = false
    }

    changePlayModal() { //改变播放模式
        this.props.changePlayModal(this.props.playModal)
    }

    pauseMusic() {
        this.audio.pause()
        this.props.stopPlaying()
    }

    continuePlay() {
        this.props.startPlaying()
        this.audio.play()
    }

    timeUpdate(e) {
        this.props.timeUpdate(e.target.currentTime)
    }

    playError(e) {
        console.log('播放错误', e)
    }

    playEnded() {
        this.props.timeUpdate(0)
        this.props.nextIndex()
    }

    onProgressChanged(percent) { //点击进度条之后
        const currentTime = this.props.playing.interval * percent
        this.audio.currentTime = currentTime
        this.props.timeUpdate(currentTime)
    }

    nextMusic() { //切换下一首歌曲
        this.props.nextIndex()
    }

    prevMusic() {
        this.props.prevIndex()
    }


    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

}