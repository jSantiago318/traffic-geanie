import {Button, Divider, Icon, Layout, StyleService, Text} from '@ui-kitten/components';
import { Camera, CameraType } from 'expo-camera';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { CameraIcon } from '../assets/icons';
import { useState } from 'react';

function CameraBtn() {

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
    return (
        <>

        {/* <Button accessoryRight={CameraIcon} style={style.button} >
            <Text> 
                Scan Bus
            </Text>
        </Button> */}
        </>
    )
}


export default CameraBtn

const style = StyleSheet.create({
    title: { 
        marginVertical: 4,
        fontSize: 24,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#00BFA5',
        borderColor: 'transparent',
        
    },
});
