import { StyleSheet } from 'react-native';

const colorsLight1 = {
  textColor : '#040316',
  backgroundColor : '#fbfbfe',
  primaryColor : '#2f27ce',
  secondaryColor : '#dddbff',
  accentColor : '#443dff',
}
const colorsLight = {
  textColor : '#040316',
  backgroundColor : '#eef4fc',
  primaryColor : '#5ABCFC',
  secondaryColor : '#CCDCF4',
  accentColor : '#215fab',
}
// const colorsDark = {
//   textColor: '#eae9fc',
//   backgroundColor: '#010104',
//   primaryColor: '#3a31d8',
//   secondaryColor: '#020024',
//   accentColor: '#0600c2',
// }
const colorsDark = {
  textColor : '#FFFBED',
  backgroundColor : '#040316',
  primaryColor : '#C8D5B9',
  secondaryColor : '#8FC0A9',
  accentColor : '#443dff',
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
        backgroundColor: colorsDark.backgroundColor,
        borderRadius: 8,
        flexDirection: 'row',
        padding: 12,
        marginVertical: 12,
        width: '90%',
        borderWidth: 1,
        borderColor: 'grey'
      
  },
  Button:{
    backgroundColor: colorsDark.accentColor,
    // width: '50%',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  Card:{
    backgroundColor: colorsDark.secondaryColor,
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
      backgroundColor: colorsDark.backgroundColor,
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
    color: colorsDark.textColor,
    
  },  
  Text:{
    fontSize: 14,
    fontWeight: "normal",
    color: '#fff',
    padding: 2,

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
    backgroundColor: colorsLight.accentColor,
    // width: '50%',
    justifyContent: 'center',
    alignItems: 'center',

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
      backgroundColor: colorsLight.secondaryColor,
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
    padding: 2,

  },  Map:{
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
};


export { darkMode, lightMode, colorsLight, colorsDark}
