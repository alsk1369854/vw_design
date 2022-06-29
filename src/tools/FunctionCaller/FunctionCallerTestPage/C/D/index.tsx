import React, { Component } from 'react'
// import PubSub from 'pubsub-js'
import fc from '../../../index';

export default class D extends Component {
    say = (data?:any ,data2?:any ,data3?:any,data4?:any)=>{
        console.log(data,data2,data3,data4);
        console.log('Say from D component')
    }
    bSayFn = ()=>{
        fc.call('B_say')
    }
    
    componentDidMount(){
        console.log('aaa');
        fc.set('D_say', this.say)
    }

    render() {
        return (
            <div className='D'>
                D component...
                <button onClick={this.bSayFn}>B_say</button>
            </div>
        )
    }
}
