import { createDragPreview } from 'react-dnd-text-dragpreview'

import FileManager from './FileManager'


const dragPreviewStyle = {
    backgroundColor: "rgb(9, 71, 113)",
    borderColor: "rgb(0, 127, 212)",
    color: "rgb(240, 240, 240)",
    fontSize: 15,
    paddingTop: 4,
    paddingRight: 7,
    paddingBottom: 6,
    paddingLeft: 7
};

export const getDragPreview = (strFileId) => {
    const objFile = FileManager.getFileById(strFileId)
    let previewText = ''
    if (!FileManager.selectedFileIsExists(objFile)) {
        previewText = objFile.getFileName()
    } else {
        const onSelectedFileLength = FileManager.getSelectedFiles().length
        previewText = (onSelectedFileLength === 1) ?
            objFile.getFileName() :
            `${objFile.getFileName()}... ${onSelectedFileLength}`
    }
    return createDragPreview(previewText, dragPreviewStyle)
}

// export const getDragPreview = () => createDragPreview('test')
