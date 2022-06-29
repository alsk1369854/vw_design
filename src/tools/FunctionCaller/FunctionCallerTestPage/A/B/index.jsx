import React, { Component } from 'react'
// import PubSub from 'pubsub-js'
import fc from '../../../index';

export default class B extends Component {
    state ={count:0}
    say = ()=>{
        // console.log(data);
        console.log('Say from B component')
        this.setState({count: this.state.count+1})
    }
    dSayFn = ()=>{
        fc.call('D_say',[1,2,3, 'hi'])
    }

    componentDidMount(){
        fc.set('B_say', this.say)
    }
    
    render() {
        return (
            <div className='B'>
                <div>B: {this.state.count}</div>
                B component...
                <button onClick={this.dSayFn}>D_say</button>
            </div>
        )
    }
}
