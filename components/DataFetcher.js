import { HStack, Icon, ScrollView, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { getOnline } from './URLFetcher'

function DataFetcher() {
  const [data, setData] = useState([])

  if (data.length === 0) {
    setData(getOnline())
  }

  const renderItem = ({ item, index }) =>{ 
    const renderItemAccessory = (props) => {
      let colors = ['#048050', '#FCAC34', '#B40404']
      let icons = ['arrow-circle-right-outline', 'alert-circle-outline', 'arrow-circle-right-outline']
      let i = 0
      if (item.status === 'online') {
        i = 0
      } else if (item.status === 'offline') {
        i = 2
      } else {
        i = 1
      }
      return(
    <Icon {...props} name={icons[i]} fill={colors[i]}  
        style={{width: 20, height: 20, tintColor: colors[i] }}
        />
      )};
      const showDate = (date) => {
        return new Date(date).toLocaleString('en-US', {timeZone: 'America/New_York'} )}
    return (
    <HStack space={2} alignItems="center" style={styles.containerListItem} >
      <Icon
        size="sm"
        as={<MaterialCommunityIcons name="bus" />}
        color="muted.400"
      />
      <Text fontSize="sm" color="muted.700" fontWeight={400}>
      {item.uniqueId} - {item.name}
      </Text>
      <showDate date={item.lastUpdated} />
    </HStack>
  )};
  return (
    <>
    <Text style={styles.title}>
      Bus Status
    </Text>
    <View style={styles.container}>
    <ScrollView>

        <FlatList
          style={styles.containerList}
          data={data}
          renderItem={renderItem}
            keyextractor={(item, index) => index.toString()}
           />
    </ScrollView>
      </View>
      </> 
  )
}

export default DataFetcher

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    maxHeight: '90%',
    minWidth: '85%',
    backgroundColor: '#ddfff7',
    borderRadius: 15,
    padding: 10,
  },
  containerList: {
    backgroundColor: 'transparent',
  },
  containerListItem: {
    marginVertical: 4,
    backgroundColor: '#93e1d8',
    borderRadius: 15,
  },
  // fc7a57
  button: {
    marginVertical: 4,
  },
  
})
