import { Text, View } from "react-native"

import { FlashList } from "@shopify/flash-list"
import React from "react"
import getStopTimes from "../assets/gtfs/stop_times"
import { useState } from "react"

let gOnline = []
let gPosition = []
let gTrip = []


    
if (gOnline.length === 0) {
fetch('http://143.198.119.7:8020/online')
    .then((response) => response.json())
    .then((data) => {
    gOnline = (data)
    })
    fetch('http://143.198.119.7:8020/trips')
    .then((response) => response.json())
    .then((data) => {
    gTrip = (data)
    })
    fetch('http://143.198.119.7:8020/position')
    .then((response) => response.json())
    .then((data) => {
    gPosition = (data)
    })
}
 

export function getOnline(){
        return gOnline
}

export function getPosition(){
    return gPosition
}

export function getTrip(){
    return gTrip
}

