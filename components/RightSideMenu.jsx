// RightSideMenu

import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  VStack,
} from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from "react-native-vector-icons";
import React, { useEffect } from "react";

export const RightSideMenu = ({
  activeTab,
  setMenu,
  refmap,
  location,
  startStop,
  finalStop,
  confirmTrip,
  selectedTrip,
  selectedStopName,
  selectedStop,
}) => {

  return (
    <Box
      style={{
        width: "80%",
        height: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        height: "35%",
        position: "absolute",
        top: "60%",
      }}
    >
      <HStack
        space={2}
        alignItems="center"
        padding={3}
        justifyContent={"flex-start"}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Menu</Text>
      </HStack>
      <Box flex={1} alignItems="flex-start" padding={5}>
        {/* list for active stop predictions and route */}
        {/* hstack space between */}
        <HStack
          space={2}
          width={"100%"}
          alignItems="center"
          justifyContent={"space-between"}
        >
       
          <VStack space={0} alignItems="flex-start">
          <Text style={{ fontSize: 12 }}>
              First Stop : {selectedStop}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {selectedStopName}
            </Text>
          </VStack>
         {
          startStop == null && selectedStop != null ? (
            <HStack space={1} alignItems="flex-start">
            <IconButton
              borderColor={"transparent"}
              variant={"outline"}
              icon={
                <Icon
                  size={"md"}
                  as={<MaterialIcons name="check" />}
                  color="black"
                />
              }
            />
            <IconButton
              borderColor={"transparent"}
              variant={"outline"}
              icon={
                <Icon
                  size={"md"}
                  as={<MaterialIcons name="cancel" />}
                  color="black"
                />
              }
            />
          </HStack>
          ) : null
         }
          
        </HStack>
        <Divider/>
      </Box>
    </Box>
  );
};
