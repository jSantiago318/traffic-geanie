import { StyleSheet } from 'react-native';

const Colors = {
  orange: '#f57c00',
  blue: '#039be5',
  black: '#222222',
  white: '#ffffff',
  mediumGray: '#6e6869',
  red: '#fc5c65',
  highlihgted: '#039be5',
  highlihgtedText: '#ffffff',
  textMain: '#222222',
  lightGray: '#f8f4f4',
  secondary: '#8CCCF4',
  schText: '#9C9C9C',
  predictionText: '#94EC94',
  ticketBackground: '#ffff',
  backgroundColor: '#ffff',
  MapButton:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#ffff',
    fontSize: 16,
    margin: 2,
    padding: 2,
  },
};


const darkMode = {
  orange: '#f57c00',
  blue: '#039be5',
  black: '#222222',
  white: '#ffffff',
  mediumGray: '#6e6869',
  red: '#fc5c65',
  highlihgted: '#039be5',
  highlihgtedText: '#ffffff',
  textMain: '#222222',
  lightGray: '#f8f4f4',
  secondary: '#8CCCF4',
  schText: '#9C9C9C',
  predictionText: '#94EC94',
  ticketBackground: '#ffff',
  backgroundColor: '#293241',
  card: '#3d5a80',
  textDisabled: '#ee6c4d',
  text: '#98c1d9',
  subText: '#e0fbfc', 
  icon:{
    color: '#98c1d9',
  },
  Button:{
    backgroundColor: '#3d5a80',
    width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  Modal:{
    backgroundColor: '#293241',
    width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  horizontalBtn:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#3d5a80',
    margin: 2,
    // padding: 2,
  },
  MapButton:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#3d5a80',
    fontSize: 16,
    margin: 2,
    padding: 2,
  },
  Card:{
    backgroundColor: '#3d5a80',
    width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  Select:{
    backgroundColor: '#3d5a80',
    width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    margin: 5,
    
  },
  CardView:{
    // flex: 1,
    width:'90%',
    justifyContent: 'center',
    backgroundColor: '#3d5a80',
    margin: 10,
    borderRadius: 10,
    padding: 5,
  },
  settingBtn:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#3d5a80',
    marginRight: 10,
    with: '50%',
  },
  CarouselView:{
    flex: 1,
    width:'90%',
    justifyContent: 'center',
    backgroundColor: '#293241',
    margin: 10,                                             
    borderRadius: 10,
    padding: 10,
  },
  
  TextHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#98c1d9',
  }, 
  subtleBtn:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#293241'
    
  }, 
  transparentBtn:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderColor: '#98c1d9',
  },


  outlineBtn:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: '#98c1d9',
   
  },
  View:{
    flex: 1,
      width:'100%',
      // justifyContent: 'center',
      padding: 5,
      alignItems: 'center',
      backgroundColor: '#293241',
  }, 
  TicketView:{
    flex: 1,
      width:'100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#293241',
      color: '#98c1d9',
  }, 
  Text :{
    
    fontSize: 14,
    fontWeight: "normal",
    color: '#FBFCFF',
  }, 
  disabled:{
    backgroundColor: '#ee6c4d',
    color: '#293241',
  }, 
  enabled:{
    backgroundColor: '#94EC99',
    color: '#293241',
  },
  carousel:{
    position: "absolute",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    bottom: "10%",
    left: 0,
    width: "100%",
    backgroundColor: "#293241",
  },

Title:{
    fontSize: 16,
    fontWeight: "bold",
    margin: 2,
    padding: 2,
    color: '#98c1d9',
    
} , 
routeList:{
  width: '90%',
  borderRadius: 10,
  padding: 5,
  margin: 5,
  backgroundColor: '#3d5a80',
  height: '40%',
}, 
LoginBtn:{
  alignItems : 'center',
  justifyContent: 'center',
  borderRadius: 10,
  width: '50%',
  height: 50,
  backgroundColor: '#3d5a80',


} ,Map:{
  flex: 1,
      justifyContent: "center",
      alignItems: "center",
      ...StyleSheet.absoluteFillObject,
  
},loginBtn:{
  alignItems : 'center',
  justifyContent: 'center',
  borderRadius: 10,
  width: '50%',
  height: 50,
  backgroundColor: '#98c1d9',
},

  
};


const lightMode = {
  Button:{
    backgroundColor: '#e0fbfc',
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
      padding: 5,

      backgroundColor: '#e0fbfc',
      width:'100%',
  },
  Input:{
    backgroundColor: '#e0fbfc',
    width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    
  },
  card: '#3d5a80',

  subtleBtn:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#e0fbfc'
    
  }, 
  horizontalBtn:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#3d5a80',
    marginRight: 2,
    paddingRigth: 2,
  },
  Select:{
    backgroundColor: '#e0fbfc',
    width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    
  },
  loginBtn:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '50%',
    height: 50,
    backgroundColor: '#3d5a80',
    
  },TicketView:{
    flex: 1,
      width:'100%',
      justifyContent: 'center',
      alignItems: 'center',
  }, 
  btnText:{
    fontSize: 14,
    fontWeight: "normal",
    color: '#e0fbfc',
    
  },
  settingBtn:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#98c1d9',
    marginRight: 10,
    with: '50%',
  },
  routeList:{
  width: '90%',
  height: 'auto',
  borderRadius: 10,
  padding: 10,
  margin: 10,
  backgroundColor: '#3d5a80',
  
},
  Title:{
    fontSize: 16,
    fontWeight: "bold",
    margin: 2,
    padding: 2,
    color: '#293241',
    
  },
  LoginBtn:{
    alignItems : 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '50%',
    height: 50,
    backgroundColor: '#3d5a80',
    
  },
  CarouselView:{
    flex: 1,
    width:'90%',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    margin: 10,                                             
    borderRadius: 10,
    padding: 10,
  },
  Text:{
    fontSize: 14,
    fontWeight: "normal",
    color: '#293241',

  }, carousel:{
    position: "absolute",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    bottom: "10%",
    left: 0,
    width: "80%",
    backgroundColor: "#fff",
  }, Map:{
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
  orange: '#f57c00',
  blue: '#039be5',
  black: '#222222',
  white: '#ffffff',
  mediumGray: '#6e6869',
  red: '#fc5c65',

  highlihgted: '#039be5',
  highlihgtedText: '#ffffff',
  textMain: '#222222',
  lightGray: '#f8f4f4',
  secondary: '#8CCCF4',

  schText: '#9C9C9C',
  predictionText: '#94EC94',
  ticketBackground: '#ffff',
  backgroundColor: '#ffff',
};


export {Colors, darkMode, lightMode}
