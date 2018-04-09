import React from 'react'
import SearchIcon from 'react-icons/lib/io/ios-search'
import DismissIcon from 'react-icons/lib/io/ios-close'
import './index.scss'
import {observer, inject} from 'mobx-react'

@inject(states => ({
    changeSearchValue: states.search.changeSearchValue,
    searchValue:states.search.searchValue
}))
@observer
export default class SearchBox extends React.Component {

    constructor(props) {
        super(props)
        this.dismissValue = this.dismissValue.bind(this)
        this.valueChange = this.valueChange.bind(this)
    }

    render() {
        const {placeholder,searchValue} = this.props
        return (
            <div className={'search-box'}>
                <SearchIcon className={'icon-search'}/>
                <input type="text" ref={self => this.query = self} className={'box'} placeholder={placeholder}
                       onChange={this.valueChange} value={searchValue}/>
                <DismissIcon className={'icon-dismiss'} onClick={this.dismissValue}/>
            </div>
        )
    }

    dismissValue() {
        this.query.value = ''
        this.props.changeSearchValue('')
    }

    valueChange(e) {
        const queryValue = e.target.value
        this.props.changeSearchValue(queryValue)
    }
}

SearchBox.defaultProps = {
    placeholder: '搜索歌曲、歌手',
    value: ''
}