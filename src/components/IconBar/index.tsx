import { memo, useState } from 'react';
import style from './index.module.scss';

import { abstractTestable } from '../../tools/Test';




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
                    src={require('../../assets/icon/' + iconButton.getNameFilterSpaces() + '.png')}
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
                    src={require('../../assets/icon/' + iconButton.getNameFilterSpaces() + '.png')} 
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
    private funcFocus: Function;
    private funcBlur: Function;

    constructor(strName: string, funcFocus: Function)
    constructor(strName: string, funcFocus: Function, funcBlur: Function)
    constructor(strName: string, funcFocus: Function, funcBlur: Function = (()=>{})){
        super(strName, "IconButton");
        this.funcFocus = funcFocus;
        this.funcBlur = funcBlur;
    }

    callFocusFunction(): void {
        this.funcFocus();
    }
    callBlurFunction(): void {
        this.funcBlur();
    }
}


const container = memo(() => {
    const arrIconButtons: Array<IconButton> = [
        new IconButton("Edit",            () => {console.log(0, "Focus")}, () => {console.log(0, "Blur")}),
        new IconButton("Folder",          () => {console.log(1, "Focus")}, () => {console.log(1, "Blur")}),
        new IconButton("Magnifier",       () => {console.log(2, "Focus")}, () => {console.log(2, "Blur")}),
        new IconButton("PaperAirplane",   () => {console.log(3, "Focus")}, () => {console.log(3, "Blur")}),
        new IconButton("Bulb",            () => {console.log(4, "Focus")}, () => {console.log(4, "Blur")}),
        new IconButton("Plug-in",         () => {console.log(5, "Focus")}, () => {console.log(5, "Blur")}),
    ]
    const arrIconButtonsBottom: Array<IconButton> = [
        new IconButton("User",            () => {console.log(0, "bottom")}),
        new IconButton("Setting",         () => {console.log(1, "bottom")}),
    ]

    
    return <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
});

export default container;