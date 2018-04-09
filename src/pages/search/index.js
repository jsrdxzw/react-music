import React from 'react'
import './index.scss'
import SearchBox from "../../components/search-box"
import {observer, inject} from 'mobx-react'
import Suggest from "../../components/suggest"

@inject(states => ({
    getHotKey: states.search.getHotKey,
    changeSearchValue: states.search.changeSearchValue,
    hotKey: states.search.hotKey,
    searchResult: states.search.searchResult
}))
@observer
export default class Search extends React.Component {

    componentDidMount() {
        this.props.getHotKey()
    }

    render() {
        const {hotKey, searchResult} = this.props
        return (
            <div className={'search-container'}>
                <div className="search-box-wrapper">
                    <SearchBox/>
                </div>
                {searchResult.length ?
                    <div className="search-result">
                        <Suggest/>
                    </div>
                    :
                    <div className="shortcut-wrapper">
                        <div>
                            <div className="hot-key">
                                <h1 className="title">热门搜索</h1>
                                <ul>
                                    {hotKey.length ? hotKey.map((hot, index) => (
                                        <li onClick={() => this.addQuery(hot.k)} key={hot.n + index} className={'item'}>
                                            <span>{hot.k}</span>
                                        </li>
                                    )) : null}
                                </ul>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }

    addQuery(key) {
        this.props.changeSearchValue(key)
    }
}