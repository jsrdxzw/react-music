import React from 'react'
import {observer, inject} from 'mobx-react'
import MusicIcon from 'react-icons/lib/io/ios-musical-note'
import './index.scss'
import PlaySong from "../../pages/play-modal"

@inject(states => ({
    searchResult: states.search.searchResult,
    getSearchSong: states.playModal.getSearchSong,
    modalShow: states.playModal.modalShow,
    switchModal: states.playModal.switchModal,
    selectSong: states.playModal.selectSong,
    stopPlaying: states.playModal.stopPlaying,
    fullScreen:states.playModal.fullScreen
}))
@observer
export default class Suggest extends React.Component { //搜索结果

    constructor(props) {
        super(props)
        this.hiddenModal = this.hiddenModal.bind(this)
    }


    componentDidMount() {
        this.props.getSearchSong('')
    }


    render() {
        const {searchResult, modalShow} = this.props
        return (
            <div className={'suggest'} ref={self=>this.musicList = self}>
                <ul className={'suggest-list'}>
                    {searchResult.map((song, index) => (
                        <li key={song.songid + index * Math.random()} className={'suggest-item'}
                            onClick={() => this.selectSong(song)}>
                            <MusicIcon className={'icon'}/>
                            <div className="name">
                                <p className={'text'}>{this.getDisplayName(song)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                {modalShow ? <PlaySong hiddenModal={this.hiddenModal}/> : null}
            </div>
        )
    }

    getDisplayName(item) {
        if (item.type === 'singer') {
            return item.singer?item.singer[0].name:''
        } else {
            return `${item.songname}-${item.singer[0].name}`
        }
    }

    hiddenModal(dismiss = false) {
        this.musicList.style.overflow = 'auto'
        this.musicList.style.paddingBottom = '60px'
        if (dismiss) {
            this.musicList.style.paddingBottom = '0'
            this.props.switchModal(false)
        }
    }


    selectSong(song) {
        this.props.getSearchSong(song)
        if (this.props.fullScreen) {
            this.musicList.style.overflow = 'hidden'
        } else {
            this.musicList.style.overflow = 'auto'
        }
        this.props.selectSong(0)
        this.props.switchModal(true)
    }
}

Suggest.defaultProps = {
    showSinger: true,
    query: ''
}