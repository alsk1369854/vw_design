import React, { Component } from 'react'
import fc from '../../index'
import B from './B'



export default class A extends Component {
    state = {count:0}
    removeBSayFn =()=>{
        console.log(fc.remove('B_say'))
        console.log('B_say is remove');
    }

    componentDidMount(){
        fc.set('A_add', ()=>{
            this.setState({count: this.state.count+1});
        })
    }
    render() {
        return (
            <div className='A'>
                A
                <div data-testid='A_value'>{this.state.count}</div>
                <button onClick={this.removeBSayFn}>remove B_say function</button>
                <hr />
                <B/>
            </div>
        )
    }
}
