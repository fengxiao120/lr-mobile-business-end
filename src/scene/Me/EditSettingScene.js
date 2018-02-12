//import liraries
import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, ScrollView, Button,
    FlatList, ListView, Image, TextInput, Picker, TouchableOpacity, Alert
} from 'react-native'

import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { color, NavigationItem, RefreshListView, RefreshState, SpacingView, LRSpinner, Avatar } from '../../widget'
import { screen, system, tool } from '../../common'
import UserApi from '../../api/user'
import { CheckBox } from 'react-native-elements'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Storage from '../../common/storage'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import _ from 'lodash'

// create a component
class EditSettingScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.title,
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerRight: (<View></View>),
        headerRight: (
            <View>
                {
                    navigation.state.params.type != "EMAIL" &&
                    <TouchableOpacity onPress={navigation.state.params.submit} >
                        <Text style={{ backgroundColor: '#0abab5', color: 'white', padding: 5, marginRight: 10 }}>Submit</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    })
    constructor(props: Object) {
        super(props)

        this.type = this.props.navigation.state.params.type
        this.props.navigation.setParams({
            submit: this.submit.bind(this)
        })
        this.state = {
            value: this.props.navigation.state.params.value,
            password: "",
            cfmPassword: ""
        }
    }
    async submit() {
        let data = this.state.user
        switch (this.type) {
            case "PASSWORD":
                if (this.state.password.length < 6) {
                    Alert.alert("Alert", "Password minimum length is 6")
                    return
                }
                if (this.state.password != this.state.cfmPassword) {
                    Alert.alert("Alert", "Passwords do not match")
                    return
                }
                break;
        }
        this.setState({ loading: true })
        let json = await UserApi.updateSetting({ password: this.state.password })
        this.setState({ loading: false })
        if (json.success) {
            this.props.navigation.goBack()
            ___toast('You have successfully changed your password')
        }
    }
    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                {
                    this.type == "EMAIL" &&
                    <Text style={{ fontSize: 16, padding: 10, paddingTop: 16, paddingBottom: 16 }}>{this.state.value}</Text>
                }
                {
                    this.type == "PASSWORD" &&
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                            <TextInput secureTextEntry={true} value={this.state.password} placeholder="New Password" onChangeText={(text) => { this.setState({ password: text }) }} style={{ flex: 13, fontSize: 16, paddingTop: 6, paddingBottom: 6 }}></TextInput>
                            <TouchableOpacity onPress={() => { this.setState({ password: "" }) }}>
                                <Text
                                    style={{ fontSize: 15 }} >
                                    <FontAwesome name={'times-circle'} color={'#868686'} size={25} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <SpacingView height={1} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                            <TextInput secureTextEntry={true} value={this.state.cfmPassword} placeholder="Confirm Password" onChangeText={(text) => { this.setState({ cfmPassword: text }) }} style={{ flex: 13, fontSize: 16, paddingTop: 6, paddingBottom: 6 }}></TextInput>
                            <TouchableOpacity onPress={() => { this.setState({ cfmPassword: "" }) }}>
                                <Text
                                    style={{ fontSize: 15 }} >
                                    <FontAwesome name={'times-circle'} color={'#868686'} size={25} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                <LRSpinner visible={this.state.loading} />
            </View>
        )
    }
}

//make this component available to the app
export default EditSettingScene

