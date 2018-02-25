import React, { PureComponent } from 'react'
import { color, Button, NavigationItem, RefreshListView, RefreshState, Separator, SpacingView, Album } from '../../widget'

import shopApi from '../../api/shop'
import {
    View, Text, StyleSheet, TextInput, Platform, 
    ScrollView, TouchableOpacity, ActivityIndicator, 
} from 'react-native'
import api from '../../api'

import _ from 'lodash'
import { screen, system } from '../../common'


class EditShopScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Edit Shop Information',    
        headerRight:(<TouchableOpacity onPress={()=>alert('Submit: To do')}><Text style={{color:'#c88',marginRight:20,fontSize:16}}>Submit</Text></TouchableOpacity>),
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerStyle: { backgroundColor: 'white', }        
    });


    constructor(props: Object) {
        super(props)

        this.state = props.navigation.state.params.shop
        this.state.recommendations =  []
        this.state.loading = false
    }


    setAlbum = (album) => {
        this.setState({
            album: album
        })
    }


    render() {
        if(this.state.loading)
            return ( <View style={{height:300,justifyContent:'center', alignItems: 'center',}}>
                    <ActivityIndicator size="large" color={color.theme} />
                </View>)
        else
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ backgroundColor: "white" }}>
                        <Text style={{ fontSize: 16,  padding: 10}}>Name</Text>
                        <TextInput
                            placeholder="Enter Your Shop Name"
                            style={{padding: 5, paddingLeft:10, marginLeft:10, borderRadius:5,
                                marginRight:10, fontSize: 16, borderColor:'#ccc', borderWidth: 1, }}
                            value={this.state.name}
                            onChangeText={(data) => { this.setState({ name: data }) }}
                            underlineColorAndroid="transparent"
                        />           

                        <Text style={{ fontSize: 16,  padding: 10}}>Address</Text>
                        <TextInput
                            placeholder="Enter Your Shop Address"
                            style={{padding: 5, paddingLeft:10, marginLeft:10, borderRadius:5,
                                marginRight:10, fontSize: 16, borderColor:'#ccc', borderWidth: 1, }}
                            value={this.state.address}
                            multiline={true}
                            onChangeText={(data) => { this.setState({ address: data }) }}
                            underlineColorAndroid="transparent"
                        />       

                        <Text style={{ fontSize: 16,  padding: 10}}>Postal Code</Text>
                        <TextInput
                            placeholder="Enter Your Shop's Postal Code"
                            style={{padding: 5, paddingLeft:10, marginLeft:10, borderRadius:5,
                                marginRight:10, fontSize: 16, borderColor:'#ccc', borderWidth: 1, }}
                            value={this.state.post}
                            onChangeText={(data) => { this.setState({ post: data }) }}
                            underlineColorAndroid="transparent"
                        />      

                        <Text style={{ fontSize: 16,  padding: 10}}>Contact Number</Text>
                        <TextInput
                            placeholder="Enter Your Shop's contact number"
                            style={{padding: 5, paddingLeft:10, marginLeft:10, borderRadius:5,
                                marginRight:10, fontSize: 16, borderColor:'#ccc', borderWidth: 1, }}
                            value={this.state.mobile}
                            onChangeText={(data) => { this.setState({ mobile: data }) }}
                            underlineColorAndroid="transparent"
                        />      

                        <Text style={{ fontSize: 16,  padding: 10}}>Opening Hours</Text>
                        <TextInput
                            placeholder="Enter Your Shop's opening hours"
                            style={{padding: 5, paddingLeft:10, marginLeft:10, borderRadius:5,
                                marginRight:10, fontSize: 16, borderColor:'#ccc', borderWidth: 1, }}
                            value={this.state.openingHours}
                            multiline={true}
                            onChangeText={(data) => { this.setState({ openingHours: data }) }}
                            underlineColorAndroid="transparent"
                        />      

                        <Text style={{ fontSize: 16,  padding: 10}}>Album</Text>
                        <View style={styles.albumContainer}>
                            <Album images={this.state.album} setAlbum={this.setAlbum}></Album>
                        </View>                                                                                                  

                        <SpacingView height={30} backgroundColor={'white'}/>
                    </ScrollView >
                </View >
            )
    }
}

const styles = StyleSheet.create({
    albumContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft:20,
        paddingRight:20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'grey',
    },
    innerContainer: {
        alignItems: 'center',
    },
});


export default EditShopScene;