import React from 'react'
import {observer, inject} from 'mobx-react'
import Loader from "../../components/loader"
import './index.scss'
import SingerGroup from "../../components/singer-group"


@inject((states) => ({
    getSingerList: states.singers.getSingerList,
    singerList: states.singers.singerList.slice() //是个二维数组
}))
@observer
export default class Singer extends React.Component {


    componentDidMount() {
        this.props.getSingerList()
    }

    render() {
        const {singerList} = this.props
        return (
            <div className={'singer-container'}>
                {singerList.length ? this.getSingerListView() : <Loader/>}
            </div>
        )
    }

    getSingerListView() {
        const {singerList} = this.props
        return singerList.map((singerGroup,index) => {
            return (
                <SingerGroup key={index} singerGroup={singerGroup}/>
            )
        })
    }
}