import { Center, Heading, SectionList } from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { colorsDark, colorsLight, darkMode, lightMode } from "../config";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StopRender } from "./OBAFetches/StopRender";

export const RoutesList = ({ route }) => {
  const colorScheme = useColorScheme();
  const [stp, setStp] = useState([]);
  const [stp1, setStp1] = useState([]);
  const memo = useMemo(() => getURL(route), [route]);
  async function getURL(url) {
    const response = await fetch("https://proba.live/api/where/stops-for-route/" + url + ".json?key=TEST");
    const data = await response.json();
    const stops = data.data.entry.stopGroupings[0].stopGroups[0].stopIds;
    const stops1 = data.data.entry.stopGroupings[0].stopGroups[1].stopIds;
    setStp(stops);
    setStp1(stops1);
    return stops, stops1;
  }

  const renderItem = ({ item, index }) => (
    <StopRender stop={item} index={index} />
  );

  if (route.includes("TIM")) {
    route = route.substring(4, route.length);
  }

  const data = [
    {
      title: "Route: " + route + " Ongoing",
      data: stp,
    },
    {
      title: "Route: " + route + " Return",
      data: stp1,
    },
  ];
  return (
    <Center 
      style={{
        backgroundColor: colorScheme === "light" ? colorsLight.secondaryColor : colorsLight.primaryColor,
        borderRadius: 10,
        width: "90%",
        padding: 5,
        margin: 5, 
      }}

     >
      <SectionList
        w="100%"
        height={"60%"}
        mb="4"
        sections={data}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Center
            w="100%"
            alignItems={"flex-start"}
            paddingLeft={2}
            borderRadius={10}
            backgroundColor={colorScheme === "light" ? colorsLight.primaryColor : colorsLight.accentColor}
          >
            <Heading fontSize="lg" p={2} color={
              colorScheme === "light" ? colorsLight.textColor : colorsDark.textColor
            } >
              {title}
            </Heading>
          </Center>
        )}
      />
    </Center>
  );
};
