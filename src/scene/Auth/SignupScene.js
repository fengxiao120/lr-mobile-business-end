import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, Platform,
    TextInput, TouchableOpacity, KeyboardAvoidingView,
} from 'react-native'
import { Button } from 'react-native-elements';
import { color, LRSpinner, Separator, SpacingView, InputWithIcon } from '../../widget'
import { screen, system, tool } from '../../common'
import CONFIG from '../../config'
import AuthApi from '../../api/auth'
import Storage from '../../common/storage'
import moment from 'moment'


class SignupScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: 'white' },  
    })

    constructor(props) {
        super(props)
        this.state = {
            loading:false
        }
        this.user = {
            username: '',
            password: '',
            confirmPassword: '',
            nickName: '',
        }
    }

    validateEmail = (email)=>{
        var re = /\S+@\S+\.\S+/
        return re.test(email)
    }

    signup = async () => {
        if (!this.validateEmail(this.user.username))
            this.errorMsg = "Email address format is incorrect"
        else if (!this.user.password || this.user.password.length < 6) 
            this.errorMsg = "Minimum password length is 6"
        else if (this.user.password != this.user.confirmPassword) 
            this.errorMsg = "Passwords do not match"
        else if (!this.user.nickName)
            this.errorMsg = "Nickname cannot be empty"
        else
            this.errorMsg = null
        
        if(this.errorMsg){
            Alert.alert(
              'Error',
              this.errorMsg,
              [
                {text: 'OK'},
              ],
              { cancelable: true }
            )
            return 
        } else {
            this.setState({loading:true})
            try{
                let json = await AuthApi.register(this.user)
                this.setState({loading:false})
                if(json.success)
                    Alert.alert(
                      'Your registration is successful!',
                      'You need to verify your account in your email first before you can log in',
                      [
                        {text: 'OK', onPress:()=> this.props.navigation.goBack()}
                      ],
                      { cancelable: false }
                    )  
                else
                    Alert.alert(
                      'Something went wrong',
                      json.error.code,
                      [
                        {text: 'OK', onPress:()=> this.props.navigation.goBack()}
                      ],
                      { cancelable: true }
                    )                      
            } catch (error){
                console.error(error)
                this.setState({loading:false})
            }
        }
    }

    onChangeEmail = (text) => {
        this.user.username = text
    }
    onChangePassword = (text) => {
        this.user.password = text   
    }
    onConfirmPassword = (text) =>{
        this.user.confirmPassword = text      
    }
    onChangeNickname = (text) => {
        this.user.nickName = text    
    }
    render() {
        return (
            <ScrollView style={{height:screen.height, backgroundColor:'white'}}>
            <LRSpinner visible={this.state.loading} />
            <KeyboardAvoidingView style={{ flex: 1, height:screen.height - (Platform.OS == 'ios'?74:80), justifyContent: 'flex-start', backgroundColor: "white", alignItems: 'center' }} behavior="padding">
                <Text style={{ color: '#0abab5', fontSize: 22, marginTop: 50}}>Sign Up</Text>
                <InputWithIcon onChangeText={this.onChangeEmail} icon="envelope-o" placeholder="Email Address"
                    style={{ borderRadius: 5, height: 40, borderColor: '#868686', borderWidth: 1, width: '80%', marginTop: 60 }}
                />
                <InputWithIcon secureTextEntry={true} onChangeText={this.onChangePassword} icon="lock" placeholder="Password"
                    style={{ borderRadius: 5, height: 40, borderColor: '#868686', borderWidth: 1, width: '80%', marginTop: 20 }}
                />
                <InputWithIcon secureTextEntry={true} onChangeText={this.onConfirmPassword} icon="lock" placeholder="Confirm Password"
                    style={{ borderRadius: 5, height: 40, borderColor: '#868686', borderWidth: 1, width: '80%', marginTop: 20 }}
                />
                <InputWithIcon onChangeText={this.onChangeNickname} icon="user" placeholder="Nickname"
                    style={{ borderRadius: 5, height: 40, borderColor: '#868686', borderWidth: 1, width: '80%', marginTop: 20 }}
                />                                
                <Button onPress={this.signup} color="white" backgroundColor="#0abab5" borderRadius={5} containerViewStyle={{ width: '80%', marginTop: 60 }} title="Sign Up" />

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
export default SignupScene;