import React, { FC, useEffect, useLayoutEffect } from 'react'


import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FileConstructor } from '../lib/File'


import ContextMenu from './ContextMenu'
import File from '../lib/File'
import { FileItem } from './FileItem'
import style from './index.module.scss'
import FileManager from '../lib/FileManager'

interface IProps {
    parentThis: any,
}


export const Content: FC<IProps> = function Content(props) {
    const rootFile = FileManager.getRootFile()
    const { parentThis } = props
    const {
        showContextMenu,
        currentlySelectedItem,
        mouseDownXY,
        renameState,
        activeDragAndDropState
    } = parentThis.state

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'fileItem',
        drop: () => ({ name: 'Dustbin' }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    useEffect(() => {
        const { srcFile, destFile } = activeDragAndDropState
        const isActive = canDrop && isOver
        // const srcDirectoryFile = (srcFile.isDirectory()) ? srcFile : srcFile.getParent()

        // if (isActive && destFile !== destDirectoryFile && !destFile) {
        if (isActive && destFile !== rootFile) {
            const isSrcFileCanDrop = (): boolean => {
                const arrFiles = (FileManager.selectedFileIsExists(srcFile)) ?
                    FileManager.getSetSelectedFiles() :
                    [srcFile]
                for (const file of arrFiles) {
                    const fileParentFile = file.getParent()
                    // 同父底下 與 如是資料夾自己底下當按夾 不可
                    if (fileParentFile === rootFile
                        || (file.isDirectory() && rootFile!.isSubFileOf(file))) {
                        return false
                    }
                }
                // 停留1秒展開文件夾
                if (rootFile.isExpand()) {
                    setTimeout(() => {
                        const { destFile } = parentThis.state.activeDragAndDropState
                        console.log(destFile, rootFile)
                        console.log(destFile === rootFile)
                        if (destFile === rootFile) {
                            rootFile.setIsExpand(true)
                            parentThis.setState({})
                        }
                    }, 1000)
                }
                return true
            }

            const isCanDropDown = isSrcFileCanDrop()
            if (isCanDropDown) {
                parentThis.setState({
                    activeDragAndDropState: {
                        ...activeDragAndDropState,
                        destFile: rootFile,
                        isActive: true,
                    },
                    renameState: parentThis.initializationRenameState,
                    showContextMenu: false,
                })
            } else if (!isCanDropDown && destFile) {
                // console.log('test')
                parentThis.setState({
                    activeDragAndDropState: {
                        ...activeDragAndDropState,
                        destFile: undefined,
                    },
                    renameState: parentThis.initializationRenameState,
                    showContextMenu: false,
                })
            }
        }
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

    const prepareFileList = getFileList()
    const { destFile } = activeDragAndDropState

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
                            {...item}
                        />
                    )}
                </div>

                <div
                    ref={drop}
                    className={(destFile === rootFile) ? style.fillUnusedSpaceDropArea : style.fillUnusedSpace}
                    style={{ height: `calc(100% - ${prepareFileList.length * 21.5 + 1}px)` }}>

                </div>
            </div>
        </>
    )
}
