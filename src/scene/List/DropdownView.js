/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { color} from '../../widget'

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  PixelRatio,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  ART,
  View,
  Picker
} from 'react-native';
 
const {Surface, Shape, Path, Group} = ART;
 
const {width, height} = Dimensions.get('window');
 
const T_WIDTH = 7;
const T_HEIGHT = 4;
 
const COLOR_HIGH = '#00bea9';
const COLOR_NORMAL = '#6c6c6c';
 
const LINE = 1 / PixelRatio.get();
const DROPDOWN_HEIGHT = height-122
 

const Listpicker = (props) => {
  const onPress = () => {
    props.onSelected(props.index);
  }  
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={props.selected? styles.MRTLineSelected : styles.MRTLine}>
        <Text style={props.selected? styles.MRTLineTextSelected:null}>{props.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}


 
 
export default class DropdownView extends Component {
 
  constructor(props) {
    super(props);
    //分析数据
    this.state = {
      fadeInOpacity: new Animated.Value(0),
      
      maxHeight: DROPDOWN_HEIGHT,
      height: new Animated.Value(0),
      MRTLineSelected:0,
      selectedDistrict:'',
      districtsToRender:props.districts[0],
      dropdownExpanded:false,
    };
 
 
  }
 
  createAnimation = (height) => {
    return Animated.timing(
      this.state.height,
      {
        toValue: height,
        duration: 250
      }
    );
  }
 
  createFade = (value) => {
    return Animated.timing(
      this.state.fadeInOpacity,
      {
        toValue: value,
        duration: 250,
      }
    );
  } 
 
  onShow = () => {
    Animated.parallel([this.createAnimation(this.state.maxHeight), this.createFade(1)]).start();
  }
 
 
  hide = () => {
    this.state.height.setValue(0);
    Animated.parallel([this.createAnimation(0), this.createFade(0)]).start();
  }
 


  onNavItemSelected = () => {
    if (this.state.dropdownExpanded) {
      //消失
      this.setState({dropdownExpanded: false})
      this.hide();
    } else {
      this.setState({dropdownExpanded: true});
      this.onShow();
    }
  }
 
  onMRTLineSelected = (index) => {
    if(index==0){ //Special case of onDistrictSelect
      this.props.onSelected({area:''})
      this.setState({selectedDistrict:''})
      this.setState({dropdownExpanded: false})
      this.hide();      
    }
    this.setState({MRTLineSelected:index})
  }

  onDistrictSelect = (distrct) => {
    this.props.onSelected({area:distrct})
    this.setState({selectedDistrict:distrct})
    this.setState({dropdownExpanded: false});
    this.hide();
  }
 
  renderDropdown = (districts) => {
    return (
      <Animated.View style={[styles.content, {opacity: this.state.dropdownExpanded ? 1 : 0, height: this.state.height}]}>
        <View style={styles.scroll}>
          <View style={{width:width*0.25}}>
          {districts.map((item, index) => {
            return <Listpicker
              name={item.groupName}
              index={index}
              selected={this.state.MRTLineSelected==index}
              onSelected={this.onMRTLineSelected}
              key={index}/>
          })}
          </View>
          <ScrollView style={{width:width*0.4,height:DROPDOWN_HEIGHT}}>
            {this.props.districts[this.state.MRTLineSelected].list.map((item, index)=>{
            return <TouchableOpacity onPress={()=>this.onDistrictSelect(item.name)} key={item.id} style={{justifyContent: 'center',alignItems: 'center',height:40}}>
                <Text style={this.state.selectedDistrict==item.name?[{textAlign:'center'},styles.MRTLineTextSelected]:{textAlign:'center', color:'#333'}}>{item.name}</Text>
              </TouchableOpacity>
            })}
          </ScrollView>          
        </View>
      </Animated.View>
    );
  }


  render() {
    return (
      <View>
        <View style={styles.topMenu}>
          <TouchableWithoutFeedback onPress={this.onNavItemSelected}>
            <View style={{justifyContent: 'center',width:width*0.25,alignItems: 'center'}}>
              <Text numberOfLines={1} style={this.state.dropdownExpanded ? styles.menuTextHigh : styles.menuText}>{this.state.selectedDistrict==''?'Area':this.state.selectedDistrict}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {this.renderDropdown(this.props.districts)}

      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  topMenu: {
    flexDirection: 'row',
    height: 40,
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    position: 'absolute',
    width:width*0.25,
    left:width*0.25,
    top:-40,
    zIndex:10001,
    backgroundColor:'white',
  }, 
  scroll: {
    backgroundColor:'#eee',
    height:height,
    elevation: 3,
    flexDirection:'row'
  },

  content: {
    position: 'absolute',
    width: width*0.65,
    left: width*0.25 - 7,
    zIndex:10000,
    paddingLeft:8,
    paddingRight:8,
  },
 
  highlight: {
    color: COLOR_HIGH
  },
 
  marginHigh: {marginLeft: 10},
  margin: {marginLeft: 28},
 
 
  titleItem: {
    height: 43,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: LINE,
    borderBottomColor: '#eee',
    flexDirection: 'row',
  },
 
  tableItem: {
    height: 43,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: LINE,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tableItemText: {fontWeight: '300', fontSize: 14},
  row: {
    flexDirection: 'row'
  },
 
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextHigh: {
    textAlign:'center',
    fontSize: 16,
    color: COLOR_HIGH,

  },
  menuText: {
    textAlign:'center',
    fontSize: 16,
    color: COLOR_NORMAL
  },
  MRTLine:{
    marginTop:5,marginBottom:5,
    width:width*0.25,height:40,alignItems:'center',justifyContent:'center'
  },
  MRTLineSelected:{
    marginTop:5,marginBottom:5,
    width:width*0.25,height:40,alignItems:'center',justifyContent:'center',
    backgroundColor:'#fcfcfc'
  },
  MRTLineTextSelected:{
    color:color.theme,
  },
});