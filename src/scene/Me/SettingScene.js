//import liraries
import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, ScrollView, Button,
    FlatList, ListView, Image, TextInput, Picker, TouchableOpacity, Alert
} from 'react-native'

import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { color, NavigationItem, RefreshListView, RefreshState, SpacingView, LRSpinner, Avatar } from '../../widget'
import { screen, system, tool } from '../../common'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Storage from '../../common/storage'
import _ from 'lodash'

// create a component
class SettingScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Setting',
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerRight: (<View></View>)
    })
    constructor(props: Object) {
        super(props)
        this.state = {
            user: {}
        }
    }
    componentWillMount() {
        this.getUser()
    }
    async getUser() {
        let user = await Storage.get("user")
        this.setState({ user: user })
    }
    editPhoto() {
        alert('TODO')
        // this.props.navigation.navigate('EditProfile')
    }
    editProfile() {
        this.props.navigation.navigate('Profile')
    }
    editEmail() {
        this.props.navigation.navigate('EditSetting', { type: "EMAIL", title: 'Email', value: this.state.user.username })
    }
    editPassword() {
        this.props.navigation.navigate('EditSetting', { type: "PASSWORD", title: 'Password' })
    }
    about() {
        this.props.navigation.navigate('About')
    }
    contact() {
        this.props.navigation.navigate('Contact')
    }
    logout() {
        Alert.alert(
            'Log Out',
            'Are you sure to log out?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => { Storage.clear(); __userStatusChanged = true; this.props.navigation.navigate('Home') } },
            ],
            { cancelable: false }
        )
    }
    render() {
        console.log('Business view render is called')
        return (
            <View style={{ backgroundColor: 'white' }}>
                <TouchableOpacity onPress={this.editProfile.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <Text style={{ flex: 13, fontSize: 16 }}>Edit Profile</Text>
                    <Text
                        style={{ fontSize: 15 }} >
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </Text>
                </TouchableOpacity>
                <SpacingView height={8} />
                <TouchableOpacity onPress={this.editEmail.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <Text style={{ flex: 13, fontSize: 16 }}>Email Address</Text>
                    <Text
                        style={{ fontSize: 15 }} >
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </Text>
                </TouchableOpacity>
                <SpacingView height={1} />
                <TouchableOpacity onPress={this.editPassword.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <Text style={{ flex: 13, fontSize: 16 }}>Change Password</Text>
                    <Text
                        style={{ fontSize: 15 }} >
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </Text>
                </TouchableOpacity>
                <SpacingView height={8} />
                <TouchableOpacity onPress={this.about.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <Text style={{ flex: 13, fontSize: 16 }}>About LocalRecommends</Text>
                    <Text
                        style={{ fontSize: 15 }} >
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </Text>
                </TouchableOpacity>
                <SpacingView height={1} />
                <TouchableOpacity onPress={this.contact.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <Text style={{ flex: 13, fontSize: 16 }}>Contact</Text>
                    <Text
                        style={{ fontSize: 15 }} >
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </Text>
                </TouchableOpacity>
                <SpacingView height={8} />
                <TouchableOpacity onPress={this.logout.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <Text style={{ color: '#c88', fontSize: 16 }}>Log Out</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

//make this component available to the app
export default SettingScene

