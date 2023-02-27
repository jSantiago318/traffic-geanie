import { Button, FlatList, HStack } from 'native-base';
import { StyleSheet, View }from 'react-native';

import React from 'react';
import getRoute from '../assets/gtfs/route'
import  getTrips from '../assets/gtfs/trips';

const data = getRoute();

export const BusFetch = () => {
  const [selected , SetSelected] = React.useState(null);
  function openModal(selected) {
    setVisible(true);
    SetSelected(selected);
  }

  const renderItemIcon = (props) => (
    <Icon {...props} name='pin'/>
  );
  const [visible, setVisible] = React.useState(false);

 
  return (
    <View>
 <Modal
          animationType={"fade"}
          visible={visible}
          transparent={true} >
 
            <View style={styles.modal}>
 
              <Text style={styles.title}> Ticket: {selected}</Text>
 
        <Button style={styles.btn}
      size='tiny' onPressOut={
        () => setVisible(false)
      } > Cancel</Button>
            </View>
 
        </Modal>
    <FlatList
      style={styles.container}
      data={data}
      renderItem={<>
        <HStack space={2} alignItems="center"      onPress={() => openModal(item.description)}
 >
          <Icon name="bus" size="sm" />
          <Text style={styles.route}>{item.title}</Text>
          <Text style={styles.route}>{item.description}</Text>
          <Text style={styles.timePred}>12:50</Text>
        </HStack>

      </>}
      
    />
    </View>
  );
};

 export default BusFetch

const styles = StyleSheet.create({

  cardContainer: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },

  container: {
    minWidth: '100%',
    height: '30%',
    zIndex: -1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    }, 
    modal: {
      width: 300,
      height: 200,
      backgroundColor: '#00BFA5',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 7,
      borderWidth: 1,
      borderColor: 'red'
    },
    
});