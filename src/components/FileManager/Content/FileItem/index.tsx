import React, { FC, useState, useEffect, memo } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faAngleRight,
    faAngleDown,
    faSquareFull,
} from '@fortawesome/free-solid-svg-icons'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'


import style from './index.module.scss'
import File from '../../lib/File'
import FileManager from '../../lib/FileManager'
import { getDragPreview } from '../../lib/DragPreviewTextFactory'
import type DragAndDropControl from '../../lib/DragAndDropControl'
import {
    setTemporaryFileName,
    getTemporaryFileName,
    setTemporaryMessage,
    getTemporaryMessage
} from '../../index'

interface IState { }

interface IProps {
    renderParentComponent: Function,
    dragAndDropControl: DragAndDropControl,
    grandparentThis: any,
    renameState: any,
    getFileList: Function,
    objFile: File,
    deep: number,
}

export interface BoxProps {
    name: string
}

interface DropResult {
    name: string
}


export const FileItem: FC<IProps> = memo(function FileItem({
    dragAndDropControl,
    grandparentThis,
    getFileList,
    renameState,
    objFile,
    deep,
}: IProps) {

    const [count, setCount] = useState(0)

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: dragAndDropControl.itemType.fileItem,
        item: objFile.getFileName(),
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>()
            if (item && dropResult) {
                console.log('@ end reset')
                dragAndDropControl.reset()
                grandparentThis.setState({})
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }))

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: dragAndDropControl.itemType.fileItem,
        canDrop: () => dragAndDropControl.isSrcFileCanDrop(objFile),
        // drop: () => ({ name: 'Dustbin' }),
        drop: () => {
            dragAndDropControl.setOnOverFile(objFile)
            dragAndDropControl.action()
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))


    useEffect(() => {
        if (isDragging && dragAndDropControl.getSrcFile() !== objFile) {
            // console.log(`drag up ${objFile.getFileName()}`)
            dragAndDropControl.setSrcFile(objFile)
        }
    })


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
        // const { grandparentThis } = props
        const { currentlySelectedItem, previouslySelectedItem } = grandparentThis.state

        grandparentThis.renameCheckAndSetFileName()
        addToSelectedFiles(event, objFile)

        grandparentThis.setState({
            showContextMenu: false,
            currentlySelectedItem: objFile,
            previouslySelectedItem: (event.shiftKey) ?
                (!previouslySelectedItem.isRootFile()) ?
                    previouslySelectedItem :
                    currentlySelectedItem :
                FileManager.getRootFile(),
            renameState: grandparentThis.initializationRenameState,
        })
    }
    const doubleClickItem = (event: any, objFile: File) => {
        // const { grandparentThis } = props
        grandparentThis.renameCheckAndSetFileName()
        FileManager.addOpenFile(objFile)
    }

    const addToSelectedFiles = (event: any, objFile: File) => {
        // const { grandparentThis } = props
        const { currentlySelectedItem, previouslySelectedItem } = grandparentThis.state
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

            getFileList().forEach((item: any) => {
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
        // const { renameState } = props
        event.target.setSelectionRange(0, renameState.oldName.indexOf('.'))
    }

    const renameEvent = (event: any, objFile: File) => {
        // const { grandparentThis } = props
        const { target: element, key } = event
        // const strNewFileName = element.value.trim()
        const result = objFile.checkFileNewName(element.value)
        const {state:boolNameCanUsed, message, newFileName} = result

        setTemporaryFileName(newFileName)
        setTemporaryMessage(message as string)
        if (key === "Enter" && boolNameCanUsed) {
            objFile.setFileName(newFileName)
            setTemporaryFileName('')
            setTemporaryMessage('')
            FileManager.cleanSelectedFiles()
            FileManager.addSelectedFile(objFile)
            grandparentThis.setState({
                currentlySelectedItem: objFile,
                renameState: grandparentThis.initializationRenameState
            })
        } else {
            setCount(count + 1)
        }
    }

    const getFileClassName = (objFile: File) => {
        // const { grandparentThis } = props
        const {
            renameState,
            currentlySelectedItem,
        } = grandparentThis.state

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
                    // const { srcFile, destFile } = activeDragAndDropState
                    const srcFile = dragAndDropControl.getSrcFile()
                    const destFile = dragAndDropControl.getDestFile()
                    const isActive = canDrop && isOver
                    // 使否為拖曳準備下降區域
                    if (isActive) { // 是拖曳準備下降區域
                        // if (canDrop && destFile && (objFile.isSubFileOf(destFile) || objFile === destFile)) { // 是拖曳準備下降區域
                        return style.fileItemDropArea
                    } else { // 不是拖曳準備下降區域
                        // 是否為拖曳項目
                        if (srcFile === objFile && isDragging) { //是拖曳項目
                            return style.fileItemOnDragUnSelected
                        } else {// 不是拖曳項目
                            return style.fileItemStatic
                        }
                    }
                }
            }
        }
    }


    // const opacity = isDragging ? 0.4 : 1

    const isActive = canDrop && isOver
    // let backgroundColor = ''
    // if (isActive) {
    //     backgroundColor = 'darkgreen'
    // } else if (canDrop) {
    //     backgroundColor = 'darkkhaki'
    // }

    // if (isOver) {
    if (isActive) {
        dragAndDropControl.setOnOverFile(objFile)
    }

    const dragPreview = getDragPreview(objFile.getId())
    const strTemporaryFileName = getTemporaryFileName()
    const strRenameMessage = getTemporaryMessage()

    // console.log('render fileItem')
    return (
        <>
            <DragPreviewImage
                connect={preview}
                src={dragPreview && dragPreview.src}
            />

            <div
                ref={drag}
                // data-testid={`fileItem`}
                onClick={(event) => clickItem(event, objFile)}
                onDoubleClick={(event) => doubleClickItem(event, objFile)}
                onContextMenu={(event) => grandparentThis.showItemContextMenu(event, objFile)}
                className={getFileClassName(objFile)}
            >
                <div
                    ref={drop}
                    // style={{ backgroundColor }}
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
            </div>
        </>
    )
})

