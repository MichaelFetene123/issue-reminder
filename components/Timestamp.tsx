"use client"
import { useEffect, useState } from 'react'

export const Timestamp = () => {

    const [time, setTime] = useState<number | null>(null)

    useEffect(() => {
        const fullYear = new Date().getFullYear()
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTime(fullYear)
    }, [])

    if(time){
        return time
    }
    return null
}
