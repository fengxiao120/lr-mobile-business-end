//import liraries
import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, ScrollView, Button,
    FlatList, ListView, Image, TextInput, Picker
} from 'react-native'

import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { color, NavigationItem, RefreshListView, RefreshState, SpacingView, LRSpinner } from '../../widget'
import { screen, system, tool } from '../../common'

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import _ from 'lodash'

// create a component
class ContactScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: "Contact",
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerRight: (<View></View>),
    })
    constructor(props: Object) {
        super(props)
    }
    render() {
        return (
            <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
                <Image source={require('../../img/Me/contact.jpg')} style={{ width: screen.width, height: screen.width * 0.55, opacity: 0.7 }} />
                <Text style={styles.textHeader}>Contact Us</Text>
                <Text style={styles.textBody}>
                    Feel free to contact us if you have any enquiries or you just want someone to talk to.
                </Text>
                <Text style={styles.textBody}>Email: <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>contact@localrecommends.com</Text></Text>
                <Text style={styles.textBody}>Address: 22 Sin Ming Lane #06-76 Midview City Singapore 573969</Text>
            </ScrollView>
        )
    }
}

//make this component available to the app
export default ContactScene


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
        margin: 20
    }

})