/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
// Home screen

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Picker
  // Switch
} from 'react-native';
import {
  AsyncStorage
} from "@react-native-community/async-storage";
import TableElem from './components/TableElem.js';
import {
  BarChart
} from "react-native-chart-kit";
import {
  // BarChart,
  LineChart,
  Grid,
  YAxis,
  XAxis
} from "react-native-svg-charts"
import {Switch} from 'react-native-switch';
import {Table, Row, Rows} from "react-native-table-component";
import * as scale from "d3-scale";
import {Circle} from "react-native-svg";

const caches = [null,null,null]; // Global varaiable for caching
class DataViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCache:0,
      optionIdMap:["1000000001","1000000002"],
      optionIdElems:null,
      budget:0,
      isAdvance:false,
      dataHead:['Option Id','Amount','Audience Reached'],
      dataBody:[],
      tableRowElems:null,
    //   barDataAmount:[{
    //     value: 50,
    //     label: 'One',
    // }],
    //   barDataAudience:[{
    //     value: 50,
    //     label: 'One',
    // },],
      barData:[{
        optionId:1,
        amount:0,
        audienceReached:0
      },{
        optionId:2,
        amount:0,
        audienceReached:0
      }],
      barLabels:[],
      barData:[],
      barAmount:[],
      barAudience:[],
      msgState:"",
      msgBoxConfig:{
        currentBorderColor:"#777777",
        currentTextColor:"#777777",
        currentBgColor:"#dddddd",
        successBorderColor:"#00660e",
        successTextColor:"#003d08",
        successBgColor:"#99ffcc",
        failedBorderColor:"#870022",
        failedTextColor:"#470012",
        failedBgColor:"#ff99cc",
      },
    }
  }
  componentDidMount() {
    this.setState({
      optionIdElems:this.displayOptionIds()
    });
    // console.log(this.state);
    // console.log(this.state.barDataAudience[0].label);
  }
  addOptionId() {
    var arrMap = this.state.optionIdMap;
    arrMap.push('');
    // console.log(arrMap);
    this.setState({
      optionIdMap:arrMap,
      optionIdElems:this.displayOptionIds()
    });
  }
  removeOptionId(id) {
    var arrMap = this.state.optionIdMap;
    arrMap.splice(id,1);
    this.setState({
      optionIdMap:arrMap,
      optionIdElems:this.displayOptionIds()
    });
  }
  updateOptionId(id,text) {
    var arrMap = this.state.optionIdMap;
    arrMap[id] = text;
    this.setState({
      optionIdMap:arrMap,
      optionIdElems:this.displayOptionIds()
    });
  }
  computeResult() {
    /*
    
    Sample url
    http://localhost:3000/basic/result?optionIds=9999999991,9999999992&budget=132934

    */
   const DEBUG = false;
    let host = "http://10.0.2.2:3000";
    if (DEBUG) {
      host = "http://10.0.2.2:3000"
    } else {
      host = "http://jibaboom-optimisticdevelopers.herokuapp.com"
    }
   var url = `${host}/${this.state.isAdvance?'advance':'basic'}/result?optionIds=${this.state.optionIdMap.toString()}&budget=${this.state.budget}`;
   console.log("URL :",url);
    return fetch(url,{method:"GET"})
    .then(res=>res.json())
    .then(data=>{
      this.setState({
        dataBody:[],
        barData:[],
        barLabels:[],
        barData:[],
        barAmount:[],
        barAudience:[],
      })
      var result = data.result;
      console.log(result);
      let insertArr = []
      ,barAmountArr = []
      ,barAudienceArr = []
      ,barLabelArr = []
      ,barDataAmountArr = []
      ,barDataAudienceArr = []
      ,barDataArr = [];
      barDataArr = result;
      result.forEach(function(data){
        insertArr.push([data.optionId,data.amount,Math.round(data.audienceReached*100)/100]);
        barDataAmountArr.push({value:data.amount,label:data.optionId});
        barDataAudienceArr.push({value:Math.round(data.audienceReached*100)/100,label:data.optionId});
        // console.log("Array: ",barDataAmountArr);
        barLabelArr.push(parseInt(data.optionId));
        barAmountArr.push(data.amount);
        barAudienceArr.push(Math.round(data.audienceReached*100)/100);
      });
      this.setState({
        dataBody:insertArr,
        barData:barDataArr,
        barDataAmount:barDataAmountArr,
        barDataAudience:barDataAudienceArr,
        barLabels:barLabelArr,
        barAmount:barAmountArr,
        barAudience:barAudienceArr,
        msgState:"Executed Sucessfully!",
        msgBoxConfig:{
          currentBorderColor:this.state.msgBoxConfig.successBorderColor,
          currentTextColor:this.state.msgBoxConfig.successTextColor,
          currentBgColor:this.state.msgBoxConfig.successBgColor,
          successBorderColor:"#00660e",
          successTextColor:"#003d08",
          successBgColor:"#99ffcc",
          failedBorderColor:"#870022",
          failedTextColor:"#470012",
          failedBgColor:"#ff99cc",
        }
      });
      this.addCache();
    })
    .catch((function(err){
      console.error(err.message);
      this.setState({
        msgState:"Sorry, there is an error in the server :( .",
        msgBoxConfig:{
          currentBorderColor:this.state.msgBoxConfig.failedBorderColor,
          currentTextColor:this.state.msgBoxConfig.failedTextColor,
          currentBgColor:this.state.msgBoxConfig.failedBgColor,
          successBorderColor:"#00660e",
          successTextColor:"#003d08",
          successBgColor:"#99ffcc",
          failedBorderColor:"#870022",
          failedTextColor:"#470012",
          failedBgColor:"#ff99cc",
        }
      });
      throw err;
    }));
  }
  renderRows() {
    return this.state.tableRowElems.map((row,id)=>{
      
    });
  }
  displayOptionIds() {
    
    return this.state.optionIdMap.map((optionId,id)=>{
      return (
        <View style={styles.optionIdCell}>
        <TextInput onChangeText={(text)=>{
          // console.log(id,text);
          this.updateOptionId(id,text);
        }} value={optionId} style={[styles.textArea,{flex:4}]} keyboardType="numeric" />
        <TouchableOpacity onPress={()=>{
          this.removeOptionId(id)
        }} style={[styles.deleteBtn,{flex:2}]}>
            <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
      )
    });
  }
  // componentDidMount() {
  //   // this.displayOptionIds();
  // }
  checkArrayString(arr) {
    for (let i = 0;i<arr.length;i++) {
      if (arr[i]=='') {
        return false;
      }
    }
    return true;
  }
  async updateCaches() {
    try {
      var storageVal = await AsyncStorage.getItem("cacheInfo")
      .then((res)=>{
        if (storageVal.length!=0) {
          AsyncStorage.setItem("cacheInfo",storageVal)
          .then((res)=>{
            this.loadCache();
          })
          .catch((err)=>{
            console.log(err.message);
          });
        }
      })
      .catch((err)=>{
        console.error(err.message);
      });
    } catch (err) {
      console.error("Error message: ",err.message);
    }
  }
  async addCache() {
    caches.unshift(this.state);
    caches.pop();
    // console.log(caches);
    AsyncStorage.setItem("cacheInfo",caches)
    .then((res)=>{
      // console.log(res);
      console.log("Added cache!");
    })
    .catch((err)=>{
      console.error(err);
    });
  }
  async loadCache(cacheNum) {
    this.setState(caches[cacheNum]);
    this.setState({
      selectedCache:cacheNum
    })
  }
    render() {
      const data = [4,2,3,10,3,-5,3,4,8] // Test data
      return (
        <ScrollView style={styles.body}>


          <View>
            <Text style={styles.filterText}>Retrieve Previous Results:</Text>
            <Picker selectedValue={this.state.selectedCache}
            onValueChange={selectedCache=>{
              this.setState({selectedCache});
              this.loadCache(selectedCache);
            }}
            >
              <Picker.Item enabled={caches[0]==null?false:true} label="First" value={0} />
              <Picker.Item enabled={caches[1]==null?false:true} label="Second" value={1} />
              <Picker.Item enabled={caches[2]==null?false:true} label="Third" value={2} />
            </Picker>
          </View>
          <View>
            
          </View>

          {/* Computation Option */}

          <View style={styles.container}>
            <Text style={styles.filterText}>Computation Option:</Text>
              <Switch
              value={this.state.isAdvance}
              onPress={()=>{
                this.setState({
                  isAdvance:!this.state.isAdvance
                })
              }}
              onValueChange={val=>console.log(val)}
              disabled={false}
              activeText={'Advanced'}
              inActiveText={'Basic'}
              circleSize={60}
              circleBorderWidth={2}
              backgroundActive={'#264653'}
              backgroundInactive={'#2a9d8f'}
              circleActiveColor={'#91ccb8'}
              circleInActiveColor={'#91ccb8'}
              changeValueImmediately={true}
              activeTextStyle={{fontSize:14}}
              inactiveTextStyle={{fontSize:20}}
              // outerCircleStyle={{width:200}}
              switchLeftPx={8}
              switchRightPx={8}
              switchWidthMultiplier={2}
              style={
                {
                  width:300
                }
              }
              />
            <Text style={styles.filterText}>Option Ids:</Text>

              {/* Option Id List */}

            <View>
              {/* The ones below are the demo cells */}

              {/* <View style={styles.optionIdCell}>
                  <TextInput style={[styles.textArea,{flex:4}]} keyboardType="numeric" />
                  <TouchableOpacity style={[styles.deleteBtn,{flex:2}]}>
                      <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
              </View> */}
              {/* <View style={styles.optionIdCell}>
                  <TextInput style={[styles.textArea,{flex:4}]} keyboardType="numeric" />
                  <TouchableOpacity style={[styles.deleteBtn,{flex:2}]}>
                      <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
              </View> */}
              {this.state.optionIdElems}
            </View>

              {/* Add New Option Id */}

            <TouchableOpacity onPress={()=>{this.addOptionId()}} style={[styles.addBtn]}>
                <Text style={styles.addBtnText}>Add New Option Id</Text>
            </TouchableOpacity>

              {/* Budget */}

            <Text style={styles.filterText}>Budget</Text>
            <View>
            <TextInput value={this.state.budget.toString()} onChangeText={(budget)=>{
              this.setState({budget})
            }} style={[styles.textArea]} keyboardType="numeric" />
            </View>
            <View style={{flexDirection:"row",display:"flex"}}>
            </View>

            {/* Compute Button */}

            <TouchableOpacity onPress={()=>{
              if (this.state.optionIdMap.length>0 && this.checkArrayString(this.state.optionIdMap)) {
                this.computeResult();
              } else {
                this.setState({
                  msgState:"Please enter a valid option id",
                  msgBoxConfig:{
                    currentBorderColor:this.state.msgBoxConfig.failedBorderColor,
                    currentTextColor:this.state.msgBoxConfig.failedTextColor,
                    currentBgColor:this.state.msgBoxConfig.failedBgColor,
                    successBorderColor:"#00660e",
                    successTextColor:"#003d08",
                    successBgColor:"#99ffcc",
                    failedBorderColor:"#870022",
                    failedTextColor:"#470012",
                    failedBgColor:"#ff99cc",
                  }
                });
              }
            }} style={styles.button}>
              <Text style={styles.buttonText}>Compute Result!</Text>
            </TouchableOpacity>

            {/* Message Box */}

            <View style={[styles.msgState,{
              borderColor:this.state.msgBoxConfig.currentBorderColor,
              backgroundColor:this.state.msgBoxConfig.currentBgColor,
              }]}>
              <Text style={[styles.msgStateText
              ,{
                color:this.state.msgBoxConfig.currentTextColor
              }]}>{this.state.msgState}</Text>
            </View>
            <View style={styles.horizontalLine}/>
            <Text style={styles.filterText}>Result Table</Text>

              {/* Result Table */}

            <View>
              <Table>
                <Row data={this.state.dataHead} style={tableStyles.tableHead} textStyle={tableStyles.tableHeadText}></Row>
                <Rows data={this.state.dataBody} style={tableStyles.tableBody} textStyle={tableStyles.tableBodyText}></Rows>
              </Table>
            </View>
            <Text style={styles.filterText}>Amount</Text>


              {/* Charts */}

              {/* Bar Chart (Amount) */}

            <BarChart
            chartConfig={{
              backgroundGradientFrom: "#111111",
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: "#111111",
              backgroundGradientToOpacity: 1,
              color: (opacity = 1) => `rgba(100,127,255, ${opacity})`,
              strokeWidth: 2, // optional, default 3
              barPercentage: 1,
              useShadowColorFromDataset: false // optional
            }}
            data={
              {
                labels:this.state.barLabels,
                datasets:[
                  {
                    data:this.state.barAmount
                  }
                ]
              }
            }
            width={Dimensions.get('window').width-20}
            height={220}
            showValuesOnTopOfBars={true}
            fromZero={true}
            />

            {/* Line Chart (Amount) */}

            <View style={{height:350,padding:20,flexDirection:"row"}}>
              <YAxis
              data = {this.state.barAmount}
              style={{marginBottom:20}}
              contentInset={lineGraphStyles.vertiInset}
              svg={lineGraphStyles.axes}
              />
              <View style={{flex:1,marginLeft:12}}>
                <LineChart
                  style={{ flex:1 }}
                  data = {this.state.barAmount}
                  contentInset={lineGraphStyles.vertiInset}
                  svg={{ stroke: 'rgb(2, 101, 230)',strokeWidth:3 }}
                >
                  <Grid/>
                </LineChart>
                <XAxis
                style={{marginHorizontal:-12,height:20}}
                data = {this.state.barLabels}
                formatLabel={(value,index)=>this.state.barLabels[index]}
                contentInset={lineGraphStyles.horiInset}
                svg={lineGraphStyles.axes}
                />
              </View>
            </View>
            <Text style={styles.filterText}>Audience Reached</Text>

            {/* Bar Chart (Audience Reached) */}
            
            <BarChart
            chartConfig={{
              backgroundGradientFrom: "#111111",
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: "#111111",
              backgroundGradientToOpacity: 1,
              color: (opacity = 1) => `rgba(255,100,100, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 1,
              useShadowColorFromDataset: false ,
            }}
            style={{
              fontSize:20,
            }}
            data={
              {
                labels:this.state.barLabels,
                datasets:[
                  {
                    data:this.state.barAudience
                  }
                ]
              }
            }
            width={Dimensions.get('window').width-20}
            height={220}
            showValuesOnTopOfBars={true}
            fromZero={true}
            />

            {/* Line Chart (Audience Reached) */}
            
            <View style={{height:350,padding:20,flexDirection:"row"}}>
              <YAxis
              data = {this.state.barAudience}
              style={{marginBottom:20}}
              contentInset={lineGraphStyles.vertiInset}
              svg={lineGraphStyles.axes}
              />
              <View style={{flex:1,marginLeft:12}}>
                <LineChart
                  style={{ flex:1 }}
                  data = {this.state.barAudience}
                  contentInset={lineGraphStyles.vertiInset}
                  svg={{ stroke: 'rgb(230, 2, 67)',strokeWidth:3 }}
                >
                  <Grid/>
                </LineChart>
                <XAxis
                style={{marginHorizontal:-12,height:20}}
                data = {this.state.barLabels}
                formatLabel={(value,index)=>this.state.barLabels[index]}
                contentInset={lineGraphStyles.horiInset}
                svg={lineGraphStyles.axes}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )
    }
}

// Styles specifically for line graphs
const lineGraphStyles = {
  axes:{
    fontSize:12,
    fill:"black",
  },
  horiInset:{
    left:42,
    right:42
  },
  vertiInset:{
    top:12,
    bottom:12
  },
}

// General App Styles
const styles = StyleSheet.create({
  msgState:{
    backgroundColor:"#dddddd",
    margin:8,
    padding:8,
    borderColor:"#777777",
    borderWidth:2,
    borderRadius:0
  },
  msgStateText:{
    textAlign:"center",
    color:"black",
    fontSize:20,
  },
  navHeader:{
    backgroundColor:"navy",
    width:"100%",
    padding:10,
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-evenly",
  },
  backBtn:{
    color:"white",
    fontSize:20
  },
  navText:{
    color:"white",
    fontSize:30,
    textAlign:"center"
  },
  container:{
    display:"flex",
    padding:10
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
    // alignItems:"",
    backgroundColor:"#b3eaff",
  },
  filterText:{
    textAlign:'left',
    fontSize:30,
  },
  button:{
    justifyContent:"center",
    backgroundColor:"#079fd9",
    width:300,
    margin:"auto",
    height:50,
    borderRadius:50,
    alignSelf:"center",
    // flex:2
  },
  buttonText:{
    textAlign:"center",
    color:"white",
    fontSize:30,
  },
  image:{
    width:300,
    height:300,
    resizeMode: "contain",
  },
  introSentence:{
    fontSize:18,
    textAlign:"center"
  },
  horizontalLine:{
    borderBottomColor:"black",
    width:250,
    borderWidth:StyleSheet.hairlineWidth,
    marginBottom:20,
    marginTop:20,
    alignSelf:"center"
  },
  textArea:{
    backgroundColor:"white",
    borderColor:"black",
    borderRadius:10,
    borderWidth:2,
    marginVertical:10,
    marginHorizontal:4,
    fontSize:18,
  },
  optionIdCell:{
    display:"flex",
    flexDirection:"row",
  },
  deleteBtn:{
    backgroundColor:"#ee1100",
    justifyContent:"center",
    textAlign:"center",
    borderRadius:10,
    //borderWidth:2,
    marginVertical:10,
    marginHorizontal:4,
    textAlign:"center"
  },
  deleteBtnText:{
    textAlign:"center",
    fontSize:20,
    color:"white",
  },
  addBtn:{
    backgroundColor:"#11aa00",
    justifyContent:"center",
    textAlign:"center",
    borderRadius:10,
    marginVertical:10,
    marginHorizontal:4,
    paddingVertical:10,
    textAlign:"center"
  },
  addBtnText:{
    textAlign:"center",
    fontSize:20,
    color:"white",
  }
});

// Table Styles
const tableStyles = StyleSheet.create({
  tableHead:{
    backgroundColor:"navy",
    paddingVertical:10
  },
  tableHeadText:{
    color:"white",
    fontSize:20,
    textAlign:"center",
  },
  tableBody:{
    backgroundColor:"white",
    borderColor:"black",
    borderWidth:2,
    paddingVertical:10
  },
  tableBodyText:{
    color:"black",
    fontSize:20,
    textAlign:"center",
  }
});

export default DataViewer;
