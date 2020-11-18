/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image
} from 'react-native';


class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        
      }
    }
      render() {
        return (
          <View style={styles.body}>
            <View style={styles.header}>
              <Text style={styles.headerText}>JiBaBOOM!</Text>
            </View>
            <View style={styles.body}>
              <View style={{marginBottom:20}}>
                <Image style={styles.image} source={require("./assets/img/algo.png")}/>
                <Text style={styles.introSentence}>Select your best advert options while you're away!</Text>
              </View>
              <View style={styles.horizontalLine}/>
              <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('DataViewer')}>
                <Text style={styles.buttonText}>Go to data viewer!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resultButton} onPress={() => this.props.navigation.navigate('ResultViewer')}>
                <Text style={styles.buttonText}>Go to result viewer!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }
  }
  
  const styles = StyleSheet.create({
    container:{
      display:"flex",
    },
    header:{
      justifyContent:"center",
      flex:2,
    },
    headerText: {
      fontSize:60,
      fontWeight:"800",
      textAlign:"center"
    },
    body:{
      flex:4,
      alignItems:"center",
      backgroundColor:"#b3eaff"
    },
    button:{
      justifyContent:"center",
      backgroundColor:"#079fd9",
      width:300,
      margin:"auto",
      height:50,
      borderRadius:50,
      // flex:2
    },
    resultButton:{
        justifyContent:"center",
        backgroundColor:"#079fd9",
        width:300,
        margin:"auto",
        height:50,
        marginTop:20,
        borderRadius:50,
        // flex:2
    },
    buttonText:{
      textAlign:"center",
      color:"white",
      fontSize:30,
    },
    image:{
      width:120,
      height:150,
      resizeMode: "contain",
      alignSelf:"center"
    },
    introSentence:{
      fontSize:20,
      textAlign:"center",
      paddingHorizontal:50,
    },
    horizontalLine:{
      borderBottomColor:"black",
      width:200,
      borderWidth:StyleSheet.hairlineWidth,
      marginBottom:20,
    }
  });

export default HomeScreen;
