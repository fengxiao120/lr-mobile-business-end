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
class RecommendScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Recommend To Us!',
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
                <Image source={require('../../img/Me/recommend.jpg')} style={{ width: screen.width, height: screen.width * 0.55, opacity: 0.7 }} />

                <Text style={styles.textBody}>
                    {`
Got any shop/restuarnt that you think didn't get the attention it derserves and you'd like to share with the rest of us?

Please send us via

`}
                    <Text style={{textDecorationLine: 'underline'}}>recommend@localrecommends.com</Text>
                    {'\n\nwith the following details:\n\n'}
                    <Text style={{ color: '#0ABAB5' }}>Shop Name</Text>
                    {'\n\n'}
                    and its main <Text style={{ color: '#0ABAB5' }}>focus of business</Text>, e.g. a Brazilian Barbecue restaurant
                    {'\n\n'}
                    Its <Text style={{ color: '#0ABAB5' }}>address</Text> and <Text style={{ color: '#0ABAB5' }}>contact number</Text>
                    {'\n\n'}
                    To have its <Text style={{ color: '#0ABAB5' }}>opening hours</Text> would be nice
                    {'\n\n'}
                    If possible, some pictures to showcase its environment or main feature service or product.
                    {'\n\n'}
                    Thank you!
                </Text>
                <View style={{ height: 100 }}></View>
            </ScrollView>
        )
    }
}

//make this component available to the app
export default RecommendScene

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

});