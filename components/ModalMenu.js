import { Button, Center, FlatList, HStack, Modal, ScrollView, Text, View } from "native-base";
import React, { useEffect, useState } from "react";
import { darkMode, lightMode } from "../config";

import { AntDesign } from "@expo/vector-icons";
import {getRoutes} from '../assets/gtfs/route'
import { useColorScheme } from "react-native";
import { useStopwatch } from "react-timer-hook";

const ModalMenu = () => {
  const colorScheme = useColorScheme();
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [startStop, setStartStop] = useState(null);
    const [finalStop, setFinalStop] = useState(null);
    const [routes, setRoutes] = useState(null);
    
    useEffect(() => {

        if(selectedRoute == null){
            setRoutes(getRoutes())
        }
    }, [selectedRoute, routes, startStop, finalStop]);
  return (
    <Center>
    <View
      style={
        colorScheme == "dark" ? darkMode.carousel : lightMode.carousel
      }
    >
      <HStack justifyContent={"space-between"}>
        <Text style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}>
          Trip
        </Text>
        <Button
          style={{
            backgroundColor: "transparent",
          }}
          onPress={() => {
            setSelectedRoute(null);
            setStartStop(null);
            setFinalStop(null);
          }}
        >
          <AntDesign
            name="closecircleo"
            style={colorScheme == "dark" ? darkMode.icon : lightMode.icon}
            size={24}
          />
        </Button>
      </HStack>
      <ScrollView>
        <FlatList
            data={routes}
            renderItem={({ item }) => (
                <Button
                    style={
                        colorScheme == "dark"
                            ? darkMode.transparentBtn
                            : lightMode.transparentBtn
                    }
                    onPress={() => {
                        setSelectedRoute(item);
                    }}
                >

                    <Text
                        style={
                            colorScheme == "dark"
                                ? darkMode.Text
                                : lightMode.Text
                        }
                    >
                        {item.name}
                    </Text>
                </Button>
            )}
            keyExtractor={(item) => item.id}
        />
        
      </ScrollView>
    </View>
    </Center>
  );
};

export { ModalMenu };
