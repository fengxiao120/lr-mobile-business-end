//import liraries
import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, Button, Image,
    TouchableOpacity, Platform
} from 'react-native'

import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { color, NavigationItem, RefreshListView, RefreshState, SpacingView, LRSpinner } from '../../widget'
import { screen, system, tool } from '../../common'

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import _ from 'lodash'

// create a component
class AboutScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: 'white' },
    })
    constructor(props: Object) {
        super(props)
    }
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                <Image source={require('../../img/Me/logo.png')} resizeMode="stretch" style={{ width: 200, height: 200 }} />
                <Text style={{ color: '#868686' }}>V1.0.0</Text>


                <TouchableOpacity style={{ minWidth: screen.width * 0.5, marginTop: 60, flexDirection: 'row', borderWidth: 0.8, borderColor: '#999', padding: 8, borderRadius: 10, paddingLeft: 15 }}
                    onPress={() => { this.props.navigation.navigate("Web", { url: Platform.OS == 'ios' ? "https://itunes.apple.com/us/app/localrecommends/id1342673167" : 'https://play.google.com/store' }) }}>
                    <FontAwesome name={Platform.OS == 'ios' ? 'apple' : 'android'} color='#555' size={20} />
                    <Text style={{ color: '#868686', marginLeft: 12, marginTop: Platform.OS == 'ios' ? 2 : 0 }}>Rate Us On {Platform.OS == 'ios' ? 'App Store' : 'Google Play'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ minWidth: screen.width * 0.5, marginTop: 20, flexDirection: 'row', borderWidth: 0.8, borderColor: '#999', padding: 8, borderRadius: 10, paddingLeft: 15 }}
                    onPress={() => { this.props.navigation.navigate("Web", { url: "https://www.facebook.com/" }) }}>
                    <FontAwesome name='facebook-square' color='#3b5998' size={20} />
                    <Text style={{ color: '#868686', marginLeft: 12, marginTop: Platform.OS == 'ios' ? 2 : 0 }}>Like Us On Facebook</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', marginTop: 150 }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate("Web", { url: "https://localrecommends.com/terms" }) }}>
                        <Text style={{ color: '#868686' }}>Terms of Service</Text>
                    </TouchableOpacity>
                    <Text>  |  </Text>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate("Web", { url: "https://localrecommends.com/privacy" }) }}>
                        <Text style={{ color: '#868686' }}>Privacy Policy </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default AboutScene


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
    textHeader: {
        color: color.theme,
        fontSize: 16,
        marginTop: 30,
        marginBottom: 20,
    },
    textBody: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginRight: 20,
        marginLeft: 20,
    }

})