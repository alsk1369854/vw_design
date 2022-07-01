import useLocalStorage from '../hooks';
import CodeEditor from '../Editor';
import  '../Editor/index.scss'
import { useState } from 'react';
import Select from 'react-select';

export default function EditorFrame(props:{strPathName:string, strLang: string, strCode:string, strTheme:string}) {
    const [strCode, setCode] = useLocalStorage(props.strLang, props.strCode, props.strPathName);

    const [open, setOpen] = useState(true);

    const [selectedOption, setSelectedOption] = useState<{value: string;label: string;} | null>({ value: 'light', label: 'light' });
    const options = [
      { value: 'light', label: 'light' },
      { value: 'dark', label: 'dark' },
    ];

    const [strLanguage, setLanguage] = useState<{value: string;label: string;} | null>({ value: 'html', label: 'html' });
    const options_lang = [
      { value: 'html', label: 'html' },
      { value: 'js', label: 'js' },
      { value: 'css', label: 'css' },
    ];

    return (
      <div className="pane top-pane">
        <div className={`editor-container ${open ? '': 'collapsed'}`}>
          <div className="editor-title">
            <Select
              defaultValue={strLanguage}
              options={options_lang}
              onChange={(value) =>{setLanguage(value)}}
            />
          </div>
          
          <CodeEditor
            language={strLanguage?.value}
            value={strCode}
            onChange={setCode}
          />
          
      </div>
    </div>
      
      
    )
}
