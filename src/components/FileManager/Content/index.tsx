import React, { FC, memo, useEffect, useLayoutEffect, useMemo, useState } from 'react'

import { useDrop } from 'react-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus, // create project
} from '@fortawesome/free-solid-svg-icons'

import ContextMenu from './ContextMenu'
import File from '../lib/File'
import { FileItem } from './FileItem'
import style from './index.module.scss'
import FileManager from '../lib/FileManager'
import DragAndDropControl from '../lib/DragAndDropControl'
import FunctionCaller from '../../../tools/FunctionCaller'
import { useHref, useNavigate } from 'react-router-dom'
import ProjectManager from '../../ProjectFrame/lib/ProjectManager'

export const FUNCTION_CALLER_KYE_RENDER_FILE_MANAGER_CONTENT = 'FileManager/Content: renderFileManagerContent'

interface IProps {
    parentThis: any,
    isEditing: boolean,
}

export const Content: FC<IProps> = function Content({
    parentThis,
    isEditing,
}: IProps) {

    const [count, setCount] = useState(0)
    const renderComponent = () => setCount(count + 1)

    const [goToProjectManage, setGoToProjectManage] = useState(false)

    const routePath = useHref('/ProjectManage');
    const navigate = useNavigate();

    const dragAndDropControl = useMemo(() => new DragAndDropControl(), [])
    const rootFile = FileManager.getRootFile()
    const {
        showContextMenu,
        currentlySelectedItem,
        mouseDownXY,
        renameState,
    } = parentThis.state

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: dragAndDropControl.itemType.fileItem,
        canDrop: () => dragAndDropControl.isSrcFileCanDrop(rootFile),
        // drop: () => ({ name: 'Dustbin' }),
        drop: () => {
            dragAndDropControl.setOnOverFile(rootFile)
            dragAndDropControl.action()
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [dragAndDropControl])

    useEffect(() => {
        if (goToProjectManage) {
            navigate(routePath)
            setGoToProjectManage(false)
        }
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

    const createProject = () => {
        setGoToProjectManage(true)
        ProjectManager.createNewProject()
    }

    const isActive = canDrop && isOver
    // let backgroundColor = ''
    // if (isActive) {
    //     backgroundColor = 'darkgreen'
    // } else if (canDrop) {
    //     backgroundColor = 'darkkhaki'
    // }

    if (isActive) {
        dragAndDropControl.setOnOverFile(rootFile)
    }

    const prepareFileList = getFileList()
    // const destFile = dragAndDropControl.getDestFile()

    // console.log('render Content')
    return (
        (isEditing) ?
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
                        style={{ height: `calc(100% - ${prepareFileList.length * 21 + 1}px)` }}
                    >
                        <div
                            className={(isActive) ? style.fillUnusedSpaceDropArea : style.fillUnusedSpace}
                            style={{ height: `21px` }}
                        />
                        {/* <div
            ref={drop}
            className={(isActive && destFile === rootFile) ? style.fillUnusedSpaceDropArea : style.fillUnusedSpace}
            style={{ height: `calc(100% - ${prepareFileList.length * 21 + 1}px)` }}
        > */}
                    </div>
                </div>
            </>
            : <div
                className={style.createProjectContent}
                onClick={createProject}
            >
                <FontAwesomeIcon icon={faPlus} className={style.icon} />
            </div>

    )
}
