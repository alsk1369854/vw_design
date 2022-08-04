import React, { Component, FC, CSSProperties, useState } from 'react'

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
import {
    setTemporaryFileName,
    getTemporaryFileName,
    setTemporaryMessage,
    getTemporaryMessage
} from '../index'

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


export const FileItem: FC<IProps> = function FileItem(props) {

    const {
        parentThis,
        renameState,
        objFile,
        deep,
    } = props
    const [count, setCount] = useState(0)

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

    const renameEvent = (event: any, objFile: File) => {
        const { parentThis } = props
        const { target: element, key } = event
        const [boolNameCanUsed, strMessage] = objFile.checkFileNewName(element.value)

        setTemporaryFileName(element.value)
        setTemporaryMessage(strMessage as string)
        if (key === "Enter" && boolNameCanUsed) {
            objFile.setFileName(element.value)
            setTemporaryFileName('')
            setTemporaryMessage('')
            FileManager.cleanSelectedFiles()
            FileManager.addSelectedFile(objFile)
            parentThis.setState({
                currentlySelectedItem: objFile,
                renameState: parentThis.initializationRenameState
            })
        } else {
            setCount(count + 1)
            // parentThis.setState({
            //     renameState: {
            //         ...parentThis.state.renameState,
            //         // temporaryFileName: element.value,
            //         message: strMessage,
            //     }
            // })
            // }
        }
    }
    // const renameCheckAndSetFileName = () => {
    //     const { renameState } = this.state
    //     const { file } = renameState
    //     if (file.isRootFile()) return
    //     const temporaryFileName = getTemporaryFileName()
    //     const [fileNameState] = file.checkFileNewName(temporaryFileName)

    //     return (fileNameState) ?
    //         file.setFileName(temporaryFileName) :
    //         this.renameRollBack()
    // }
    // const renameRollBack = () => {
    //     const { renameState } = this.state
    //     const { file, oldName } = renameState

    //     if (renameState.oldName === '') {
    //         file.delete()
    //     } else {
    //         file.setFileName(oldName)
    //     }
    // }

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

    // const [state, setState] = useState(0)
    // const renameEvent = () => {
    //     setState(state+1)
    // }

    const opacity = isDragging ? 0.4 : 1
    const dragPreview = getDragPreview(objFile.getId())
    const strTemporaryFileName = getTemporaryFileName()
    const strRenameMessage = getTemporaryMessage()
    
    return (
        <>
            <DragPreviewImage
                connect={preview}
                src={dragPreview && dragPreview.src}
            />
            <div
                ref={drag}
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
                        {FileManager.getFileIcon(objFile, strTemporaryFileName)}
                        <span
                            className={style.renameBar}
                            // style={{ width: `calc(100px - ${item.deep! * 10 + 40 + 5}px)` }}
                            style={{ width: `calc(100% - ${deep * 10 + 41}px)` }}
                        >
                            <input
                                className={
                                    (strRenameMessage !== '') ?
                                        style.renameInputWarning :
                                        style.renameInput
                                }
                                autoFocus
                                defaultValue={strTemporaryFileName}
                                onFocus={renameOnFocus}
                                onChange={(event => renameEvent(event, objFile))}
                                onClick={(event) => event.stopPropagation()}
                                onKeyDown={(event => renameEvent(event, objFile))}
                            />
                            {(strRenameMessage !== '') ?
                                <div className={style.renameMessage}>
                                    {strRenameMessage}
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

