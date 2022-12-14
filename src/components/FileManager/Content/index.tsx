import React, { FC, useEffect, useMemo, useState } from 'react'

import { useDrop } from 'react-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus, // create project
} from '@fortawesome/free-solid-svg-icons'

import ContextMenu from './ContextMenu'
import File from '../lib/File'
import { FileItem } from './FileItem'
import style from './index.module.scss'
import FileManager, { fileManagerClipboardId } from '../lib/FileManager'
import DragAndDropControl from '../lib/DragAndDropControl'
import FunctionCaller from '../../../tools/FunctionCaller'
import ProjectManager from '../../ProjectFrame/lib/ProjectManager'
import ClipboardController, { IClipboardVWData } from '../../../tools/ClipboardController'

export const FUNCTION_CALLER_KYE_RENDER_FILE_MANAGER_CONTENT = 'FileManager/Content: renderFileManagerContent'

interface IProps {
    parentThis: any,
    isEditing: boolean,
}

export const Content: FC<IProps> = function Content({
    parentThis,
    isEditing,
}: IProps) {
    const {
        showContextMenu,
        currentlySelectedItem,
        mouseDownXY,
        renameState,
    } = parentThis.state
    const rootFile = FileManager.getRootFile()

    const [count, setCount] = useState(0)
    const renderComponent = () => setCount(count + 1)

    const [boolClipboardDataIsFileData, setClipboardDataIsFileData] = useState(false)

    const dragAndDropControl = useMemo(() => new DragAndDropControl(), [])

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: dragAndDropControl.itemType.fileItem,
        canDrop: () => dragAndDropControl.isSrcFileCanDrop(rootFile),
        drop: () => {
            dragAndDropControl.setOnOverFile(rootFile)
            dragAndDropControl.action()
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [dragAndDropControl])


    const checkClipboardDataIsFileData = async () => {
        const clipboardData = await ClipboardController.read() as (IClipboardVWData | undefined)
        if (boolClipboardDataIsFileData) {
            if (!clipboardData || (clipboardData.id !== fileManagerClipboardId)) {
                setClipboardDataIsFileData(false)
            }
        } else {
            if (clipboardData && clipboardData.id === fileManagerClipboardId) {
                setClipboardDataIsFileData(true)
            }
        }
    }

    useEffect(() => {
        checkClipboardDataIsFileData()
        FunctionCaller.set(FUNCTION_CALLER_KYE_RENDER_FILE_MANAGER_CONTENT, renderComponent)
        return function () {
            FunctionCaller.remove(FUNCTION_CALLER_KYE_RENDER_FILE_MANAGER_CONTENT)
        }
    })

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

    const isActive = canDrop && isOver
    if (isActive) {
        dragAndDropControl.setOnOverFile(rootFile)
    }

    const prepareFileList = getFileList()

    // console.log('render Content')
    return (
        (isEditing) ?
            <>
                {showContextMenu ?
                    <ContextMenu
                        grandparentThis={parentThis}
                        file={currentlySelectedItem}
                        mouseDownXY={mouseDownXY}
                        renderParentComponent={renderComponent}
                        boolClipboardDataIsFileData={boolClipboardDataIsFileData}
                    /> :
                    <></>
                }
                <div className={style.fileManagerContent}>
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
                        style={{ height: `calc(100% - ${prepareFileList.length * 21 + 1}px)` }}
                    >
                        <div
                            className={(isActive) ? style.fillUnusedSpaceDropArea : style.fillUnusedSpace}
                            style={{ height: `21px` }}
                        />
                    </div>
                </div>
            </>
            : <div
                className={style.createNewProjectArea}
                onClick={ProjectManager.createNewProject}
            >
                <FontAwesomeIcon icon={faPlus} className={style.icon} />
            </div>

    )
}
