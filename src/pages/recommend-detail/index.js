import React from 'react'
import './index.scss'
import ArrowIcon from 'react-icons/lib/io/ios-arrow-back'
import Loader from "../../components/loader"
import PlaySong from "../play-modal"
import {observer,inject} from 'mobx-react'

@inject(stores=>({
    modalShow:stores.playModal.modalShow,
    playing:stores.playModal.playing,
    dissname:stores.playModal.disc.dissname,
    logo:stores.playModal.disc.logo,
    songlist:stores.playModal.disc.songlist,
    getDisc:stores.playModal.getDisc,
    switchModal:stores.playModal.switchModal
}))
@observer
export default class RecommendDetail extends React.Component {

    constructor(props) {
        super(props)
        this.handleBack = this.handleBack.bind(this)
        this.hiddenModal = this.hiddenModal.bind(this)
    }


    componentDidMount() {
        const dissid = this.props.match.params.id
        this.props.getDisc(dissid)
    }

    render() {
        const {modalShow,dissname,logo,songlist} = this.props
        return (
            <div className={'recommend-detail-container'} ref={self=>this.detailRecommend = self}>
                <div className="header">
                    <ArrowIcon className={'arrow'} scale={2} onClick={this.handleBack}/>
                    <h3>{dissname}</h3>
                    <img src={logo} alt=""/>
                </div>
                <div className="list">
                    {songlist?songlist.map((song,index)=>(
                        <div className={'song-item'} key={song.albumname} onClick={(e)=>this.selectSong(index)}>
                            <h3>{song.songname}</h3>
                            <p>{song.singer[0].name}</p>
                        </div>
                    )):<Loader/>}
                </div>
                {modalShow?<PlaySong hiddenModal={this.hiddenModal}/>:null}
            </div>
        )
    }

    /** 2018/4/2
     * author: XU ZHI WEI
     * function:选定了一个歌曲进行播放
     */
    selectSong(index){
        this.detailRecommend.style.overflow = 'hidden'
        this.props.switchModal(true,index)
    }

    hiddenModal(){
        this.detailRecommend.style.overflow = 'auto'
        this.props.switchModal(false)
    }

    handleBack(){
        this.props.history.goBack()
    }
}