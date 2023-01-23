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
import React, { useState, useEffect } from 'react'

function DataFetcher() {
  const [data, setData] = useState([])

  if (data.length === 0) {
    fetch('http://143.198.119.7:8020/online')
      .then((response) => response.json())
      .then((data) => {
        setData(data)
        console.log(data)
      })
  }

  const renderItem = ({ item, index }) =>{ 
    const renderItemAccessory = (props) => (
        <Button size='tiny'>{item.status}</Button>
      );
    return (
    <ListItem
      title={`${item.uniqueId}`}
      description={`${item.lastUpdate}`}
    //   accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
    />
  )};
  return (
    <>
      <Text style={styles.title}>Online Bus</Text>
{/* 
      {data.map((item, index) => (
        <>
          <Text key={index}>{item.id}</Text>
          <Text key={index}>{item.uniqueId}</Text>
          <Text key={index}>{item.status}</Text>
          <Text>{item.lastUpdate}</Text>
        </>
      ))} */}
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
    maxHeight: '50%',
    marginTop: 10,
    minWidth: '90%',
  },
  button: {
    marginVertical: 4,
  },
  
})
