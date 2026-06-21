"use client"
import React, { useLayoutEffect, useState } from 'react'

export const Timestamp = () => {

    const [time, setTime] = useState<number | null>(null)

    useLayoutEffect(() => {
      
        const fullYear = new Date().getFullYear()
       setTime(fullYear)
     
    }, [])

    if(time){
        return time
    }
    return null
}
