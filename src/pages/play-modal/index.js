import React from 'react'
import './index.scss'
import {getLyric} from '../../api/song'
import DownIcon from 'react-icons/lib/io/chevron-down'
import PrevIcon from 'react-icons/lib/fa/backward'
import NextIcon from 'react-icons/lib/fa/forward'
import PlayIcon from 'react-icons/lib/fa/play-circle'
import PauseIcon from 'react-icons/lib/fa/pause-circle'
import RandomIcon from 'react-icons/lib/io/shuffle'
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
    startPlaying: states.playModal.startPlaying,
    stopPlaying: states.playModal.stopPlaying,
    changePlayModal:states.playModal.changePlayModal,
    prevIndex:states.playModal.prevIndex,
    nextIndex:states.playModal.nextIndex
}))
export default class PlaySong extends React.Component {

    constructor(props) {
        super(props)
        this.hiddenModal = this.hiddenModal.bind(this)
        this.timer = null
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
        const {playing} = this.props
        getLyric(playing.songmid).then(res => {
            this.initMusic()
        }).catch(e => console.log(e))
    }

    getLeftIcon() { //随机，顺序，单曲循环
        const modal = this.props.playModal
        switch (modal) {
            case 'sequence':
                return <RepeatIcon className={'icon i-left'} onClick={this.changePlayModal}/>
            case 'random':
                return <RandomIcon className={'icon i-left'} onClick={this.changePlayModal}/>
            case 'repeat':
                return <RepeatOneIcon className={'icon i-left'} onClick={this.changePlayModal}/>
        }
    }

    render() {
        const {playing, pause, percent, currentTime} = this.props
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
                    <div className="middle-l" ref="middleL">
                        <div className="cd-wrapper" ref="cdWrapper">
                            <img className={`image play${pause ? ' pause' : ''}`}
                                 src={`https://y.gtimg.cn/music/photo_new/T002R300x300M000${playing.albummid}.jpg?max_age=2592000`}
                                 alt=""
                            />
                        </div>
                        <div className="playing-lyric-wrapper">
                            <div className="playing-lyric">123</div>
                        </div>
                    </div>
                    <div className="middle-r" ref={self => this.lyricList = self}>
                        <div className="lyric-wrapper">
                            <div>
                                <p ref={self => this.lyricLine = self} className={'text'}>

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="dot-wrapper">
                        <span className={'dot'}/>
                        <span className={'dot'}/>
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

    middleTouchStart() {

    }

    middleTouchMove() {

    }

    middleTouchEnd() {

    }

    changePlayModal(){ //改变播放模式
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

    playError() {

    }


    playEnded() {
        this.props.timeUpdate(0)
    }

    onProgressChanged(percent) { //点击进度条之后
        const currentTime = this.props.playing.interval * percent
        this.audio.currentTime = currentTime
        this.props.timeUpdate(currentTime)

    }

    nextMusic(){ //切换下一首歌曲
      this.props.nextIndex()
    }

    prevMusic(){
        this.props.prevIndex()
    }


    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }


}