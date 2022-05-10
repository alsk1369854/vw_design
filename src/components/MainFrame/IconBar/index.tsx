import { memo, useState } from 'react';
import style from './index.module.scss';

import { abstractTestable } from '../../../tools/Test';




export const IconBar = memo((props: {arrIconButtons: Array<IconButton>, arrIconButtonsBottom: Array<IconButton>}) => {
    const [intFocusIconIndex, setFocusIconIndex] = useState(-1);
    const clickIconButton: Function = (intClickedIconIndex: number) => {
        if (intFocusIconIndex !== intClickedIconIndex) focusNewIconButton(intFocusIconIndex, intClickedIconIndex);
        else blurIconButton(intFocusIconIndex);
    }
    function focusNewIconButton(intFocusIconIndex: number, intClickedIconIndex: number): void {
        if (intFocusIconIndex !== -1) props.arrIconButtons[intFocusIconIndex].callBlurFunction();

        props.arrIconButtons[intClickedIconIndex].callFocusFunction();
        setFocusIconIndex(intClickedIconIndex);
    }
    function blurIconButton(intFocusIconIndex: number): void {
        props.arrIconButtons[intFocusIconIndex].callBlurFunction();
        setFocusIconIndex(-1);
    }


    const arrIconButtons: Array<JSX.Element> = [];
    const arrIconButtonsBottom: Array<JSX.Element> = [];

    props.arrIconButtons.forEach((iconButton, index) => {
        arrIconButtons.push(
            <div
                key={"IconButton" + index}
                className={`${style.iconButton} ${(intFocusIconIndex == index)? style.focusIcon : ""}`}
                onClick={() => {clickIconButton(index)}}
                data-testid={iconButton.setTestId()}
            >
                <img
                    src={require('../../../assets/icon/' + iconButton.getName() + '.png')}
                />
            </div>
        );
    })
    props.arrIconButtonsBottom.forEach((iconButton, index) => {
        arrIconButtonsBottom.push(
            <div
                key={"IconButtonBottom" + index}
                className={style.iconButton}
                onClick={() => props.arrIconButtonsBottom[index].callFocusFunction()}
                data-testid={iconButton.setTestId()}
            >
                <img 
                    src={require('../../../assets/icon/' + iconButton.getName() + '.png')} 
                />
            </div>
        );
    })


    return (
        <aside className={style.aside}>
            <section id={style.topIcons}>
                {arrIconButtons}
            </section>
            <section id={style.bottomIcons}>
                {arrIconButtonsBottom}
            </section>
        </aside>
    );
});




export class IconButton extends abstractTestable {
    private strName: string;
    private funcFocus: Function;
    private funcBlur: Function;

    constructor(strName: string, funcFocus: Function)
    constructor(strName: string, funcFocus: Function, funcBlur: Function)
    constructor(strName: string, funcFocus: Function, funcBlur: Function = (()=>{})){
        super();
        this.strName = strName;
        this.funcFocus = funcFocus;
        this.funcBlur = funcBlur;
    }

    public callFocusFunction(): void {
        this.funcFocus();
    }
    public callBlurFunction(): void {
        this.funcBlur();
    }

    public getName(): string {
        return this.strName;
    }
}


const getFullScreenWidth: Function = (): number => {return window.innerWidth - 60}

const container = memo((props: {arrButtonNames: Array<string>, funcSetUseState: Function, funcSetSideWindowWidth: Function}) => {
    const arrIconButtons: Array<IconButton> = [
        new IconButton(props.arrButtonNames[0], () => {
                props.funcSetUseState(0);
                props.funcSetSideWindowWidth(0);
            }, () => {
                props.funcSetUseState(-1);
                props.funcSetSideWindowWidth(0);
            }
        ),
        new IconButton(props.arrButtonNames[1], () => {
                props.funcSetUseState(1);
                props.funcSetSideWindowWidth(200);
            }, () => {
                props.funcSetUseState(-1);
                props.funcSetSideWindowWidth(0);
            }
        ),
        new IconButton(props.arrButtonNames[2], () => {
                props.funcSetUseState(2);
                props.funcSetSideWindowWidth(getFullScreenWidth());
            }, () => {
                props.funcSetUseState(-1);
                props.funcSetSideWindowWidth(0);
            }
        ),
        new IconButton(props.arrButtonNames[3], () => {
                props.funcSetUseState(3);
                props.funcSetSideWindowWidth(getFullScreenWidth());
            }, () => {
                props.funcSetUseState(-1);
                props.funcSetSideWindowWidth(0);
            }
        ),
        new IconButton(props.arrButtonNames[4], () => {
                props.funcSetUseState(4);
                props.funcSetSideWindowWidth(getFullScreenWidth());
            }, () => {
                props.funcSetUseState(-1);
                props.funcSetSideWindowWidth(0);
            }
        ),
        new IconButton(props.arrButtonNames[5], () => {
                props.funcSetUseState(5);
                props.funcSetSideWindowWidth(getFullScreenWidth());
            }, () => {
                props.funcSetUseState(-1);
                props.funcSetSideWindowWidth(0);
            }
        ),
    ]
    const arrIconButtonsBottom: Array<IconButton> = [
        new IconButton("User",            () => {console.log(0, "bottom")}),
        new IconButton("Setting",         () => {console.log(1, "bottom")}),
    ]

    
    return <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
});

export default container;