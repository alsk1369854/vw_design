import { useEffect, useState } from 'react'



export default function useLocalStorage(key: any, initialValue: any, strPathName:string) {
  const prefixedKey = strPathName + '-' + key

  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey)
    if (jsonValue != null) return jsonValue

    if (typeof initialValue === 'function') {
      return initialValue()
    } else {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(prefixedKey, value)
  }, [prefixedKey, value])

  return [value, setValue]
}
