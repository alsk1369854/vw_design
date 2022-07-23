import { memo } from 'react';
import style from './index.module.scss';

import React from 'react'

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove, { arrayMoveImmutable } from 'array-move';

import FunctionCaller from '../../../../tools/FunctionCaller';
import FileManager from '../../../FileManager/lib/FileManager';

const SortableItem = SortableElement(({ file, _this }: any) => {
    return (
        <div style={{ marginRight: '10px' }}
            onClick={() => _this.props.setEditFile(FileManager.getFileById(file.getId()))}
        >
            {file.strFileName}
            <button onClick={() => FileManager.deleteOpenFile(file)}>delete</button>
        </div>
    )
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
export const FUNCTION_CALLER_KEY_GET_OPEN_FILE_ITEMS = 'open file bar, getOpenFileItems'
export const FUNCTION_CALLER_KEY_SET_OPEN_FILE_ITEMS = 'open file bar, setOpenFileItems'

export default class OpenedFileBar extends React.Component<IProps, IState> {
    state = {
        openFileItems: [],
    };

    componentDidMount() {
        // FunctionCaller.set(FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_BAR, this.update)
        // FunctionCaller.set(FUNCTION_CALLER_KEY_GET_OPEN_FILE_ITEMS, this.getOpenFileItems)
        FunctionCaller.set(FUNCTION_CALLER_KEY_SET_OPEN_FILE_ITEMS, this.setOpenFileItems)
        this.setState({ openFileItems: FileManager.getOpenFiles() })
    }
    componentWillUnmount() {
        // FunctionCaller.remove(FUNCTION_CALLER_KEY_UPDATE_OPENED_FILE_BAR)
        // FunctionCaller.remove(FUNCTION_CALLER_KEY_GET_OPEN_FILE_ITEMS)
        FunctionCaller.remove(FUNCTION_CALLER_KEY_SET_OPEN_FILE_ITEMS)
        FileManager.setOpenFiles(this.state.openFileItems)
    }

    update = () => this.setState({})

    getOpenFileItems = () => this.state.openFileItems
    setOpenFileItems = (arrFile: Array<File>) => this.setState({ openFileItems: arrFile })

    onSortEnd = ({ oldIndex, newIndex }: any) => {
        const newOpenFileItems = arrayMoveImmutable(this.state.openFileItems, oldIndex, newIndex)
        FileManager.setOpenFiles(newOpenFileItems)
        this.setState({ openFileItems: newOpenFileItems })
    };

    render() {
        return (
            <div className={style.div}>
                {/* <SortableList _this={this} distance={1} lockAxis="x" axis='x' items={this.state.items} onSortEnd={this.onSortEnd} /> */}
                <SortableList _this={this} distance={1} lockAxis="x" axis='x' items={this.state.openFileItems} onSortEnd={this.onSortEnd} />
            </div>
        )
    }
}