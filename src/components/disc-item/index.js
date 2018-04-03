import React from 'react'
import './index.scss'
import {Link} from 'react-router-dom'

export default class DiscItem extends React.PureComponent {

    render() {
        const {dissname, imgurl, creator,dissid} = this.props.disc
        const {name} = creator
        return (
            <Link to={`/recommend/${dissid}`}>
                <div className={'disc-item-container'}>
                    <img src={imgurl} alt=""/>
                    <div>
                        <span>{name}</span>
                        <span>{dissname}</span>
                    </div>
                </div>
            </Link>
        )
    }
}