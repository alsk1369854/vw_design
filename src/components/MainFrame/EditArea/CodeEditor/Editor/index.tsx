import  './index.scss'
import CodeMirror from "@uiw/react-codemirror";

import { javascript, esLint, javascriptLanguage } from "@codemirror/lang-javascript";
import {html, htmlLanguage} from "@codemirror/lang-html";
import {css, cssLanguage} from "@codemirror/lang-css"
import { lintGutter, linter, openLintPanel } from "@codemirror/lint";

import Linter from "eslint4b-prebuilt/dist/eslint4b";//Linter可自行改名

export default function CodeEditor(props:{language: any, value: any, onChange: any}) {

  const arr1Extensions = new Map(
      [ ['html', [lintGutter(),html(), htmlLanguage]],//['html', [lintGutter(),html(), htmlLanguage]],  
        ['js',   [linter(esLint(new Linter())),lintGutter(),javascript({ jsx: true }), javascriptLanguage]],//['js',   [linter(esLint(new Linter())),lintGutter(),javascript({ jsx: true }), javascriptLanguage]], 
        ['css',  [lintGutter(),css(),cssLanguage]]]//['css',  [lintGutter(),css(),cssLanguage]]]
    );
  
  return (
    <div>
      <CodeMirror
        theme="dark"
        value= {props.value}
        extensions= {arr1Extensions.get(props.language)}
        onChange= {(value, viewUpdate) => props.onChange(value)}
        height="605px"
      />
    </div>
  );
}



