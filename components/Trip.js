import {Button, Center, FlatList, HStack, Modal, ScrollView, Text} from 'native-base'
import React, {useState} from 'react'
export const Trip = () => {
    const [route, setRoute] = useState('')
    const [stop, setStop] = useState('')
    const [direction, setDirection] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [selectedRoute, setSelectedRoute] = useState(null)
    const [startStop, setStartStop] = useState(null)
    const [finalStop, setFinalStop] = useState(null)
    const [colorScheme, setColorScheme] = useState(useColorScheme())
    const [routes, setRoutes] = useState([])
    const [stops, setStops] = useState([])
    const [directions, setDirections] = useState([])
    const [showTrip, setShowTrip] = useState(false)
    const [onlyShowOnline, setOnlyShowOnline] = useState(false)
    const [runTime, setRunTime] = useState(false)

        
    // if(cat == 'set_route'){
    //     setRoute(val)
    // } else if(cat == 'set_stop'){
    //     setStop(val)
    // } else if(cat == 'set_direction'){
    //     setDirection(val)
    // } else if(cat == 'get_route'){
    //     return route
    // }
    // else if(cat == 'get_stop'){
    //     return stop
    // } else if(cat == 'get_direction'){
    //     return direction
    // }
    const Timer = () => {
      if (runTime == true || isRunning == true) {
        return (
          <View>
            <Text 
            style={colorScheme=='dark'?darkMode.Text:lightMode.Text}
            >
              {minutes}:{seconds}
            </Text>
          </View>
        );
      } else {
        return (
          <View>
            <Text 
            style={colorScheme=='dark'?darkMode.Text:lightMode.Text}
            >
              {minutes}:{seconds}
            </Text>
          </View>
        );
      }
    };

    render(
      <View style={colorScheme == 'dark'? darkMode.carousel: lightMode.carousel}>
      <HStack space={4}>
        {onlyShowOnline ? (
          <Button
            onPress={() => setOnlyShowOnline(false)}
            style={colorScheme == 'dark'? darkMode.settingsBtn: lightMode.settingsBtn}
          >
            <MaterialCommunityIcons
              name="bus-alert"
              size={24}
              color="black"
            />
          </Button>
        ) : (
          <Button
            style={colorScheme == 'dark'? darkMode.settingsBtn: lightMode.settingsBtn}
            onPress={() => setOnlyShowOnline(true)}
          >
            <MaterialCommunityIcons
              name="bus-alert"
              size={24}
              color="green"
            />
          </Button>
        )}
     
      </HStack>

      {/*  TICKET */}

      {showTrip == false ? (
        <View style={ 
          colorScheme === "dark" ? darkMode.CarouselView : lightMode.CarouselView
        }>
          <Text style={ 
          colorScheme === "dark" ? darkMode.Text : lightMode.Text
        }>Ticket</Text>
          <Text style={ 
          colorScheme === "dark" ? darkMode.Text : lightMode.Text
        }>Route: {selectedRoute}</Text>
          <Timer  isStart={true} />

          <HStack>
            <Text style={ 
          colorScheme === "dark" ? darkMode.Text : lightMode.Text
        } >
              Parada 1: <StopRenderMinimal stop={"TIM_" + startStop} />
            </Text>
          </HStack>
          <HStack>
            <Text style={ 
          colorScheme === "dark" ? darkMode.Text : lightMode.Text
        } >
              Parada 2: <StopRenderMinimal stop={"TIM_" + finalStop} />
            </Text>
          </HStack>
          <HStack>
            <Button
              onPress={async () => {
                if (
                  selectedRoute == null ||
                  startStop == null ||
                  finalStop == null
                ) {
                  setShowTrip(true);
                  pause();
                  reset();
                  setRunTime(false);
                } else {
                  try {
                    const id = getAuth().currentUser.uid;
                    const docRef = doc(database, "users", id);
                    await addDoc(collection(docRef, "trips"), {
                      route: selectedRoute,
                      startStop: startStop,
                      finalStop: finalStop,
                      startTime: startTime,
                      stopTime: new Date().getTime(),
                      timeframe: hours + ":" + minutes + ":" + seconds,
                      location: {
                        lat: location.coords.latitude || 0,
                        lon: location.coords.longitude || 0,
                      },
                    });

                    setShowTrip(true);
                    pause();
                    reset();
                    setRunTime(false);
                    
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  }
                }
              }}
            >
              End Trip
            </Button>
          </HStack>
        </View>
      ) : null}
      {showTrip ? (
        <View
          style={
            colorScheme == "dark"
              ? darkMode.CarouselView
              : lightMode.CarouselView
          }
        >
          <HStack justifyContent={"space-between"}>
            <Text
              style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}
            >
              Trip
            </Text>
            <Button
              style={
                colorScheme == "dark"
                  ? darkMode.transparentBtn
                  : lightMode.transparentBtn
              }
              onPress={() => {
                setSelectedRoute(null);
                setStartStop(null);
                setFinalStop(null);
                setShowTrip(false);
              }}
            >
              <AntDesign name="closecircleo" size={24} color="black" />
            </Button>
          </HStack>
          <Button
            onPress={() => {
              setShowModal(true);
            }}
          >
            <Text>Pick Route</Text>
          </Button>
          <Center>
            <Modal
              style={colorScheme == "dark" ? darkMode.TicketView : lightMode.TicketView}
              isOpen={showModal}
              onClose={() => setShowModal(false)}
            >
              <Modal.Content maxWidth="80%">
                <Modal.CloseButton />
                <Modal.Header>Start Ticket 🎫</Modal.Header>
                <Modal.Body>
                  <Text
                    style={
                      colorScheme == "dark" ? darkMode.Text : lightMode.Text
                    }
                  >
                    Select Route
                  </Text>
                  <ScrollView>
                    <FlatList
                      data={getRoutes()}
                      keyExtractor={(item, index) =>
                        item.id + index.toString()
                      }
                      horizontal={true}
                      renderItem={({ item }) => {
                        return (
                          <Button
                            onPress={() => {
                              setSelectedRoute(item.id);
                            }}
                            style={
                              colorScheme == "dark"
                                ? darkMode.horizontalBtn
                                : lightMode.horizontalBtn
                            }
                          >
                          <HStack space={2}>
                          {
                            selectedRoute == item.id ? (<MaterialCommunityIcons name="bus-stop" size={24} color="black" />):null
                          }
                            <Text
                              style={
                                colorScheme == "dark"
                                  ? darkMode.Text
                                  : lightMode.Text
                              }
                            >
                              {item.name}
                            </Text>
                            </HStack>
                          </Button>
                        );
                      }}
                    />
                  </ScrollView>
                  {
                    selectedRoute != null ? (
                      <ScrollView>
                      <Text style={
                        colorScheme == "dark" ? darkMode.Text : lightMode.Text
                      }>
                        Select First Stop
                      </Text>
                    <FlatList
                      data={getStopsByRouteId(selectedRoute)}
                      keyExtractor={(item, index) =>
                        item.id + index.toString()
                      }
                      horizontal={true}
                      renderItem={({ item }) => {
                        return (
                          <Button
                            onPress={() => {
                              setStartStop(item.id);
                            }}
                            style={
                              colorScheme == "dark"
                                ? darkMode.horizontalBtn
                                : lightMode.horizontalBtn
                            }
                          >
                          <HStack space={2}>
                          {
                            startStop == item.id ? (<MaterialCommunityIcons name="bus-stop" size={24} color="black" />):null
                          }
                            <Text
                              style={
                                colorScheme == "dark"
                                  ? darkMode.Text
                                  : lightMode.Text
                              }
                            >
                              {item.name}
                            </Text>
                            </HStack>
                          </Button>
                        );
                      }}
                    />
                  </ScrollView>
                    ) : (
                      <Text>
                        Select a route to continue
                      </Text>
                    )
                  }
                  {
                    startStop != null ? (
                      <ScrollView>
                      <Text style={
                        colorScheme == "dark" ? darkMode.Text : lightMode.Text
                      }>
                        Select Final Stop
                      </Text>
                    <FlatList
                      data={getStopsByRouteId(selectedRoute)} //TODO optimize change this to a useState variable
                      keyExtractor={(item, index) =>
                        item.id + index.toString()
                      }
                      horizontal={true}
                      renderItem={({ item }) => {
                        return (
                          <Button
                            onPress={() => {
                              setFinalStop(item.id);
                            }}
                            style={
                              colorScheme == "dark"
                                ? darkMode.horizontalBtn
                                : lightMode.horizontalBtn
                            }
                          >
                           <HStack space={2}>
                          {
                            finalStop == item.id ? (<MaterialCommunityIcons name="bus-stop" size={24} color="black" />):null
                          }
                            <Text
                              style={
                                colorScheme == "dark"
                                  ? darkMode.Text
                                  : lightMode.Text
                              }
                            >
                              {item.name}
                            </Text>
                            </HStack>
                            
                          </Button>
                        );
                      }}
                    />
                  </ScrollView>
                    ) : (
                      null
                    )
                  }
                  
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setShowModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={() => {
                        setShowModal(false);
                        const item = new Date().getTime();
                        setRunTime(true);
                        setStartTime(item)
                        setShowTrip(false);
                        setShowAll(false);
                        start();
                      }}
                    >
                      Start Trip
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center>
        </View>
      ) : null}
    </View>
    )

}

