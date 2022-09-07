# ClipboardController
## interface
> export `IClipboardReadOption`
> 
> export `IClipboardVWData`
## class
> export default `ClipboardController`
## enum
> export `IClipboardReadOptionType`
<br/>

## ClipboardController API
|       Function |     Return  | Description   |
| -------------- | ----------- |---- --------- |
| async read(option?: IClipboardReadOption) | <center>Promise<string \| IClipboardVWData \| undefined></center> | 讀取剪貼版內容，可選擇傳入<br/> option 指定是否讀取原始文本，<br/>預設讀取 IClipboardVWData，<br/>若非 IClipboardVWData 則返回 <br/>undefined |
| async write(objVWData: IClipboardVWData)  | <center>void</center> | 將 VW Design 使用的 Data 封<br/>裝寫入剪貼版中  |
| async writeText(text: string)   | <center>void</center> | 純 text 文本寫入剪貼版中  |

<br/>

## ClipboardController API 使用範例
### 1-1. 讀取剪貼版 VW Design Data
```typescript
import ClipboardController from .../ClipboardController

// 方式一 then
const dataPromise = ClipboardController.read()
dataPromise.then((response)=>{
    console.log(response)
})

// 方式二 await
const dataReader = async () => {
    const data = await ClipboardController.read()
    console.log(data)
}
dataReader()
```
<br/>

### 1-2. 讀取剪貼版原始文本
```typescript
import ClipboardController, { IClipboardReadOption, IClipboardReadOptionType } from .../ClipboardController

// 方式一 then
const opt: IClipboardReadOption = {type: IClipboardReadOptionType.RAW}
const dataPromise = ClipboardController.read(opt)
dataPromise.then((response)=>{
    console.log(response)
})

// 方式二 await
const dataReader = async () => {
    const opt = {type: IClipboardReadOptionType.RAW}
    const data = await ClipboardController.read(opt)
    console.log(data)
}
dataReader()
```

### 2-1. 寫入剪貼版 VW Design Data
```typescript
import ClipboardController, { IClipboardVWData } from .../ClipboardController

const myData = {name: 'ming', age: 20}
const vwData: IClipboardVWData = {
    id: 'my_data_id',
    data: myData
}
ClipboardController.write(vwData)
``` 
<br/>

### 2-1. 寫入剪貼版一般 text 文本
```typescript
import ClipboardController, { IClipboardVWData } from .../ClipboardController

const myText = '芭比Q了'
ClipboardController.writeText(myText)
```