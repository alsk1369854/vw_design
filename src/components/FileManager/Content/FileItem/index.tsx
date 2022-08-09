import React, { FC, useState, useEffect } from 'react'

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
import { getDragPreview } from '../../lib/PreviewTestFactory'
import {
    setTemporaryFileName,
    getTemporaryFileName,
    setTemporaryMessage,
    getTemporaryMessage
} from '../../index'


interface IState { }

interface IProps {
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


export const FileItem: FC<IProps> = function FileItem(props) {

    const {
        grandparentThis,
        getFileList,
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
                const { activeDragAndDropState } = grandparentThis.state
                const { srcFile, destFile } = activeDragAndDropState
                if (destFile) {
                    const prepareMoveFiles = (FileManager.selectedFileIsExists(srcFile)) ?
                        FileManager.getSetSelectedFiles() :
                        srcFile
                    // window.confirm()
                    console.log(`${srcFile.getFileName()} move to ${destFile.getFileName()}`)

                }
            }
            setTimeout(() => {
                grandparentThis.setState({
                    activeDragAndDropState: grandparentThis.initializationDragAndDropState
                })
            }, 1)
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }))

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'fileItem',
        drop: () => ({ name: 'Dustbin' }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    useEffect(() => {
        const { activeDragAndDropState } = grandparentThis.state
        const { srcFile, destFile } = activeDragAndDropState
        if (isDragging && (srcFile !== objFile || !srcFile)) {
            // (() => {
            grandparentThis.setState({
                activeDragAndDropState: {
                    srcFile: objFile,
                    destFile: undefined
                },
                renameState: grandparentThis.initializationRenameState,
                showContextMenu: false,
            })
            // })()
        }

        const isActive = canDrop && isOver
        // const srcDirectoryFile = (srcFile.isDirectory()) ? srcFile : srcFile.getParent()
        const destDirectoryFile = (objFile.isDirectory()) ? objFile : objFile.getParent()


        if (isActive && destFile !== destDirectoryFile) {
            const isSrcFileCanDrop = (): boolean => {
                const arrFiles = (FileManager.selectedFileIsExists(srcFile)) ?
                    FileManager.getSetSelectedFiles() :
                    [srcFile]
                for (const file of arrFiles) {
                    const fileParentFile = file.getParent()
                    // 同父底下 與 如是資料夾自己底下當按夾 不可
                    if (fileParentFile === destDirectoryFile
                        || (file.isDirectory() && destDirectoryFile!.isSubFileOf(file))) {
                        return false
                    }
                }
                // 停留1秒展開文件夾
                if (!destDirectoryFile?.isExpand()) {
                    setTimeout(() => {
                        const { destFile } = grandparentThis.state.activeDragAndDropState
                        console.log(destFile, destDirectoryFile)
                        console.log(destFile === destDirectoryFile)
                        if (destFile === destDirectoryFile) {
                            destDirectoryFile?.setIsExpand(true)
                            grandparentThis.setState({})
                        }
                    }, 1000)
                }
                return true
            }

            const isCanDropDown = isSrcFileCanDrop()
            if (isCanDropDown) {
                grandparentThis.setState({
                    activeDragAndDropState: {
                        ...activeDragAndDropState,
                        destFile: destDirectoryFile,
                        isActive: true,
                    },
                    renameState: grandparentThis.initializationRenameState,
                    showContextMenu: false,
                })
            } else if (!isCanDropDown && destFile) {
                // console.log('test')
                grandparentThis.setState({
                    activeDragAndDropState: {
                        ...activeDragAndDropState,
                        destFile: undefined,
                    },
                    renameState: grandparentThis.initializationRenameState,
                    showContextMenu: false,
                })
            }
        }
    })

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
        const { grandparentThis } = props
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
        const { grandparentThis } = props
        grandparentThis.renameCheckAndSetFileName()
        FileManager.addOpenFile(objFile)
    }

    const addToSelectedFiles = (event: any, objFile: File) => {
        const { grandparentThis } = props
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
        const { renameState } = props
        event.target.setSelectionRange(0, renameState.oldName.indexOf('.'))
    }

    const renameEvent = (event: any, objFile: File) => {
        const { grandparentThis } = props
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
            grandparentThis.setState({
                currentlySelectedItem: objFile,
                renameState: grandparentThis.initializationRenameState
            })
        } else {
            setCount(count + 1)
            // grandparentThis.setState({
            //     renameState: {
            //         ...grandparentThis.state.renameState,
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
        const { grandparentThis } = props
        const {
            renameState,
            currentlySelectedItem,
            activeDragAndDropState
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
                    const { srcFile, destFile } = activeDragAndDropState
                    // 使否為拖曳準備下降區域
                    if (destFile && (objFile.isSubFileOf(destFile) || objFile === destFile)) { // 是拖曳準備下降區域
                        return style.fileItemDropArea
                    } else { // 不是拖曳準備下降區域
                        // 是否為拖曳項目
                        if (srcFile === objFile && isDragging) { //是拖曳項目
                            return style.fileItemOnDragUnSelected
                        } else {// 不是拖曳項目
                            return style.fileItem
                        }
                    }
                }
            }
        }
    }

    // const [state, setState] = useState(0)
    // const renameEvent = () => {
    //     setState(state+1)
    // }

    // const opacity = isDragging ? 0.4 : 1


    // const isActive = canDrop && isOver
    // let backgroundColor = ''
    // if (isActive) {
    //     backgroundColor = 'darkgreen'
    // } else if (canDrop) {
    //     backgroundColor = 'darkkhaki'
    // }


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
                // data-testid="dustbin"
                ref={drop}
            // style={{ backgroundColor }}
            >

                <div
                    ref={drag}
                    // data-testid={`fileItem`}
                    onClick={(event) => clickItem(event, objFile)}
                    onDoubleClick={(event) => doubleClickItem(event, objFile)}
                    onContextMenu={(event) => grandparentThis.showItemContextMenu(event, objFile)}
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
            </div>
        </>
    )
}

