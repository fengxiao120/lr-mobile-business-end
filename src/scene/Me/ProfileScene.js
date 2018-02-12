//import liraries
import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, ScrollView, Button,
    FlatList, ListView, Image, TextInput, Picker, TouchableOpacity
} from 'react-native'

import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { color, NavigationItem, RefreshListView, RefreshState, SpacingView, LRSpinner, Avatar } from '../../widget'
import { screen, system, tool } from '../../common'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Storage from '../../common/storage'
import _ from 'lodash'

// create a component
class ProfileScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Profile',
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
        this.props.navigation.navigate('EditProfileImage', {
            callback: this.userUpdated.bind(this)
        })
    }
    editNickName() {
        this.props.navigation.navigate('EditProfile', { type: "NICKNAME", title: 'Nickname', value: this.state.user.nickName, callback: this.userUpdated.bind(this) })
    }
    editMobile() {
        this.props.navigation.navigate('EditProfile', { type: "MOBILE", title: 'Mobile', value: this.state.user.mobile, callback: this.userUpdated.bind(this) })
    }
    editLocal() {
        this.props.navigation.navigate('EditProfile', { type: "LOCAL", title: 'Local or not', value: this.state.user.isLocal, callback: this.userUpdated.bind(this) })
    }
    editGender() {
        this.props.navigation.navigate('EditProfile', { type: "GENDER", title: 'Gender', value: this.state.user.gender, callback: this.userUpdated.bind(this) })
    }
    editDob() {
        this.props.navigation.navigate('EditProfile', { type: "DOB", title: 'Date of birth', value: this.state.user.birthday, callback: this.userUpdated.bind(this) })
    }
    userUpdated(user) {
        this.setState({ user: user })
    }
    render() {
        console.log('Business view render is called')
        return (
            <View style={{ backgroundColor: 'white' }}>
                <TouchableOpacity onPress={this.editPhoto.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <View style={{ alignItems: "center", paddingRight: 10, flex: 13, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 16 }}>Profile Photo</Text>
                        <Avatar picture={this.state.user.picture} />
                    </View>
                    <Text
                        style={{ fontSize: 15 }} >
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </Text>
                </TouchableOpacity>
                <SpacingView height={1} />
                <TouchableOpacity onPress={this.editNickName.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <View style={{ paddingRight: 10, flex: 13, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 16 }}>Nickname</Text>
                        <Text style={{ fontSize: 16, color: "#868686" }}>{this.state.user.nickName}</Text>
                    </View>
                    <Text
                        style={{ fontSize: 15 }} >
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </Text>
                </TouchableOpacity>
                <SpacingView height={1} />
                <TouchableOpacity onPress={this.editMobile.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <Text style={{ flex: 13, fontSize: 16 }}>Mobile</Text>
                    <Text
                        style={{ fontSize: 15 }} >
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </Text>
                </TouchableOpacity>
                <SpacingView height={1} />
                <TouchableOpacity onPress={this.editLocal.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <Text style={{ flex: 13, fontSize: 16 }}>Local or not</Text>
                    <Text
                        style={{ fontSize: 15 }} >
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </Text>
                </TouchableOpacity>
                <SpacingView height={1} />
                <TouchableOpacity onPress={this.editGender.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <Text style={{ flex: 13, fontSize: 16 }}>Gender</Text>
                    <Text
                        style={{ fontSize: 15 }} >
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </Text>
                </TouchableOpacity>
                <SpacingView height={1} />
                <TouchableOpacity onPress={this.editDob.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                    <Text style={{ flex: 13, fontSize: 16 }}>Date of Birth</Text>
                    <Text
                        style={{ fontSize: 15 }} >
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}
export default ProfileScene

