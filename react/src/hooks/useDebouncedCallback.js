import { useCallback, useRef } from 'react'
import debounce from 'lodash/debounce'

const useDebouncedCallback = (callback, delay) => {
    const callbackRef = useRef()
    callbackRef.current = callback
    return useCallback(
        debounce((...props) => callbackRef.current(...props), delay),
        []
    )
}

export default useDebouncedCallback
