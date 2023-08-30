import {Box, HStack, Stack, Text, View} from "native-base";
import React, {useEffect} from "react";

import {MaterialIcons} from "@expo/vector-icons";

const TripData = ({tripData, travelBy}) => {
    return (
       <View top={'65%'} zIndex={2}   >
              <Stack space={4} alignItems={'center'} >
              
                    <Box bg={'#fff'} p={4} rounded={'lg'} shadow={3} w={'90%'} >
                        <Text fontSize={'lg'} fontWeight={'bold'} >Trip 1</Text>
                        <Text fontSize={'sm'} color={'gray.500'} >Desc</Text>
                        </Box>
                        <HStack space={4} alignItems={'center'} zIndex={1} >
                        <Box bg={'#fff'} p={4} rounded={'lg'} shadow={3}  >
                        <Text fontSize={'lg'} fontWeight={'bold'} >Cancel Trip</Text>
                        <MaterialIcons name="cancel" size={24} color="black" />
                        </Box>
                        </HStack>
                        </Stack>
            </View>
    )
    }
export default TripData;