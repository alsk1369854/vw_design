import { memo } from 'react';
import style from './index.module.scss';

import React from 'react'

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove, { arrayMoveImmutable } from 'array-move';

import FunctionCaller from '../../../../tools/FunctionCaller';
import FileManager from '../../../FileManager/FileManager';

const SortableItem = SortableElement(({ file, _this }: any) => {
    return <div style={{marginRight:'10px'}} onClick={() => {
        // console.log(_this)
        _this.props.setEditFile(FileManager.getFileById(file.getId()))
    }}>
    {file.strFileName}</div>
});

const SortableList = SortableContainer(({ items, _this }: any) => {
    return (
        <div style={{ display: 'flex' }}>
            {items.map((file: any, index: number) => (
                <SortableItem key={`item-${file.getId()}`} _this={_this} index={index} file={file} />
            ))}
        </div>
    );
});

interface IState { }

interface IProps {
    setEditFile: Function
}

export const FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_BAR = 'open file bar, update'

export default class OpenedFileBar extends React.Component<IProps, IState> {
    state = {
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
    };

    componentDidMount() {
        FunctionCaller.set(FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_BAR, this.update)
    }
    componentWillUnmount() {
        FunctionCaller.remove(FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_BAR)
    }

    update = () => this.setState({})


    onSortEnd = ({ oldIndex, newIndex }: any) => {
        this.setState(({ items }: any) => ({
            items: arrayMoveImmutable(items, oldIndex, newIndex),
        }));
    };

    render() {
        return (
            <div className={style.div}>
                {/* <SortableList _this={this} distance={1} lockAxis="x" axis='x' items={this.state.items} onSortEnd={this.onSortEnd} /> */}
                <SortableList _this={this} distance={1} lockAxis="x" axis='x' items={FileManager.getOpenFiles()} onSortEnd={this.onSortEnd} />

                OF
            </div>
        )
    }
}