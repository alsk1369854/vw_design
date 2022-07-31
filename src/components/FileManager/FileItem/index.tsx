import React, { Component, FC, CSSProperties } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faAngleRight,
    faAngleDown,
    faSquareFull,
} from '@fortawesome/free-solid-svg-icons'
import { DragPreviewOptions, DragPreviewImage, useDrag, useDrop } from 'react-dnd'


import style from './index.module.scss'
import File from '../lib/File'
import FileManager from '../lib/FileManager'
import { getDragPreview } from '../lib/PreviewTestFactory'

interface IState { }

interface IProps {
    parentThis: any,
    renameState: any,
    objFile: File,
    deep: number,
}

export interface BoxProps {
    name: string
}

interface DropResult {
    name: string
}

const styleP: CSSProperties = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
}

export const FileItem: FC<IProps> = function FileItem(props) {

    const {
        parentThis,
        renameState,
        objFile,
        deep,
    } = props

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'fileItem',
        item: objFile.getFileName(),
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>()
            if (item && dropResult) {
                alert(`You dropped ${item} into ${dropResult.name}!`)
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }))

    // const [{ canDrop, isOver }, drop] = useDrop(() => ({
    //     accept: 'box',
    //     drop: () => ({ name: 'Dustbin' }),
    //     collect: (monitor) => ({
    //         isOver: monitor.isOver(),
    //         canDrop: monitor.canDrop(),
    //     }),
    // }))

    const getExpandLine = (strFileId: string, numFileDeep: number) => {
        let expandLine: JSX.Element[] = []
        for (let i = 0; i < numFileDeep; i++) {
            expandLine.push(
                <span
                    key={strFileId + "_ExpandLine_" + i}
                    className={style.expandLine}>&nbsp;
                </span>
            )
        }
        return expandLine
    }

    const setFileIsExpand = (event: any, objFile: File) =>
        objFile.setIsExpand(!objFile.isExpand())

    const clickItem = (event: any, objFile: File) => {
        event.stopPropagation()
        // event.preventDefault()
        const { parentThis } = props
        const { currentlySelectedItem, previouslySelectedItem } = parentThis.state

        parentThis.renameCheckAndSetFileName()
        addToSelectedFiles(event, objFile)

        parentThis.setState({
            showContextMenu: false,
            currentlySelectedItem: objFile,
            previouslySelectedItem: (event.shiftKey) ?
                (!previouslySelectedItem.isRootFile()) ?
                    previouslySelectedItem :
                    currentlySelectedItem :
                FileManager.getRootFile(),
            renameState: parentThis.initializationRenameState,
        })
    }
    const doubleClickItem = (event: any, objFile: File) => {
        const { parentThis } = props
        parentThis.renameCheckAndSetFileName()
        FileManager.addOpenFile(objFile)
    }

    const addToSelectedFiles = (event: any, objFile: File) => {
        const { parentThis } = props
        const { currentlySelectedItem, previouslySelectedItem } = parentThis.state
        const objFileRootFile = FileManager.getRootFile()

        const prevFile = (previouslySelectedItem === objFileRootFile) ?
            currentlySelectedItem :
            previouslySelectedItem

        if (event.ctrlKey || event.metaKey) { // control down
            if (FileManager.selectedFileIsExists(objFile)) {
                FileManager.deleteSelectedFile(objFile)
            } else {
                FileManager.addSelectedFile(objFile)
            }
        } else if (event.shiftKey
            && currentlySelectedItem !== objFileRootFile
            && prevFile !== objFile) { // shift down

            let boolStartAddSeletedFileFlag = false
            FileManager.cleanSelectedFiles()

            parentThis.getFileList().forEach((item: any) => {
                const { objFile: file } = item
                const boolIsTargetFile = (file === objFile || file === prevFile)

                if (boolIsTargetFile) boolStartAddSeletedFileFlag = !boolStartAddSeletedFileFlag
                if (boolStartAddSeletedFileFlag || boolIsTargetFile) FileManager.addSelectedFile(file)
            })
        } else {
            FileManager.cleanSelectedFiles()
            FileManager.addSelectedFile(objFile)
            setFileIsExpand(event, objFile)
        }
    }

    const renameOnFocus = (event: any) => {
        const { renameState } = props
        event.target.setSelectionRange(0, renameState.oldName.indexOf('.'))
    }

    const getFileClassName = (objFile: File) => {
        const { parentThis } = props
        const { renameState, currentlySelectedItem } = parentThis.state
        // 是否在 rename 狀態
        if (!renameState.file.isRootFile()) { // 是 rename 狀態
            // 是否為 rename 項目
            if (renameState.file === objFile) { // 是 rename 項目
                // 是否在選中清單
                if (FileManager.selectedFileIsExists(objFile)) { // 在選中清單
                    return style.fileItemRenameItemOnSelected
                } else { // 不在選中清單
                    return style.fileItemRenameItem
                }
            } else { // 不是 rename 項目
                // 是否在選中清單
                if (FileManager.selectedFileIsExists(objFile)) { // 在選中清單
                    return style.fileItemOnSelectedRenameState
                } else { // 不在選中清單
                    return style.fileItemRenameState
                }
            }
        } else { // 不是 rename 狀態
            // 是否在選中清單
            if (FileManager.selectedFileIsExists(objFile)) { // 在選中清單
                // 是否為當前選取項
                if (currentlySelectedItem === objFile) { // 是當前選取項
                    return style.fileItemCurrentlySelected
                } else { // 不是當前選取項
                    return style.fileItemOnSelected
                }
            } else { // 不在選中清單
                // 是否為當前選取項
                if (currentlySelectedItem === objFile) { // 是當前選取項
                    return style.fileItemCurrentlyContextMenu
                } else { // 不是當前選取項
                    return style.fileItem
                }
            }
        }
    }

    const opacity = isDragging ? 0.4 : 1
    const dragPreview = getDragPreview(objFile.getId())

    return (
        <>  
            <DragPreviewImage
                connect={preview}
                src={dragPreview && dragPreview.src}
            />
            <div
                ref={drag}
                // style = {{
                //     border:
                // }}
                // style={{ opacity }}
                data-testid={`fileItem`}
                onClick={(event) => clickItem(event, objFile)}
                onDoubleClick={(event) => doubleClickItem(event, objFile)}
                onContextMenu={(event) => parentThis.showItemContextMenu(event, objFile)}
                className={getFileClassName(objFile)}
            >
                {getExpandLine(objFile.getId(), deep)}

                <span className={style.angleIcon}>
                    {(objFile.isDirectory()) ?
                        (objFile.isExpand()) ?
                            <FontAwesomeIcon icon={faAngleDown} /> :
                            <FontAwesomeIcon icon={faAngleRight} /> :
                        <FontAwesomeIcon
                            icon={faSquareFull}
                            className={style.isFileAngleIconBackground}
                        />
                    }
                </span>

                {((renameState.file === objFile)) ?
                    <>
                        {FileManager.getFileIcon(objFile, renameState.temporaryFileName)}
                        <span
                            className={style.renameBar}
                            // style={{ width: `calc(100px - ${item.deep! * 10 + 40 + 5}px)` }}
                            style={{ width: `calc(100% - ${deep * 10 + 41}px)` }}
                        >
                            <input
                                className={
                                    (renameState.message !== '') ?
                                        style.renameInputWarning :
                                        style.renameInput
                                }
                                autoFocus
                                defaultValue={renameState.temporaryFileName}
                                onFocus={renameOnFocus}
                                onChange={(event => parentThis.renameEvent(event, objFile))}
                                onClick={(event) => event.stopPropagation()}
                                onKeyDown={(event => parentThis.renameEvent(event, objFile))}
                            />
                            {(renameState.message !== '') ?
                                <div className={style.renameMessage}>
                                    {renameState.message}
                                </div> :
                                <></>
                            }
                        </span>
                    </> :
                    <>
                        {FileManager.getFileIcon(objFile)}
                        <span className={style.fileName}>{objFile.getFileName()}</span>
                    </>
                }
            </div>
        </>
    )
}

