
import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleRight,
  faAngleDown,
  faSquareFull,
  faFileCirclePlus,
  faFolderPlus,
} from '@fortawesome/free-solid-svg-icons'
// import { useDrag } from 'react-dnd'

import style from './index.module.scss'
import File, { FileConstructor } from '../lib/File'
import FileManager from '../lib/FileManager'

interface IState { }

interface IProps {
    parentThis: any,
    renameState:any,
    objFile: File,
    deep:number,
}

export default class FileItem extends Component<IProps, IState> {

    getExpandLine = (strFileId: string, numFileDeep: number) => {
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

    getFileClassName = (objFile:File) => {
        const { parentThis } = this.props
        const { renameState, currentlySelectedItem } = parentThis.state
        // 是否在 rename 狀態
        if (renameState.file !== FileManager.getRootFile()) { // 是 rename 狀態
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
    render() {
        const { parentThis, objFile, deep, renameState } = this.props
        // const { renameState } = parentThis
        // const {  deep } = item
        return (
            <div
                // key={file.getId()}
                onClick={(event) => parentThis.clickItem(event, objFile)}
                onDoubleClick={(event) => parentThis.doubleClickItem(event, objFile)}
                onContextMenu={(event) => parentThis.showItemContextMenu(event, objFile)}
                className={this.getFileClassName(objFile)}
            >
                {this.getExpandLine(objFile.getId(), deep)}

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
                                onFocus={parentThis.renameOnFocus}
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

        )
    }
}
