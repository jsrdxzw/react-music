import React from 'react'
import './index.scss'
import ArrowIcon from 'react-icons/lib/io/ios-arrow-back'
import Loader from "../../components/loader"
import {observer, inject} from 'mobx-react'
import PlaySong from "../../pages/play-modal"
import {parseQuery} from '../../utils/utils'

@inject(stores => ({
    modalShow: stores.playModal.modalShow,
    playing: stores.playModal.playing,
    dissname: stores.playModal.disc.dissname,
    logo: stores.playModal.disc.logo,
    songlist: stores.playModal.disc.songlist,
    fullScreen: stores.playModal.fullScreen,
    getDisc: stores.playModal.getDisc,
    getSingerSong: stores.playModal.getSingerSong,
    selectSong:stores.playModal.selectSong,
    switchModal: stores.playModal.switchModal,
    getRankSong:stores.playModal.getRankSong,
    startPlaying: stores.playModal.startPlaying
}))
@observer
export default class MusicList extends React.Component {
    constructor(props) {
        super(props)
        this.handleBack = this.handleBack.bind(this)
        this.hiddenModal = this.hiddenModal.bind(this)
    }

    componentDidMount() {
        this.initData()
    }

    render() {
        const {modalShow, dissname, logo, songlist} = this.props
        return (
            <div className={'music-list-container'} ref={self => this.musicList = self}>
                <div className="header">
                    <ArrowIcon className={'arrow'} scale={2} onClick={this.handleBack}/>
                    <h3>{dissname}</h3>
                    <img src={logo} alt=""/>
                </div>
                <div className="list">
                    {songlist ? songlist.map((song, index) => (
                        <div className={'song-item'} key={song.albumname + index}
                             onClick={(e) => this.selectSong(index)}>
                            <h3>{song.songname}</h3>
                            <p>{song.singer[0].name}</p>
                        </div>
                    )) : <Loader/>}
                </div>
                {modalShow ? <PlaySong hiddenModal={this.hiddenModal}/> : null}
            </div>
        )
    }

    /** 2018/4/2
     * author: XU ZHI WEI
     * function:选定了一个歌曲进行播放
     */
    selectSong(index) {
        if (this.props.fullScreen) {
            this.musicList.style.overflow = 'hidden'
        } else {
            this.musicList.style.overflow = 'auto'
        }
        this.props.selectSong(index)
        this.props.switchModal(true, index)
    }

    hiddenModal(dismiss = false) {
        this.musicList.style.overflow = 'auto'
        if (dismiss) {
            this.props.switchModal(false)
        }
    }

    handleBack() {
        this.props.history.goBack()
    }

    initData() {
        const dissid = this.props.match.params.id
        const type = this.props.type
        switch (type) {
            case 'recommend':
                this.props.getDisc(dissid)
                break
            case 'singer':
                const {bgImage, title} = parseQuery(this.props.location.search)
                this.props.getSingerSong(dissid, bgImage, title)
                break
            case 'rank':
                this.props.getRankSong(dissid)
                break
        }
    }
}