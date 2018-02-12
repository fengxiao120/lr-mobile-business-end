import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, TextInput, Modal,
    ScrollView, TouchableOpacity,
    ListView, Image, StatusBar, FlatList, ActivityIndicator, Platform, Linking, KeyboardAvoidingView
} from 'react-native'
import { Button } from 'react-native-elements';
import { color, NavigationItem, RefreshListView, RefreshState, Separator, SpacingView, InputWithIcon } from '../../widget'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CONFIG from '../../config'
import AuthApi from '../../api/auth'
import Storage from '../../common/storage'
import { screen, system, tool } from '../../common'
import moment from 'moment'

class LoginScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: 'white' },  
    })

    constructor(props) {
        super(props)
        this.user = {
            username: '',
            password: ''
        }
    }
    async login() {
        let json = await AuthApi.login(this.user)
        if (json.success && json.data.user.verified) {
            __userStatusChanged = true
            this.props.screenProps.user = json.data.user
            Storage.set('access_token', json.data.access_token)
            Storage.set('refresh_token', json.data.refresh_token)
            let now = moment()
            let expiry = now.add(json.data.expires_in, 's')
            Storage.set('access_token_expiry', expiry.format())
            Storage.set('user', json.data.user).then(() => {
                if (this.props.navigation.state.params.from != 'App')
                    this.props.navigation.navigate(this.props.navigation.state.params.from)
                else {
                    this.props.navigation.goBack()
                    if(this.props.navigation.state.params.callback)
                        this.props.navigation.state.params.callback()
                }
            })
        } else {
            if(!json.success)
                ___toast('Invalid login credentials', true)
            else if(!json.data.user.verified)
                ___toast("You haven't verified your email yet", true)
            else
                ___toast("Something is wrong and we don't know why", true )
        }
    }
    onChangeEmail(text) {
        this.user.username = text
    }
    onChangePassword(text) {
        this.user.password = text
    }
    render() { //Need fix
        return (
            <ScrollView style={{height:screen.height, backgroundColor:'white'}}>
            <KeyboardAvoidingView style={{ flex: 1, height:screen.height - (Platform.OS == 'ios'?74:80), justifyContent: 'center', backgroundColor: "white", alignItems: 'center' }} behavior="padding">
                <Text style={{ color: '#0abab5', fontSize: 22 }}>Log In</Text>
                <InputWithIcon onChangeText={this.onChangeEmail.bind(this)} icon="envelope-o" placeholder="Email Address"
                    style={{ borderRadius: 5, height: 40, borderColor: '#868686', borderWidth: 1, width: '80%', marginTop: 60 }}
                />
                <InputWithIcon secureTextEntry={true} onChangeText={this.onChangePassword.bind(this)} icon="lock" placeholder="Password"
                    style={{ borderRadius: 5, height: 40, borderColor: '#868686', borderWidth: 1, width: '80%', marginTop: 20 }}
                />
                <Button onPress={this.login.bind(this)} color="white" backgroundColor="#0abab5" borderRadius={5} containerViewStyle={{ width: '80%', marginTop: 60 }} title="Log In" />
                <Button onPress={()=>this.props.navigation.navigate('Signup')} color="#0abab5" backgroundColor="white" borderRadius={5} containerViewStyle={{ borderWidth: 1, borderColor: "#0abab5", width: '80%', marginTop: 20 }} title="Sign Up" />
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('ResetPassword')}>
                    <Text style={{ color: "#868686", marginTop: 15, fontSize: 12, marginBottom: 100 }}>Forgot password?</Text>
                </TouchableOpacity>
                <Text style={{ position: 'absolute', bottom: 40, textAlign: 'center', color: "#868686", fontSize: 10, paddingLeft:30, paddingRight:30 }}>By creating an account, you agree to LocalRecommends’s
                    <Text style={{color:color.theme}} onPress={() => { this.props.navigation.navigate("Web", { url: "https://localrecommends.com/terms" }) }}>
                        {` Terms of Service `}
                    </Text>
                    and 
                    <Text style={{color:color.theme}} onPress={() => { this.props.navigation.navigate("Web", { url: "https://localrecommends.com/privacy" }) }}>
                        {` Privacy Policy`}
                    </Text>                    
                </Text>
            </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}
export default LoginScene;