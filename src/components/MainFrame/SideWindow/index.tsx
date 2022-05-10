import { CSSProperties, memo } from 'react';
import style from './index.module.scss';


class Window {
    element: JSX.Element;

    constructor(element: JSX.Element){
        this.element = element;
    }
}

const SideWindow = memo((props: {intWidth: number, arrNames: Array<string>, intState: number}) => {
    const arrSideWindow: Array<Window> = [
        new Window(<></>),
        new Window(<div>{props.arrNames[1]}</div>),
        new Window(<div>{props.arrNames[2]}</div>),
        new Window(<div>{props.arrNames[3]}</div>),
        new Window(<div>{props.arrNames[4]}</div>),
        new Window(<div>{props.arrNames[5]}</div>)
    ]


    const css: CSSProperties = {
        width: props.intWidth,
    }
    return (
        <div
            style={css}
            className={style.div}
        >
            {(props.intState !== -1)? arrSideWindow[props.intState].element : <></>}
        </div>
    )
})

export default SideWindow;