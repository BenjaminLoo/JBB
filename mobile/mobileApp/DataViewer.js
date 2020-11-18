/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Picker,
} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';
import {Switch} from 'react-native-switch';

class DataViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyId: '',
      minCount: '',
      maxCount: '',
      minCost: '',
      maxCost: '',
      url: '',
      tableData: [],
      currentPages: [0, 1, 0],
      dataCount: 0,
      disableFirst: true,
      disablePrev: true,
      disableNext: true,
      disableLast: true,
      selectedValue: '5',
      totalPages: 0,
      msgState: '',
      msgBoxConfig: {
        currentBorderColor: '#777777',
        currentTextColor: '#777777',
        currentBgColor: '#dddddd',
        successBorderColor: '#00660e',
        successTextColor: '#003d08',
        successBgColor: '#99ffcc',
        failedBorderColor: '#870022',
        failedTextColor: '#470012',
        failedBgColor: '#ff99cc',
      },
      isAdvance:false,
    };
  }

  //DataTable shows the adverts in this table
  dataTable() {
    return (
      <View>
        <Table>
          <Row
            textStyle={styles.tableHeadText}
            style={styles.tableHead}
            data={['Option Id', 'Company Id', 'Audience Count', 'Cost']}></Row>
          <Rows
            textStyle={styles.tableBodyText}
            style={styles.tableBody}
            data={this.state.tableData}></Rows>
        </Table>
        <Text></Text>
      </View>
    );
  }

  //creates and stores url link and retrieves the data
  createQuery() {
    const DEBUG = false;
    let host = "https://10.0.2.2:3000";
    if (DEBUG) {
      host = "https://10.0.2.2:3000"
    } else {
      host = "https://jibaboom-optimisticdevelopers.herokuapp.com"
    }
    let url = `${host}/${this.state.isAdvance?'advance':'basic'}/data?companyId=${this.state.companyId}&minCost=${this.state.minCost}&maxCost=${this.state.maxCost}&minCount=${this.state.minCount}&maxCount=${this.state.maxCount}&pageSize=${this.state.selectedValue}&pageNum=${this.state.currentPages[1]}`;
    this.setState({
      url: `${host}/${this.state.isAdvance?'advance':'basic'}/data?companyId=${this.state.companyId}&minCost=${this.state.minCost}&maxCost=${this.state.maxCost}&minCount=${this.state.minCount}&maxCount=${this.state.maxCount}`,
    });
    var currentPagesArr = this.state.currentPages;
    currentPagesArr[1] = 1;
    currentPagesArr[0] = currentPagesArr[1] - 1;
    currentPagesArr[2] = currentPagesArr[1] + 1;
    this.setState({
      currentPage: currentPagesArr,
    });
    this.getData(url);
  }

  //calls the backend which then updates the datatable by calling dataTable()
  getData(url) {
    let dataArr = [];
    fetch(url, {method: 'GET'})
      .then((response) => response.json())
      .then(
        (data) => {
          data.result.forEach((advert) => {
            dataArr.push([
              advert.optionid,
              advert.companyid,
              advert.audiencecount,
              advert.cost,
            ]);
            this.setState({
              tableData: dataArr,
            });
          });
          this.setState({
            dataCount: parseFloat(data.count[0].count),
            totalPages: Math.ceil(
              parseFloat(data.count[0].count) /
              parseFloat(this.state.selectedValue),
            ),
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
          this.togglePaginationButtons();
        },
        (error) => {
          console.log(error);
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
        },
      );
    this.dataTable;
  }

  //PAGINATION

  //toggles the first/prev/next/last buttons
  togglePaginationButtons() {
    let previousPageNum = this.state.currentPages[0];
    let nextPageNum = this.state.currentPages[2];
    if (previousPageNum != 0) {
      this.setState({disablePrev: false, disableFirst: false});
    } else {
      this.setState({disablePrev: true, disableFirst: true});
    }
    if (nextPageNum <= this.state.dataCount && nextPageNum > 1) {
      this.setState({disableNext: false, disableLast: false});
    } else {
      this.setState({disableNext: true, disableLast: true});
    }
  }

  //resets page number to 1 and changes the page size and total pages
  updatePageSize(size) {
    let currentPagesArr = this.state.currentPages;
    currentPagesArr[1] = 1;
    currentPagesArr[0] = currentPagesArr[1] - 1;
    currentPagesArr[2] = currentPagesArr[1] + 1;
    this.setState(
      {
        selectedValue: size,
        currentPages: currentPagesArr,
        totalPages: Math.ceil(this.state.dataCount / parseFloat(size)),
      },
      () => {
        if (this.state.url != '') {
          this.updateTablePages();
        }
      },
    );
  }

  //when the page numbers/first/last buttons are pressed
  updatePageNum(set) {
    let currentPagesArr = this.state.currentPages;
    if (set != 0) {
      currentPagesArr[1] = set;
    }
    currentPagesArr[0] = currentPagesArr[1] - 1;
    currentPagesArr[2] = currentPagesArr[1] + 1;
    this.setState({currentPage: currentPagesArr});
    this.togglePaginationButtons();
    this.updateTablePages();
  }

  //create query to get data for the different page
  updateTablePages() {
    let url = this.state.url;
    url += `&pageSize=${this.state.selectedValue}&pageNum=${this.state.currentPages[1]}`;
    this.getData(url);
  }

  //returns the page numbers to render and only adds in the suitable values
  retrievePageNumbers() {
    let previousPageNum = this.state.currentPages[0];
    let currentPageNum = this.state.currentPages[1];
    let nextPageNum = this.state.currentPages[2];
    var gArr = [];
    if (previousPageNum != 0) {
      gArr.push(
        <TouchableOpacity
          style={styles.pageButton}
          onPress={() => this.updatePageNum(previousPageNum)}>
          <Text style={{color: 'black'}}>{this.state.currentPages[0]}</Text>
        </TouchableOpacity>,
      );
    }
    if (currentPageNum) {
      gArr.push(
        <TouchableOpacity
          style={styles.currentPageButton}
          onPress={() => this.updatePageNum(currentPageNum)}
          disabled={true}>
          <Text style={{color: 'white'}}>{this.state.currentPages[1]}</Text>
        </TouchableOpacity>,
      );
    }
    if (nextPageNum <= this.state.totalPages && nextPageNum != 0) {
      gArr.push(
        <TouchableOpacity
          style={styles.pageButton}
          onPress={() => this.updatePageNum(nextPageNum)}>
          <Text style={{color: 'black'}}>{this.state.currentPages[2]}</Text>
        </TouchableOpacity>,
      );
    }
    return gArr;
  }

  render() {
    return (
      <ScrollView style={styles.body}>
        <View style={styles.container}>
        <Text style={styles.filterText}>Computation Option:</Text>
        <Switch
              value={this.state.isAdvance}
              onPress={()=>{
                this.setState({
                  isAdvance:!this.state.isAdvance
                })
              }}
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
          <Text style={styles.filterText}>Company Id:</Text>
          <TextInput
            style={styles.textArea}
            keyboardType="numeric"
            onChangeText={(text) => this.setState({companyId: text})}
          />
          <Text style={styles.filterText}>Audience Range</Text>
          <View style={{flexDirection: 'row', display: 'flex'}}>
            <View style={{flex: 6}}>
              <Text>Min Value</Text>
              <TextInput
                style={styles.textArea}
                keyboardType="numeric"
                onChangeText={(text) => this.setState({minCount: text})}
              />
            </View>
            <View style={{flex: 6}}>
              <Text>Max Value</Text>
              <TextInput
                style={styles.textArea}
                keyboardType="numeric"
                onChangeText={(text) => this.setState({maxCount: text})}
              />
            </View>
          </View>
          <Text style={styles.filterText}>Cost Range</Text>
          <View style={{flexDirection: 'row', display: 'flex'}}>
            <View style={{flex: 6}}>
              <Text>Min Value</Text>
              <TextInput
                style={styles.textArea}
                keyboardType="numeric"
                onChangeText={(text) => this.setState({minCost: text})}
              />
            </View>
            <View style={{flex: 6}}>
              <Text>Max Value</Text>
              <TextInput
                style={styles.textArea}
                keyboardType="numeric"
                onChangeText={(text) => this.setState({maxCost: text})}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.createQuery()}>
            <Text style={styles.buttonText}>Compute Result!</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.msgState,
              {
                borderColor: this.state.msgBoxConfig.currentBorderColor,
                backgroundColor: this.state.msgBoxConfig.currentBgColor,
              },
            ]}>
            <Text
              style={[
                styles.msgStateText,
                {
                  color: this.state.msgBoxConfig.currentTextColor,
                },
              ]}>
              {this.state.msgState}
            </Text>
          </View>
          <View style={styles.horizontalLine} />
          <Text style={styles.filterText}>Result Table</Text>
          <Text style={styles.pageSizeText}>Number of entires:</Text>
          <Picker
            selectedValue={this.state.selectedValue}
            onValueChange={(size) => this.updatePageSize(size)}>
            <Picker.Item label="5" value="5" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="20" value="20" />
            <Picker.Item label="50" value="50" />
            <Picker.Item label="100" value="100" />
          </Picker>
          {this.dataTable()}
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => this.updatePageNum(1)}
              disabled={this.state.disableFirst}>
              <Text>First</Text>
            </TouchableOpacity>
            {this.retrievePageNumbers()}
            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => this.updatePageNum(this.state.totalPages)}
              disabled={this.state.disableLast}>
              <Text>Last</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  navHeader: {
    backgroundColor: 'navy',
    width: '100%',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  backBtn: {
    color: 'white',
    fontSize: 20,
  },
  navText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    padding: 10,
  },
  header: {
    justifyContent: 'center',
    flex: 2,
  },
  headerText: {
    fontSize: 60,
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    flex: 4,
    // alignItems:"",
    backgroundColor: '#b3eaff',
  },
  filterText: {
    textAlign: 'left',
    fontSize: 30,
  },
  pageSizeText: {
    textAlign: 'left',
    fontSize: 15,
  },
  button: {
    justifyContent: 'center',
    backgroundColor: '#079fd9',
    width: 300,
    margin: 'auto',
    height: 50,
    borderRadius: 50,
    alignSelf: 'center',
    // flex:2
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  introSentence: {
    fontSize: 18,
    textAlign: 'center',
  },
  horizontalLine: {
    borderBottomColor: 'black',
    width: 250,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  textArea: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    marginVertical: 10,
    marginHorizontal: 4,
    fontSize: 18,
  },
  tableHead: {
    backgroundColor: 'navy',
    paddingVertical: 10,
  },
  tableHeadText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  tableBody: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    paddingVertical: 10,
  },
  tableBodyText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
  },
  pageButton: {
    minWidth: 50,
    minHeight: 50,
    borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentPageButton: {
    minWidth: 50,
    minHeight: 50,
    borderWidth: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgState: {
    backgroundColor: '#dddddd',
    margin: 8,
    padding: 8,
    borderColor: '#777777',
    borderWidth: 2,
    borderRadius: 0,
  },
  msgStateText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
  },
});

export default DataViewer;
