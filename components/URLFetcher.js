import { Text, View } from "react-native"

import React from "react"
import getStopTimes from "../assets/gtfs-completo/stop_times"
import { useState } from "react"

let gOnline = []
let gPosition = []
let gTrip = []
let gCurrentTime = 0
let GTFSroutes = []


    
if (gOnline.length === 0) {
    fetch('http://178.128.154.222:8020/online')
    .then((response) => response.json())
    .then((data) => {
    gOnline = (data)
    })
    
    fetch('http://178.128.154.222:8020/trips')
    .then((response) => response.json())
    .then((data) => {
    gTrip = (data)
    })
    fetch('http://178.128.154.222:8020/position')
    .then((response) => response.json())
    .then((data) => {
    gPosition = (data)
    })

}
export function getStopTime(route, index){
    fetch('https://pr-oba.live/api/where/schedule-for-stop/TIM_'+route+'S'+index+'.json?key=TEST').then((response) => response.json()).then((data) => {
        return data
    })
}


const firstStop = {
    "RR102": "TIM_RR102S03",
    "RR105": "TIM_RR105S05",
    "RR108": "TIM_RR108S05",
    "RR106": "TIM_RR106S05",
    "RR348": "TIM_RR348S05",
    "RR349": "TIM_RR349S05"
}


let currRoute = null
let currStops = []
let currPredictions = []
export function getSchedule(route, index){
    try {
            if (currRoute !== route) {
                currRoute = route
                const stop = firstStop[route]
                let arrivalTime = 'not active'
            fetch('https://pr-oba.live/api/where/schedule-for-stop/'+stop+'.json?key=TEST').then((response) => response.json()).then((data) => {
                currStops = data.data.entry.stopRouteSchedules[0].stopRouteDirectionSchedules[0].scheduleStopTimes
                currPredictions.push(new Date (currStops[index].arrivalTime).toLocaleTimeString())
                arrivalTime = new Date (currStops[index].arrivalTime).toLocaleTimeString()
                console.log(arrivalTime)
            })
            console.log(currPredictions[index])
            return arrivalTime
        } 
        } catch (error) {
            console.log(error)
        }
    
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