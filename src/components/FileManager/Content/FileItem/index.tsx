import React, { FC, useState, useEffect, memo, useRef } from 'react'

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
// interface IState { }

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
        grandparentThis.renameCheckAndSetFileName()
        FileManager.addOpenFile(objFile)
    }

    const addToSelectedFiles = (event: any, objFile: File) => {
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
        const { target: element, key } = event
        const result = objFile.checkFileNewName(element.value)
        const { state: boolNameCanUsed, message, newFileName } = result

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
        const {
            renameState,
            currentlySelectedItem,
        } = grandparentThis.state

        // ????????? rename ??????
        if (!renameState.file.isRootFile()) { // ??? rename ??????
            // ????????? rename ??????
            if (renameState.file === objFile) { // ??? rename ??????
                // ?????????????????????
                if (FileManager.selectedFileIsExists(objFile)) { // ???????????????
                    return style.fileItemRenameItemOnSelected
                } else { // ??????????????????
                    return style.fileItemRenameItem
                }
            } else { // ?????? rename ??????
                // ?????????????????????
                if (FileManager.selectedFileIsExists(objFile)) { // ???????????????
                    return style.fileItemOnSelectedRenameState
                } else { // ??????????????????
                    return style.fileItemRenameState
                }
            }
        } else { // ?????? rename ??????
            // ?????????????????????
            if (FileManager.selectedFileIsExists(objFile)) { // ???????????????
                // ????????????????????????
                if (currentlySelectedItem === objFile) { // ??????????????????
                    return style.fileItemCurrentlySelected
                } else { // ?????????????????????
                    return style.fileItemOnSelected
                }
            } else { // ??????????????????
                // ????????????????????????
                if (currentlySelectedItem === objFile) { // ??????????????????
                    return style.fileItemCurrentlyContextMenu
                } else { // ?????????????????????
                    const srcFile = dragAndDropControl.getSrcFile()
                    const isActive = canDrop && isOver
                    // ?????????????????????????????????
                    if (isActive) { // ???????????????????????????
                        return style.fileItemDropArea
                    } else { // ??????????????????????????????
                        // ?????????????????????
                        if (srcFile === objFile && isDragging) { //???????????????
                            return style.fileItemOnDragUnSelected
                        } else {// ??????????????????
                            return style.fileItemStatic
                        }
                    }
                }
            }
        }
    }

    const isActive = canDrop && isOver
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
            
            <div ref={drop}>

                <div
                    // style={(FileManager.cuttingFileIsExists(objFile)) ? { opacity: '0.5' } : {}}
                    className={getFileClassName(objFile)}
                    ref={drag}
                    onClick={(event) => clickItem(event, objFile)}
                    onDoubleClick={(event) => doubleClickItem(event, objFile)}
                    onContextMenu={(event) => grandparentThis.showItemContextMenu(event, objFile)}
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
                            <span className={style.fileName}>
                                {objFile.getFileName()}
                            </span>
                        </>
                    }
                </div>
            </div>
        </>
    )
})

