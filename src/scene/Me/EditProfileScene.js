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
import Toast from 'react-native-root-toast';
// create a component
class EditProfileScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.title,
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerRight: (
            <TouchableOpacity onPress={navigation.state.params.submit}>
                <Text style={{ backgroundColor: '#0abab5', color: 'white', padding: 5, marginRight: 10 }}>Submit</Text>
            </TouchableOpacity>
        )
    })
    constructor(props: Object) {
        super(props)
        this.state = {
            value: this.props.navigation.state.params.value
        }
        this.type = this.props.navigation.state.params.type
        this.props.navigation.setParams({
            submit: this.submit.bind(this)
        })

    }
    async submit() {
        let data = this.state.user
        switch (this.type) {
            case "NICKNAME":
                data.nickName = this.state.value;
                if (!data.nickName) {
                    Alert.alert('Alert', 'Nickname cannot be blank.')
                    return
                }
                break;
            case "LOCAL":
                data.isLocal = this.state.value;
                break;
            case "DOB":
                data.birthday = moment(this.state.value).toDate();
                break;
            case "GENDER":
                data.gender = this.state.value;
                break;
            case "MOBILE":
                data.mobile = this.state.value;
                break;
        }

        data.pictureUuid = data.picture && data.picture.uuid
        this.setState({ loading: true })
        let json = await UserApi.updateProfile(data)
        this.setState({ loading: false })
        if (json.success) {
            Storage.set("user", json.data)
            ___toast('Successfully Updated')
            this.props.navigation.state.params.callback(json.data)
            this.props.navigation.goBack()
        }
    }
    componentWillMount() {
        this.getUser()
    }
    async getUser() {
        let user = await Storage.get("user")
        this.setState({ user: user })
    }
    onChangeText(text) {
        this.setState({
            value: text
        })
    }
    onChangeCheckbox() {
        this.setState({
            value: !this.state.value
        })
    }
    onGenderChange(gender) {
        this.setState({
            value: gender
        })
    }
    clear() {
        this.setState({
            value: null
        })
    }
    render() {
        return (
            <View style={{ backgroundColor: 'white', padding: 10 }}>
                {
                    this.type == "NICKNAME" &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextInput placeholder="Enter" value={this.state.value} onChangeText={this.onChangeText.bind(this)} style={{ flex: 13, fontSize: 16, paddingTop: 6, paddingBottom: 6 }}></TextInput>
                        <TouchableOpacity onPress={this.clear.bind(this)}>
                            <Text
                                style={{ fontSize: 15 }} >
                                <FontAwesome name={'times-circle'} color={'#868686'} size={25} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    this.type == "MOBILE" &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextInput keyboardType='numeric' placeholder="Enter" value={this.state.value} onChangeText={this.onChangeText.bind(this)} style={{ flex: 13, fontSize: 16, paddingTop: 6, paddingBottom: 6 }}></TextInput>
                        <TouchableOpacity onPress={this.clear.bind(this)}>
                            <Text
                                style={{ fontSize: 15 }} >
                                <FontAwesome name={'times-circle'} color={'#868686'} size={25} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    this.type == "LOCAL" &&
                    <CheckBox
                        title='Yes, I am a local'
                        checkedColor="#0abab5"
                        uncheckedColor="#868686"
                        checked={this.state.value}
                        onPress={this.onChangeCheckbox.bind(this)}
                    />
                }
                {
                    this.type == "GENDER" &&
                    <View>
                        <CheckBox
                            title='Male'
                            checkedColor="#0abab5"
                            uncheckedColor="#868686"
                            checked={this.state.value == "Male"}
                            onPress={() => { this.onGenderChange("Male") }}
                        />
                        <CheckBox
                            title='Female'
                            checkedColor="#0abab5"
                            uncheckedColor="#868686"
                            checked={this.state.value == "Female"}
                            onPress={() => { this.onGenderChange("Female") }}
                        />
                        <CheckBox
                            title='Secret'
                            checkedColor="#0abab5"
                            uncheckedColor="#868686"
                            checked={this.state.value == "Secret"}
                            onPress={() => { this.onGenderChange("Secret") }}
                        />
                    </View>
                }
                {
                    this.type == "DOB" &&
                    <DatePicker
                        style={{ width: '100%' }}
                        date={moment(this.state.value).isValid() ? moment(this.state.value).toDate() : null}
                        mode="date"
                        placeholder="Select date"
                        format="YYYY-MM-DD"
                        minDate="1900-05-01"
                        maxDate="2018-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={(date) => { this.setState({ value: date }) }}
                    />
                }
                <LRSpinner visible={this.state.loading} />
            </View>
        )
    }
}


export default EditProfileScene


