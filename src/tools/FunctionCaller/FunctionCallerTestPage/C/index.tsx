import React, { Component } from 'react'
import fc from '../../index'
import D from './D'

export default class C extends Component {
    incrementACount = ()=>{
        fc.call('A_add');
    }
    componentDidMount(){
        // fc.set('C_add')
    }
    render() {
        return (
            <div className='C'>
                C component...
                <button data-testid='increment_A_count' onClick={this.incrementACount}>increment A count</button>
                <hr />
                <D/>
            </div>
        )
    }
}
