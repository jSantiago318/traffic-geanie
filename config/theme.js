import { StyleSheet } from 'react-native';
const colorsLight = {
  textColor : '#130916',
  backgroundColor : '#fdf8f8',
  primaryColor : '#27491d',
  secondaryColor : '#d3eee7',
  accentColor : '#668b5b',
}
const colorsDark = {
  textColor: '#fdf8f8',
  backgroundColor: '#130916',
  primaryColor: '#27491d',
  secondaryColor: '#0b1d19',
  accentColor: '#b8cdb2',
}
const darkMode ={
  ListItem:{
    // backgroundColor: colorsLight.backgroundColor,
    margin: 2,
    padding: 2,
    borderRadius: 5,
    width: '90%',
    justifyContent: 'space-between',
  },
StopText:{
  fontSize: 16,
  fontWeight: "normal",
},
  ModalBody:{
    width: '80%',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    borderRadius: 10,
    padding: 2,
    margin: 2,
  },
  TextInput:{
        backgroundColor: colorsLight.backgroundColor,
        borderRadius: 8,
        flexDirection: 'row',
        padding: 12,
        marginVertical: 12,
        width: '90%',
        borderWidth: 1,
        borderColor: 'grey'
      
  },
  Button:{
    backgroundColor: '#98c1d9',
    width: '50%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  Card:{
    backgroundColor: '#e0fbfc',
    width: '90%',
    justifyContent: 'center',

    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  View:{
    flex: 1,
      alignItems: 'center',
      padding: 2,
      backgroundColor: colorsLight.backgroundColor,
      width:'100%',
      
  },
  Input:{
    borderRadius: 8,
    padding: 12,
    margin: 2,
    marginVertical: 8,
    width: '90%',
   },
     
  Select:{
    backgroundColor: '#e0fbfc',
    width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    
  },  
  routeList:{
  width: '90%',
  // height: '40%',
  borderRadius: 10,
  padding: 10,
  margin: 10,
  backgroundColor: '#3d5a80',
  
},
Heading:{
  fontSize: 24,
  fontWeight: "bold",
  marginTop: '1%',
  marginBottom: '1%',
  padding: 2,
  color: 'black',
},
  Title:{
    fontSize: 20,
    fontWeight: "bold",
    marginTop: '1%',
    marginBottom: '1%',
    padding: 2,
    color: colorsLight.textColor,
    
  },  
  Text:{
    fontSize: 14,
    fontWeight: "normal",
    color: '#293241',

  },  Map:{
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
};


const lightMode = {
  ListItem:{
    // backgroundColor: colorsLight.backgroundColor,
    margin: 2,
    padding: 2,
    // borderRadius: 5,
    // width: '90%',
    // justifyContent: 'space-between',
  },
StopText:{
  fontSize: 16,
  fontWeight: "normal",
},
  ModalBody:{
    width: '80%',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    borderRadius: 10,
    padding: 2,
    margin: 2,
  },
  TextInput:{
        backgroundColor: colorsLight.backgroundColor,
        borderRadius: 8,
        flexDirection: 'row',
        padding: 12,
        marginVertical: 12,
        width: '90%',
        borderWidth: 1,
        borderColor: 'grey'
      
  },
  Button:{
    backgroundColor: '#98c1d9',
    width: '50%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  Card:{
    backgroundColor: '#e0fbfc',
    width: '90%',
    justifyContent: 'center',

    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  View:{
    flex: 1,
      alignItems: 'center',
      padding: 2,
      backgroundColor: colorsLight.backgroundColor,
      width:'100%',
      
  },
  Input:{
    borderRadius: 8,
    padding: 12,
    margin: 2,
    marginVertical: 8,
    width: '90%',
   },
     
  Select:{
    backgroundColor: '#e0fbfc',
    width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    
  },  
  routeList:{
  width: '90%',
  // height: '40%',
  borderRadius: 10,
  padding: 5,
  margin: 5,
  //space between
  justifyContent: 'space-between',
  
  backgroundColor: colorsLight.secondaryColor,
  
},
Heading:{
  fontSize: 24,
  fontWeight: "bold",
  marginTop: '1%',
  marginBottom: '1%',
  padding: 2,
  color: 'black',
},
  Title:{
    fontSize: 20,
    fontWeight: "bold",
    marginTop: '1%',
    marginBottom: '1%',
    padding: 2,
    color: colorsLight.textColor,
    
  },  
  Text:{
    fontSize: 14,
    fontWeight: "normal",
    color: '#293241',

  },  Map:{
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
};


export { darkMode, lightMode, colorsLight, colorsDark}
