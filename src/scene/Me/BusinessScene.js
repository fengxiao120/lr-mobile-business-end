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
class BusinessScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: "Business",
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerRight: (<View></View>)
    })
    constructor(props: Object) {
        super(props)
    }
    render() {
        console.log('Business view render is called')
        return (
            <ScrollView contentContainerStyle={{ alignItems: 'center', backgroundColor: 'white' }}>
                <Image source={require('../../img/Me/business.jpg')} style={{ width: screen.width, height: screen.width * 0.55, opacity: 0.7 }} />
                <Text style={styles.textHeader}>Claim Your Shop</Text>
                <Text style={styles.textBody}>
                    {`If the store listed on the website is yours, or
If you want your store to be listed on the website.

Email: `}
                    <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>business@localrecommends.com</Text>
                </Text>
                <Text style={styles.textHeader}>Business Support</Text>
                <Text style={styles.textBody}>
                    {`We can help your shop to reach more customers and generate more profit at ZERO cost.

Email: `}
                    <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>business@localrecommends.com</Text>
                </Text>
                <Text style={styles.textHeader}>Advertisement</Text>
                <Text style={styles.textBody}>
                    {`If your shop has interest to advertise on our website at S$0.

Email: `}
                    <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>business@localrecommends.com</Text>
                </Text>
                <View style={{ height: 100 }}></View>
            </ScrollView>
        )
    }
}

//make this component available to the app
export default BusinessScene


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