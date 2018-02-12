import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, TextInput, Modal,
    ScrollView, TouchableOpacity,
    ListView, Image, StatusBar, FlatList, Alert, Platform, Linking, KeyboardAvoidingView
} from 'react-native'
import { Button } from 'react-native-elements';
import { color, LRSpinner, RefreshListView, RefreshState, Separator, SpacingView, InputWithIcon } from '../../widget'
import { screen, system, tool } from '../../common'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CONFIG from '../../config'
import AuthApi from '../../api/auth'
import Storage from '../../common/storage'
import moment from 'moment'

class ResetPasswordScene extends PureComponent {
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
        }
    }

    validateEmail = (email)=>{
        var re = /\S+@\S+\.\S+/
        return re.test(email)
    }    

    reset = async () => {
        if (!this.validateEmail(this.user.username))
            this.errorMsg = "Email address format is incorrect"
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
                let json = await AuthApi.reset(this.user.username)
                this.setState({loading:false})
                if(json.success)
                    Alert.alert(
                      'Success',
                      'A reset link has been sent to your email',
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
    render() {
        return (
            <ScrollView style={{height:screen.height, backgroundColor:'white'}}>
            <LRSpinner visible={this.state.loading} />
            <KeyboardAvoidingView style={{ flex: 1, height:screen.height - (Platform.OS == 'ios'?74:80), justifyContent: 'flex-start', backgroundColor: "white", alignItems: 'center' }} behavior="padding">
                <Text style={{ color: '#0abab5', fontSize: 22, marginTop: 50, marginBottom:50}}>Reset Password</Text>
                <Text style={{marginLeft:screen.width*0.1, marginRight:screen.width*0.1, color:'black'}}>Enter the email address you used to register with LocalRecommends - if a matching email is found, we will send you a link to reset it.</Text>
                <InputWithIcon onChangeText={this.onChangeEmail} icon="envelope-o" placeholder="Email Address"
                    style={{ borderRadius: 5, height: 40, borderColor: '#868686', borderWidth: 1, width: '80%', marginTop: 50 }}
                />                                
                <Button onPress={this.reset} color="white" backgroundColor="#0abab5" borderRadius={5} containerViewStyle={{ width: '80%', marginTop: 60 }} title="Submit" />
            </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}
export default ResetPasswordScene;