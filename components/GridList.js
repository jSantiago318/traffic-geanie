import { Box, FlatList, HStack, Icon, Pressable, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { darkMode, lightMode } from "../config";

import { StopRender } from "./OBAFetches/StopRender";
import { render } from "react-dom";

export const GridList = ({ list }) => {
  const colorScheme = useColorScheme();

  const GridItem = ({ stop }) => {
    return (
      <Box style={colorScheme == "dark" ? darkMode.Card : lightMode.Card}>
        <HStack>
          <VStack>
          <Pressable >
            <Text style={colorScheme == "dark" ? darkMode.routeText : lightMode.routeText}>
              {stop.name}
            </Text>
          </Pressable>
          </VStack>
        </HStack>
      </Box>
    )
  };
  return (
    <ScrollView>
      <FlatList
        style={colorScheme == "dark" ? darkMode.routeList : lightMode.routeList}
        data={list}
        renderItem={
          ({ item, index }) => (
            <GridItem stop={item} />
          )
        }
      />
    </ScrollView>
  );
};
