import {Center, SectionList, Text, View} from "native-base";

import React from "react";
import { getRoutes } from "../assets/gtfs/route";

const BusArrivalInformation = ({busArrivalInfo}) => {
    return (
        <View style={{
            top: '20%',
            position: 'absolute',
            width:'100%'
        }}>
           <Center h="80" w="100%">
      <SectionList maxW="300" w="100%" mb="4" sections={getRoutes()} keyExtractor={(item, index) => item + index} renderItem={({
      item
    }) => <Center py="4" bg={item.color}>
            {item.id}
          </Center>} renderSectionHeader={({
      section: {
        id
      }
    }) => <Center>
            <Heading fontSize="xl" mt="8" pb="4">
              {id}
            </Heading>
          </Center>} />
    </Center>
        </View>
    )
    }
export default BusArrivalInformation;