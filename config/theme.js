import { StyleSheet } from 'react-native';

const Colors = {
  textLight: '#050505',
  backgroundLight: '#fafafa',
  primaryLight: '#49b649',
  secondaryLight: '#d8f8d3',
  accentLight: '#996666',
  textDark: '#000',
  primaryDark: '#49b649',
  backgroundDark: '#0d0202',
  secondaryDark: '#0c2c07',
  accentDark: '#996666',
};


const darkMode = {
  icon:{
    color: '#98c1d9',
  },
  Modal:{
    backgroundColor:Colors.backgroundDark,
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
  
 
  Select:{
    backgroundColor: Colors.secondaryDark,
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
    backgroundColor: Colors.primaryDark,
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
      padding: 5,
      alignItems: 'center',
      backgroundColor: Colors.backgroundDark,
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
    fontSize: 16,
    padding: 1,
    margin: 1,
    fontWeight: "normal",
    color: Colors.textDark,
  }, 
  disabled:{
    backgroundColor: Colors.accenDark,
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
    fontSize: 24,
    fontWeight: "bold",
    margin: 2,
    padding: 2,
    color: Colors.textDark,
    
} , 
routeList:{
  width: '90%',
  borderRadius: 10,
  padding: 5,
  margin: 5,
  maxHeight: '60%',
  backgroundColor: Colors.primaryDark,
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
  
},Button:{
  alignItems : 'center',
  justifyContent: 'center',
  borderRadius: 10,
  width: '50%',
  height: 50,
  backgroundColor: Colors.accentDark,
},

  
};


const lightMode = {
  
}


export {Colors, lightMode, darkMode}
