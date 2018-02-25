//import liraries
import React, { PureComponent } from 'react'
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native'

import { color, NavigationItem, SpacingView } from '../../widget'
import { screen, system, tool } from '../../common'
import { calcDistance } from '../../common/tool'
import Storage from '../../common/storage'

import OfferCell from './OfferCell'

import _ from 'lodash'

// create a component
class MyOffers extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: (
            "My Offers"
        ),
        headerLeft: (<View style={{ flexDirection: 'row' }}>
                <NavigationItem
                    icon={'plus-circle'}
                    color={'white'}
                    size={24}
                    style={{ alignSelf: 'center', marginLeft: 15 }}
                    onPress={()=>alert('New offer: to do!')}
                />
            </View>),
        headerRight: (<View></View>),
    })

    constructor(props: Object) {
        super(props)
        this.state = {
            loading: false, //For overall spinner
            offers: [],
        }
    }

    componentWillReceiveProps = (props) => {
        console.log('Wishlist componentWillReceiveProps is called')
        if(__offers.length)
            this.setState({offers:__offers})
    }

    renderCell = (offer: Object) => {
        return (
            <OfferCell
                offer={offer.item}
            />
        )
    }



    render() {
        return (
            <View>
            {
                this.state.offers.length == 0 &&
                <View style={{height:300,justifyContent:'center', alignItems: 'center',}}>
                    <Text style={{ marginTop: screen.width * 0.4, fontSize: 32, textAlign: 'center', color: '#ccc' }}>No offers</Text>
                </View>
            }
                <FlatList
                    data={this.state.offers}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderCell}                        
                />
            </View>
        )         
        

    }
}

//make this component available to the app
export default MyOffers;


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    }
});