import { memo } from 'react';
import style from './index.module.scss';

import { Menu, Node, Divider } from '../';




const ToolBarMenu = memo((props: {toolBarMenu: Menu, isShow: boolean, closeToolBarMenu: Function}) => {
    if (!props.isShow) return <></>;


    const clickToolBarNode = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, toolBarNode: Node) => {
        if (toolBarNode.isDisabled()) return;
        event.stopPropagation();

        toolBarNode.callClickFunction();
        props.closeToolBarMenu();
    }

    const arrToolNodes: Array<JSX.Element> = [];
    props.toolBarMenu.getNodes().forEach((toolBarNode, index) => {
        let tagNode: JSX.Element = (
            <li
                key={"ToolBarNode" + index}
                className={(toolBarNode.isDisabled()? style.disabled : undefined)}
                onClick={(event) => clickToolBarNode(event, toolBarNode)}
                data-testid={toolBarNode.setTestId()}
            >
                <div>
                    <span>{toolBarNode.getName()}</span>
                    <span
                        className={style.alignRight}
                    >
                        {toolBarNode.getHotKey()}
                    </span>
                </div>
            </li>
        )

        if (toolBarNode instanceof Divider) 
            tagNode = (
                <hr
                    key={"divider" + index}
                />
            );
        arrToolNodes.push(tagNode);
    })


    return (
        <div className={style.div}>
            <ul>
                {arrToolNodes}
            </ul>
        </div>
    )
});

export default ToolBarMenu;