import React from 'react'
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router-dom'
import './index.scss'
import Loader from "../../components/loader"

@observer
@inject(states => ({
    topList: states.rank.topList,
    getTopList: states.rank.getTopList
}))
@withRouter
export default class Rank extends React.Component {

    componentDidMount() {
        this.props.getTopList()
    }

    render() {
        const {topList} = this.props
        return (
            <div className={'rank-container'}>
                <ul>
                    {topList.length ? topList.map(item => (
                        <li className={'item'} key={item.id} onClick={()=>this.selectItem(item.id)}>
                                <div className={'icon'}>
                                    <img width="100" height="100" src={item.picUrl}/>
                                </div>
                                <ul className={'songlist'}>
                                    {item.songList && item.songList.map((song, index) => (
                                        <li className={'song'} key={index}>
                                            <span>{index + 1}</span>
                                            <span>{song.songname}-{song.singername}</span>
                                        </li>
                                    ))}
                                </ul>
                        </li>
                    )) : <Loader/>}
                </ul>
            </div>
        )
    }

    selectItem(id){
        this.props.history.push(`/rank/${id}`)
    }
}