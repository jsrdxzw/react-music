import React from 'react'
import './index.scss'

export default class ProgressBar extends React.PureComponent {

    constructor(props) {
        super(props)
        this.touch = {}
        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
        this.progressClick = this.progressClick.bind(this)
        this.barWidth = 0
    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.percent&&nextProps.percent!==this.props.percent && !this.touch.initiated){
            const offset = (nextProps.percent/100)*this.barWidth
            this.progress.style.width = `${offset}px`
            this.processBtn.style.left = `${7+offset}px`
        }
    }


    componentDidMount() {
        this.barWidth = this.progressBar.clientWidth
        const offset = (this.props.percent/100)*this.barWidth
        this.progress.style.width = `${offset}px`
        this.processBtn.style.left = `${7+offset}px`
    }


    render() {
        return (
            <div className={'progress-bar'} ref={self => this.progressBar = self} onClick={this.progressClick}>
                <div className="bar-inner">
                    <div className="progress" ref={self => this.progress = self}/>
                    <div className="progress-btn-wrapper" onTouchStart={this.onTouchStart}
                         onTouchMove={this.onTouchMove} onTouchEnd={this.onTouchEnd}>
                        <div className="progress-btn" ref={self => this.processBtn = self}/>
                    </div>
                </div>
            </div>
        )
    }

    onTouchStart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.progress.clientWidth
    }

    onTouchMove(e) {
        if (!this.touch.initiated) {
            return
        }
        const delta = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.progressBar.clientWidth, Math.max(0, this.touch.left + delta))
        this._offset(offsetWidth)
    }

    _offset(offsetWidth) {
        this.progress.style.width = `${offsetWidth}px`
        this.processBtn.style.left = `${7 + offsetWidth}px`
    }

    _triggerParent() {
        const barWidth = this.progressBar.clientWidth
        const percent = this.progress.clientWidth / barWidth
        this.props.onProgressChanged(percent)
    }

    progressClick(e) {
        const rect = this.progressBar.getBoundingClientRect()
        const offset = e.pageX - rect.left
        this._offset(offset)
        this._triggerParent()
    }

    onTouchEnd() {
        this.touch.initiated = false
        this._triggerParent()
    }
}

ProgressBar.defaultProps = {
    percent:0
}