import {useEffect, useState} from 'react';

const [activeTicket, setActiveTicket] = useState(null); // activity is active
const [isUserMoving, setIsUserMoving] = useState(false);
const [startTrip, setStartTrip] = useState(false);
const [selectedStop, setSelectedStop] = useState(null);
const [stops, setStops] = useState([]);
const [trip, setTrip] = useState([]);
const [predictions, setPredictions] = useState([]);
const [commentary, setCommentary] = useState([]);




export function startRoute(stopName, stopId) {
    setStartTrip(true);
    setSelectedStop([stopId, stopName]);
}

export function getSelectedStop() {
    return selectedStop;
}