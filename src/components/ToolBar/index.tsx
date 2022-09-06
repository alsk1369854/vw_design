import { ChangeEvent, memo, useEffect, useRef, useState } from 'react';
import style from './index.module.scss';

import { abstractTestable } from '../../tools/Test';
import { UsageError } from '../../tools/Error';
import ToolBarMenu from './ToolBarMenu';




export const ToolBar = memo((props: {arrToolBarButtons: Array<ToolBarButton>}) => {
    const refToolBar: React.LegacyRef<HTMLElement> = useRef(null);
    const [isOpenToolBarMenu, setOpenStateToolBarMenu] = useState(false);
    const clickToolBarButton: Function = () => {
        setOpenStateToolBarMenu(true);
    }
    useEffect(() => {
        const handleClickOutside: any = (event: ChangeEvent<HTMLInputElement>) => {
            if (refToolBar.current && !refToolBar.current.contains(event.target)) setOpenStateToolBarMenu(false);
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [ isOpenToolBarMenu ]);

    const [intHoverToolBarMenuIndex, setHoverToolBarMenuIndex] = useState(-1);
    const hoverToolBarButton: Function = (intHoverToolBarButtonIndex: number) => {
        setHoverToolBarMenuIndex(intHoverToolBarButtonIndex);
    }

    const isShowToolBarMenu: Function = (intToolBarButtonIndex: number) => {
        return isOpenToolBarMenu && (intHoverToolBarMenuIndex === intToolBarButtonIndex);
    }


    const arrToolBarButtons: Array<JSX.Element> = [];
    props.arrToolBarButtons.forEach((toolBarButton: ToolBarButton, index) => {
        arrToolBarButtons.push(
            <section
                key={"ToolBarButton" + index}
                onClick={() => clickToolBarButton()}
                onMouseEnter={() => hoverToolBarButton(index)}
                data-testid={toolBarButton.setTestId()}
            >
                <span>{toolBarButton.getName()}</span>
                <ToolBarMenu 
                    toolBarMenu={toolBarButton.getMenu()} 
                    isShow={isShowToolBarMenu(index)}
                    closeToolBarMenu={() => setOpenStateToolBarMenu(false)}
                />
            </section>
        );
    })


    return (
        <nav
            className={style.nav}
            ref={refToolBar}
        >
            {arrToolBarButtons}
        </nav>
    )
});




export class Node extends abstractTestable {
    private strName: string;
    private strHotKey: string;
    private funcClick: Function;
    private booDisabled: Boolean = false;

    constructor(strName: string, strHotKey: string | null, funcClick: Function){
        super();
        this.strName = strName;
        this.strHotKey = strHotKey ?? "";
        this.funcClick = funcClick;
    }

    public callClickFunction(): void {
        this.funcClick();
    }

    public getName(): string {
        return this.strName;
    }
    public getHotKey(): string {
        return this.strHotKey;
    }

    public isDisabled(): Boolean {
        return this.booDisabled;
    }
    public disabled(): void {
        this.booDisabled = true;
    }
    public enabled(): void {
        this.booDisabled = false;
    }
}
export class Divider extends Node {
    constructor(){
        super("", null, ()=>{throw new UsageError("ToolBarButton- the divider doesn't use its click function")})
    }
}

export class Group {
    private arrNodes: Array<Node>;

    constructor(arrNodes: Array<Node>){
        this.arrNodes = arrNodes;
    }

    public getNodes(): Array<Node> {
        return this.arrNodes;
    }
}

export class Menu extends abstractTestable {
    private arrGroups: Array<Group>;

    constructor(arrGroups: Array<Group>){
        super();
        this.arrGroups = arrGroups;
    }


    public getNode(strName: String): Node {
        // get first specific node
        for (let node of this.getNodes(false)){
            if (node.getName() === strName) return node;
        }
        throw new UsageError("ToolBarButton- node called " + strName + " doesn't exist");
    }

    public getNodes(): Array<Node>
    public getNodes(isDivided: boolean): Array<Node>
    public getNodes(isDivided: boolean = true): Array<Node> {
        let arrNodes: Array<Node> = [];

        this.arrGroups.forEach((group, index) => {
            group.getNodes().forEach(node => {
                arrNodes.push(node);
            })
            
            if (isDivided && this.isLastGroup(index)) arrNodes.push(new Divider());
        })

        return arrNodes;
    }
    private isLastGroup(intGroupIndex: number): boolean {
        return (intGroupIndex + 1) !== this.arrGroups.length;
    }
}

export class ToolBarButton extends abstractTestable {
    private strName: string;
    private menu: Menu;

    constructor(strName: string, menu: Menu){
        super();
        this.strName = strName;
        this.menu = menu;
    }

    public getName(): string {
        return this.strName;
    }
    public getMenu(): Menu {
        return this.menu;
    }
}


export const defaultToolBarButtons: Array<ToolBarButton> = [
    new ToolBarButton("File",
        new Menu([
            new Group([
                new Node("Open Project",    "HotKey01", () => {console.log("Open Project...")}),
                new Node("Open File",       "HotKey02", () => {console.log("Open File...")}),
            ]),
            new Group([
                new Node("Save",            "HotKey03", () => {console.log("Save...")}),
            ])
        ])
    ),
    new ToolBarButton("Edit",
        new Menu([
            new Group([
                new Node("Undo",            "HotKey04", () => {console.log("Undo...")}),
                new Node("Redo",            "HotKey05", () => {console.log("Redo...")}),
            ]),
            new Group([
                new Node("Cut",             "HotKey06", () => {console.log("Cut...")}),
                new Node("Copy",            "HotKey07", () => {console.log("Copy...")}),
                new Node("Paste",           "HotKey08", () => {console.log("Paste...")}),
            ])
        ])
    ),
    new ToolBarButton("Help",
        new Menu([
            new Group([
                new Node("Version",         null,       () => {console.log("Version...")}),
                new Node("About",           null,       () => {console.log("About...")}),
            ])
        ])
    ),
]

const container = memo(() => {
    return <ToolBar arrToolBarButtons={defaultToolBarButtons} />
});

export default container;