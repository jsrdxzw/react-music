import React from 'react'
import ReactSwipe from 'react-swipe'
import {observer, inject} from 'mobx-react'
import './index.scss'

import DiscItem from "../../components/disc-item"

@inject(stores => ({
    sliders: stores.recommend.sliders.slice(),
    discs: stores.recommend.discs.slice(),
    getSliders: stores.recommend.getSliders,
    getDiscs: stores.recommend.getDiscs
}))
@observer
export default class Recommend extends React.Component {
    constructor(props) {
        super(props)
        this.swipeOptions = {
            speed: 600,
            auto: 4000,
        }
        this.state = {
            index:0
        }
        this.swipeHandle = this.swipeHandle.bind(this)
    }


    componentDidMount() {
        if(!this.props.sliders.length){
            this.props.getSliders()
        }
        if(!this.props.discs.length){
            this.props.getDiscs()
        }
    }

    getIndicator(sliders) {
        return sliders.length ? (
            <div className="indicator-container">
                {sliders.map((item, index) => (
                    <span className={`indicator ${this.state.index === index ? 'active' : ''}`} key={index}/>
                ))}
            </div>
        ) : null
    }

    render() {
        const { sliders, discs, index} = this.props
        const swipeOptions = {...this.swipeOptions, callback: this.swipeHandle}
        return (
            <div className={'recommend-container'}>
                {sliders.length ?
                    <ReactSwipe className="carousel" swipeOptions={swipeOptions}>
                        {sliders.map(slider => (
                            <a href={slider.linkUrl} key={slider.id} target={'_black'}>
                                <img src={slider.picUrl} alt=""/>
                            </a>
                        ))}
                    </ReactSwipe> : null}
                {this.getIndicator(sliders, index)}
                <h1>热门歌单推荐</h1>
                <div className="disc-container">
                    {discs.map((disc) => (
                        <DiscItem disc={disc} key={disc.dissid}/>
                    ))}
                </div>
            </div>
        )
    }

    swipeHandle(index){
        this.setState({
            index
        })
    }
}