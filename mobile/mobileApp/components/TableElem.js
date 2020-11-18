/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
// Home screen

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
import {Table, Row, Rows} from 'react-native-table-component';


class TableElem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead:['Company Id','Option Id','Cost','Audience Count'],
      tableData:[
        // ['Test',1,2.3,4]
      ]
    }
  }
  componentWillMount() {
    this.fillTestData(20);
  }
  fillTestData(amount) {
    for (let i = 0;i<amount;i++) {
      var rn = Math.floor(Math.random()*100)
      this.state.tableData.push([rn,rn,rn,rn])
    }
  }
  render() {
    return (
      <View>
        <Table>
          <Row textStyle={styles.tableHeadText} style={styles.tableHead} data={this.state.tableHead}></Row>
          <Rows textStyle={styles.tableBodyText} style={styles.tableBody} data={this.state.tableData}></Rows>
        </Table>
      </View>
    )
  }
};

const styles = StyleSheet.create({
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
})

export default TableElem;
