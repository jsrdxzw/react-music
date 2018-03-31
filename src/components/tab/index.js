import React from 'react'
import './index.scss'
import {NavLink} from 'react-router-dom'

export default class Tab extends React.Component {

    render() {
        return (
            <div className={'tab-container'}>
                <NavLink to={'/recommend'}><span>推荐</span></NavLink>
                <NavLink to={'/singer'}><span>歌手</span></NavLink>
                <NavLink to={'/rank'}><span>排行</span></NavLink>
                <NavLink to={'/search'}><span>搜索</span></NavLink>
            </div>
        )
    }
}