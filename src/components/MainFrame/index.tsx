import { CSSProperties, memo, useRef, useState } from 'react';
import style from './index.module.scss';

import IconBar from './IconBar';
import SideWindow from './SideWindow';
import EditArea from './EditArea';


const intIconBarWidth: number = 60;
const arrUseStates: Array<string> = [
    "Edit",
    "Folder",
    "Magnifier",
    "PaperAirplane",
    "Bulb",
    "Plug-in"
]

const MainFrame = memo(() => {
    const isFirstRender = useRef(true);
    const [intUseState, setUseState] = useState(-1);

    const [intSideWindowWidth, setSideWindowWidth] = useState(0);
    const getEditAreaNewWidth: Function = (): number => {return window.innerWidth - intIconBarWidth - intSideWindowWidth};
    const updateSideWindowWidth: Function = (intSideWindowNewWidth: number) => {
        setSideWindowWidth(intSideWindowNewWidth);
        setEditAreaWidth(window.innerWidth - intIconBarWidth - intSideWindowNewWidth);
    }

    const [intEditAreaWidth, setEditAreaWidth] = useState(getEditAreaNewWidth());
    if (isFirstRender.current){
        window.addEventListener("resize", () => setEditAreaWidth(getEditAreaNewWidth()));
    }


    isFirstRender.current = false;
    return (
        <div className={style.div}>
            <IconBar arrButtonNames={arrUseStates} funcSetUseState={setUseState} funcSetSideWindowWidth={updateSideWindowWidth} />
            <SideWindow intWidth={intSideWindowWidth} arrNames={arrUseStates} intState={intUseState} />
            <EditArea intWidth={intEditAreaWidth} />
        </div>
    )
})

export default MainFrame;