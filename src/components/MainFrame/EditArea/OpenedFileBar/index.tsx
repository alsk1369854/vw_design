import { memo } from 'react';
import style from './index.module.scss';

import React from 'react'

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove, { arrayMoveImmutable } from 'array-move';

import FileManager from '../../../FileManager/FileManager';

const SortableItem = SortableElement(({ file, _this }: any) => <div onClick={() => _this.poprs.setEditFile(FileManager.getFileById(file.strFileId))}>{file.strFileName}</div>);

const SortableList = SortableContainer(({ items, _this }: any) => {
    return (
        <div style={{ display: 'flex' }}>
            {items.map((file: any, index: number) => (
                // <div onClick={() => console.log(value)} style={{ display: 'flex', padding: '0px', margin: '0px' }}>
                    <SortableItem key={`item-${file.strFileId}`} _this={_this} index={index} file={file} />
                // </div>
            ))}
        </div>
    );
});

interface IState{}

interface IPoprs{
    setEditFile:Function
}

export default class OpenedFileBar extends React.Component<IPoprs,IState> {
    state = {
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
    };

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