import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare, // open
  faFileArrowDown, // download
  faScissors, // cut
  faCopy, // copy
  faPaste, // paste
  faSignature, // rename
  faTrashCan, // delete
} from '@fortawesome/free-solid-svg-icons'

import style from './index.module.scss'
import File, { FileConstructor } from '../../lib/File'
import FileManager, { FileManager as staticFileManager } from '../../lib/FileManager'
import { icon, setTemporaryFileName, setTemporaryMessage } from '../../index'
import ClipboardController, { IClipboardVWData } from '../../../../tools/ClipboardController'

interface IMouseDownXY {
  x: string | number,
  y: string | number,
}

interface IProps {
  grandparentThis: any,
  file: File,
  mouseDownXY: IMouseDownXY,
  renderParentComponent: Function,
  boolClipboardDataIsFileData: boolean,
}

export default function ContextMenu({
  grandparentThis,
  file,
  mouseDownXY,
  renderParentComponent,
  boolClipboardDataIsFileData,
}: IProps) {

  const open = () => {
    if (FileManager.selectedFileIsExists(file)) {
      FileManager.addOpenFileSeletedFiles()
    } else {
      FileManager.addOpenFile(file)
    }
  }

  const rename = (event: any, objFile: File) => {
    event.stopPropagation()
    const { renameState } = grandparentThis.state
    // this.props.setRenameItem(objFile)
    setTemporaryFileName(objFile.getFileName())
    setTemporaryMessage('')
    grandparentThis.setState({
      renameState: {
        ...renameState,
        file: objFile,
        oldName: objFile.getFileName(),
      },
      showContextMenu: false,
    })
  }

  const download = () => {
    if (FileManager.selectedFileIsExists(file)) {
      FileManager.downloadSeletedFiles()
    } else {
      staticFileManager.downloadFile(file)
    }
  }

  const deleteFileItem = () => {
    if (FileManager.selectedFileIsExists(file)) {
      FileManager.getSelectedFiles().forEach(file => file.delete())
    } else {
      file.delete()
    }
  }

  const cut = () => {
    const clipboardData = FileManager.buildCutData(file)
    ClipboardController.write(clipboardData)
   }

  const copy = () => {
    const clipboardData: IClipboardVWData = FileManager.buildCopyData(file)
    ClipboardController.write(clipboardData)
  }

  const paste = () => {
    const readClipboardData = async () => {
      try {
        const clipboardData = await ClipboardController.read() as (IClipboardVWData | undefined)
        if (clipboardData && file.isDirectory()) {
          await file.pasteFiles(clipboardData.data as FileConstructor[])
          renderParentComponent()
        }
      } catch (error) {
        console.error(error)
      }
    }
    readClipboardData()
  }

  // check browser visible context
  // directory height: 220; file height: 175
  const height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
  if (file.isDirectory() && mouseDownXY.y as number + 220 > height) {
    mouseDownXY.y = height - 220
  } else if (mouseDownXY.y as number + 175 > height) {
    mouseDownXY.y = height - 175
  }


  return (
    <ul className={style.projectContextMenu}
      style={{ top: mouseDownXY.y, left: mouseDownXY.x }}
    >
      {(file.isDirectory()) ?
        <>
          <li onClick={event => grandparentThis.addFile(event, false)}>
            <span className={style.iconBar}>
              {icon.addFile}
            </span>
            <span className={style.itemName}> Add File</span>
          </li>
          <li onClick={event => grandparentThis.addFile(event, true)}>
            <span className={style.iconBar}>
              {icon.addDirectory}
            </span>
            <span className={style.itemName}> Add Directory</span>
          </li>
        </> :
        <>
          <li onClick={open} >
            <span className={style.iconBar}>
              <FontAwesomeIcon className={style.icon} icon={faArrowUpRightFromSquare} />
            </span>
            <span className={style.itemName}>Open</span>
          </li>
        </>
      }

      <div className={style.line}></div>
      <li onClick={cut}>
        <span className={style.iconBar}>
          <FontAwesomeIcon className={style.icon} icon={faScissors} />
        </span>
        <span className={style.itemName}>Cut</span>
      </li>
      <li onClick={copy}>
        <span className={style.iconBar}>
          <FontAwesomeIcon className={style.icon} icon={faCopy} />
        </span>
        <span className={style.itemName}>Copy</span>
      </li>

      {(file.isDirectory()) ?
        <li
          className={(boolClipboardDataIsFileData) ? style.enabled : style.disabled}
          onClick={(boolClipboardDataIsFileData) ? paste : (event) => event.stopPropagation()}
        >
          <span className={style.iconBar}>
            <FontAwesomeIcon className={style.icon} icon={faPaste} />
          </span>
          <span className={style.itemName}>Paste</span>
        </li>
        :
        <></>
      }

      <div className={style.line}></div>
      <li onClick={download}>
        <span className={style.iconBar}>
          <FontAwesomeIcon className={style.icon} icon={faFileArrowDown} />
        </span>
        <span className={style.itemName}>Download</span>
      </li>

      {(file === FileManager.getRootFile()) ?
        <></> :
        <>
          <div className={style.line}></div>
          <li onClick={event => rename(event, file)}>
            <span className={style.iconBar}>
              <FontAwesomeIcon className={style.icon} icon={faSignature} />
            </span>
            <span className={style.itemName}>Rename</span>
          </li>
          <li onClick={deleteFileItem}>
            <span className={style.iconBar}>
              <FontAwesomeIcon className={style.icon} icon={faTrashCan} />
            </span>
            <span className={style.itemName}>Delete</span>
          </li>
        </>
      }
    </ul>

  )
}
