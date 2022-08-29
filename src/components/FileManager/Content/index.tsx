import React, { FC, memo, useEffect, useLayoutEffect, useMemo, useState } from 'react'


import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FileConstructor } from '../lib/File'


import ContextMenu from './ContextMenu'
import File from '../lib/File'
import { FileItem } from './FileItem'
import style from './index.module.scss'
import FileManager from '../lib/FileManager'
import DragAndDropControl from '../lib/DragAndDropControl'
import FunctionCaller from '../../../tools/FunctionCaller'
export const FUNCTION_CALLER_KYE_RENDER_FILE_MANAGER_CONTENT = 'renderFileManagerContent'

interface IProps {
    parentThis: any,
}


export const Content: FC<IProps> = function Content({ parentThis }: IProps) {
    const [count, setCount] = useState(0)
    const renderComponent = () => setCount(count + 1)

    // setTimeout(()=>{
    //     renderComponent()
    // }, 1000)

    // const { parentThis } = props
    const dragAndDropControl = useMemo(() => new DragAndDropControl(), [])
    const rootFile = FileManager.getRootFile()
    const {
        showContextMenu,
        currentlySelectedItem,
        mouseDownXY,
        renameState,
        activeDragAndDropState
    } = parentThis.state

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'fileItem',
        canDrop: () => dragAndDropControl.isSrcFileCanDrop(rootFile),
        // drop: () => ({ name: 'Dustbin' }),

        drop: () => console.log(`@ move to ${dragAndDropControl.getDestFile()?.getFileName()}`),
        
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [dragAndDropControl])

    useEffect(() => {
        FunctionCaller.set(FUNCTION_CALLER_KYE_RENDER_FILE_MANAGER_CONTENT, renderComponent)
        return function () {
            FunctionCaller.remove(FUNCTION_CALLER_KYE_RENDER_FILE_MANAGER_CONTENT)
        }
        // const { srcFile, destFile } = activeDragAndDropState
        // const isActive = canDrop && isOver
        // // const srcDirectoryFile = (srcFile.isDirectory()) ? srcFile : srcFile.getParent()

        // // if (isActive && destFile !== destDirectoryFile && !destFile) {
        // if (isActive && destFile !== rootFile) {
        //     const isSrcFileCanDrop = (): boolean => {
        //         const arrFiles = (FileManager.selectedFileIsExists(srcFile)) ?
        //             FileManager.getSetSelectedFiles() :
        //             [srcFile]
        //         for (const file of arrFiles) {
        //             const fileParentFile = file.getParent()
        //             // 同父底下 與 如是資料夾自己底下當按夾 不可
        //             if (fileParentFile === rootFile
        //                 || (file.isDirectory() && rootFile!.isSubFileOf(file))) {
        //                 return false
        //             }
        //         }
        //         // 停留1秒展開文件夾
        //         if (rootFile.isExpand()) {
        //             setTimeout(() => {
        //                 const { destFile } = parentThis.state.activeDragAndDropState
        //                 console.log(destFile, rootFile)
        //                 console.log(destFile === rootFile)
        //                 if (destFile === rootFile) {
        //                     rootFile.setIsExpand(true)
        //                     parentThis.setState({})
        //                 }
        //             }, 1000)
        //         }
        //         return true
        //     }

        //     const isCanDropDown = isSrcFileCanDrop()
        //     if (isCanDropDown) {
        //         parentThis.setState({
        //             activeDragAndDropState: {
        //                 ...activeDragAndDropState,
        //                 destFile: rootFile,
        //                 isActive: true,
        //             },
        //             renameState: parentThis.initializationRenameState,
        //             showContextMenu: false,
        //         })
        //     } else if (!isCanDropDown && destFile) {
        //         // console.log('test')
        //         parentThis.setState({
        //             activeDragAndDropState: {
        //                 ...activeDragAndDropState,
        //                 destFile: undefined,
        //             },
        //             renameState: parentThis.initializationRenameState,
        //             showContextMenu: false,
        //         })
        //     }
        // }
    })

    // const onMouseLeaveListener = (event:any) => {
    //     console.log('leave')
    //     const { destFile } = activeDragAndDropState
    //     if (destFile) {
    //       parentThis.setState({
    //         activeDragAndDropState: {
    //           ...activeDragAndDropState,
    //           destFile: undefined
    //         }
    //       })
    //     }
    //   }

    const getFileList = () => {
        const fileList: any[] = [];
        const buildFileList = (objFile: File, deep: number) => {
            const temp = { objFile, deep }
            fileList.push(temp)
            if (objFile.isDirectory() && objFile.isExpand()) {
                objFile.getSubFiles().forEach((file: File) => buildFileList(file, deep + 1))
            }
        }
        FileManager.getRootFile().getSubFiles().forEach(file => buildFileList(file, 0))
        return fileList
    }

    // const getFileClassName = (objFile: File) => {
    //     const { grandparentThis } = props
    //     const {
    //         renameState,
    //         currentlySelectedItem,
    //         activeDragAndDropState
    //     } = grandparentThis.state

    //     // 是否在 rename 狀態
    //     if (!renameState.file.isRootFile()) { // 是 rename 狀態
    //         // 是否為 rename 項目
    //         if (renameState.file === objFile) { // 是 rename 項目
    //             // 是否在選中清單
    //             if (FileManager.selectedFileIsExists(objFile)) { // 在選中清單
    //                 return style.fileItemRenameItemOnSelected
    //             } else { // 不在選中清單
    //                 return style.fileItemRenameItem
    //             }
    //         } else { // 不是 rename 項目
    //             // 是否在選中清單
    //             if (FileManager.selectedFileIsExists(objFile)) { // 在選中清單
    //                 return style.fileItemOnSelectedRenameState
    //             } else { // 不在選中清單
    //                 return style.fileItemRenameState
    //             }
    //         }
    //     } else { // 不是 rename 狀態
    //         // 是否在選中清單
    //         if (FileManager.selectedFileIsExists(objFile)) { // 在選中清單
    //             // 是否為當前選取項
    //             if (currentlySelectedItem === objFile) { // 是當前選取項
    //                 return style.fileItemCurrentlySelected
    //             } else { // 不是當前選取項
    //                 return style.fileItemOnSelected
    //             }
    //         } else { // 不在選中清單
    //             // 是否為當前選取項
    //             if (currentlySelectedItem === objFile) { // 是當前選取項
    //                 return style.fileItemCurrentlyContextMenu
    //             } else { // 不是當前選取項
    //                 const { srcFile, destFile } = activeDragAndDropState
    //                 // 使否為拖曳準備下降區域
    //                 if (destFile && (objFile.isSubFileOf(destFile) || objFile === destFile)) { // 是拖曳準備下降區域
    //                     return style.fileItemDropArea
    //                 } else { // 不是拖曳準備下降區域
    //                     // 是否為拖曳項目
    //                     if (srcFile === objFile && isDragging) { //是拖曳項目
    //                         return style.fileItemOnDragUnSelected
    //                     } else {// 不是拖曳項目
    //                         return style.fileItem
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    const isActive = canDrop && isOver
    let backgroundColor = ''
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }

    if (isOver) {
        dragAndDropControl.setOnOverFile(rootFile, canDrop)
        // window.setTimeout(() => {
        //     if(isOver){
        //         dragAndDropControl.setOnOverFile(rootFile, canDrop)
        //     }
        // }, 300);
    }


    const prepareFileList = getFileList()
    // const { destFile } = activeDragAndDropState
    const destFile = dragAndDropControl.getDestFile()

    console.log('render Content')
    return (
        <>
            {showContextMenu ?
                <ContextMenu
                    parentThis={parentThis}
                    file={currentlySelectedItem}
                    x={mouseDownXY.x}
                    y={mouseDownXY.y}
                /> :
                <></>
            }
            <div
                // ref={drop}
                // style={{ backgroundColor }}
                className={style.fileManagerContent}
            // onMouseLeave={onMouseLeaveListener}
            >
                <div style={{ overflow: 'hidden', clear: 'both' }}>
                    {prepareFileList.map((item: any) =>
                        <FileItem
                            key={`FileItem_${item.objFile.getId()}`}
                            grandparentThis={parentThis}
                            renameState={renameState}
                            getFileList={getFileList}
                            dragAndDropControl={dragAndDropControl}
                            {...item}
                        />
                    )}
                </div>

                <div
                    ref={drop}
                    className={(isActive && destFile === rootFile) ? style.fillUnusedSpaceDropArea : style.fillUnusedSpace}
                    style={{ height: `calc(100% - ${prepareFileList.length * 21 + 1}px)` }}
                >

                </div>
            </div>
        </>
    )
}
