import {
  Button,
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  StyleService,
  Text,
} from '@ui-kitten/components'
import React, { useEffect, useState } from 'react'

import { View } from 'react-native'
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
    return (
    <ListItem
      title={`${item.uniqueId} - ${item.name}` }
      description={new Date(`${item.lastUpdate}`).toLocaleString('en-US', {timeZone: 'America/New_York'} )}
      accessoryLeft={renderItemAccessory}
      // accessoryRight={renderItemAccessory}
      style={styles.containerListItem}
    />
  )};
  return (
    <>
    <Text style={styles.title}>
      Bus Status
    </Text>
    <View style={styles.container}>
        <List
          style={styles.containerList}
          data={data}
          renderItem={renderItem} />
      </View>
      </> 
  )
}

export default DataFetcher

const styles = StyleService.create({
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
