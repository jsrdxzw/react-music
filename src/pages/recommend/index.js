import React from 'react'
import ReactSwipe from 'react-swipe'
import './index.scss'
import {getRecommend} from '../../api/recommend'


export default class Recommend extends React.Component {
    constructor(props) {
        super(props)
        this.swipeOptions = {
            speed: 400,
            auto: 3000,
        }
        this.state = {
            index: 0,
            sliders: []
        }
        this.swipeHandle = this.swipeHandle.bind(this)
    }


    componentDidMount() {
        getRecommend().then(res => {
            this.setState({
                sliders: res.data.slider
            })
        })
    }


    getIndicator() {
        return this.state.sliders.length ? (
            <div className="indicator-container">
                {this.state.sliders.map((item, index) => (
                    <span className={`indicator ${this.state.index === index ? 'active' : ''}`} key={index}/>
                ))}
            </div>
        ) : null
    }

    render() {
        const swipeOptions = {...this.swipeOptions, callback: this.swipeHandle}
        return (
            <div className={'recommend-container'}>
                {this.state.sliders.length ?
                    <ReactSwipe className="carousel" swipeOptions={swipeOptions}>
                        {this.state.sliders.map(slider => (
                            <a href={slider.linkUrl} key={slider.id} target={'_black'}>
                                <img src={slider.picUrl} alt=""/>
                            </a>
                        ))}
                    </ReactSwipe> : null}
                {this.getIndicator()}
            </div>
        )
    }

    swipeHandle(index) {
        this.setState({
            index
        })
    }

}