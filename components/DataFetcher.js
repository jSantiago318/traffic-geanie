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

function DataFetcher() {
  const [data, setData] = useState([])

  if (data.length === 0) {
    fetch('http://143.198.119.7:8020/online')
      .then((response) => response.json())
      .then((data) => {
        setData(data)
      })
  }

  const renderItem = ({ item, index }) =>{ 
    const renderItemAccessory = (props) => {
      let colors = ['#048050', '#FCAC34', '#B40404']
      let i = 0
      if (item.status === 'online') {
        i = 0
      } else if (item.status === 'offline') {
        i = 2
      } else {
        i = 1
      }
      return(
        <Button size='small' style={{borderColor:'transparent', backgroundColor:colors[i]}} >{item.status}</Button>
      )};
    return (
    <ListItem
      title={`${item.uniqueId}`}
      description={new Date(`${item.lastUpdate}`).toLocaleString('en-US', {timeZone: 'America/New_York'} )}
    //   accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
    />
  )};
  return (
    <>
      <Text style={styles.title}>Active Bus</Text>
      <List
      style={styles.container}
      data={data}
      renderItem={renderItem}
    />
    </>
  )
}

export default DataFetcher

const styles = StyleService.create({
  title: {
    marginVertical: 4,
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    maxHeight: '40%',
    marginTop: 10,
    minWidth: '90%',
  },
  button: {
    marginVertical: 4,
  },
  
})
