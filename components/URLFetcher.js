import { Text, View } from "react-native"

import React from "react"
import getStopTimes from "../assets/gtfs-completo/stop_times"
import { useState } from "react"

let gOnline = []
let gPosition = []
let gTrip = []
let gCurrentTime = 0
let gRouteIdforAgency = []


    
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
    fetch('https://pr-oba.live/api/where/current-time.json?key=TEST').then((response) => response.json()).then((data) => {
    gCurrentTime = (data).currentTime
    })
   
    

}


export function getRouteIdforAgency(){
     fetch('https://pr-oba.live/api/where/route-ids-for-agency/TIM.json?key=TEST').then((response) => response.json()).then((data) => {
        gCurrentTime = (data).currentTime
        return (data).list
        })
}

export function getCurrentTime(){
    return gCurrentTime
}

export function getOnline(){
        return gOnline
}
export function getOnlineById(deviceId){
    let online = []
    for (let i = 0; i < gOnline.length; i++) {
        if (gOnline[i].id === deviceId) {
            return gOnline[i].status
        }
    }
    return online
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

export function checkOnline(deviceId){
    for (let i = 0; i < gOnline.length; i++) {
        if (gOnline[i].deviceId === deviceId) {
            console.log(gOnline[i].status)
            return gOnline[i].status
            
        }
    }
    return 'offline'
}