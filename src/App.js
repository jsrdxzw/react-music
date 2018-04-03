import React, {Component} from 'react'
import './scss/index.scss'
import MHeader from "./components/m-header"
import Tab from "./components/tab"
import {CommonRouter} from './router'

class App extends Component {
    render() {
        return (
            <div>
                <MHeader/>
                <Tab/>
                <CommonRouter/>
            </div>
        )
    }
}

export default App
