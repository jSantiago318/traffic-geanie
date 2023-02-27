import { Text, View } from "react-native"

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

export function getOnlineCount(){
    let count = 0
    for (let i = 0; i < gOnline.length; i++) {
        if (gOnline[i].status === 'online') {
            count++
        }
    }
    return count
}
export function getDeviceAccuracy(deviceId){
    for (let i = 0; i < gPosition.length; i++) {
        if (gPosition[i].deviceId === deviceId) {
            return gPosition[i].accuracy
        }
    }
    return 0
}

export function getDeviceCoords(deviceId){
    let coords = []
    for (let i = 0; i < gPosition.length; i++) {
        if (gPosition[i].deviceId === deviceId) {
            return { 
                latitude: gPosition[i].latitude,
                longitude: gPosition[i].longitude
            }
        }
    }
    return coords
}

export function getOnlineActiveTripsCount(){
    let count  = 0
    for (let i = 0; i < gTrip.length; i++) {
        if (gTrip[i].distanceAlongTrip > 0) {
            count++
        }
    }
    return count
}

export function getPosition(){
    return gPosition
}

export function getTrip(){
    return gTrip
}
export function getPositionByName(name){
    let position = []
    for (let i = 0; i < gPosition.length; i++) {
        if (gPosition[i].deviceId === name) {
            return gPosition[i]
        }
    }
    return position
}
