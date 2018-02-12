//import liraries
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native'

import { color, NavigationItem, SpacingView } from '../../widget'
import { screen, system, tool } from '../../common'
import { calcDistance } from '../../common/tool'

import Storage from '../../common/storage'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import shopApi from '../../api/shop'
import ShopCell from '../Shop/ShopCell'

import _ from 'lodash'



// create a component
class RecentScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Recent Views',
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerRight: (<View></View>)
    })

    constructor(props: Object) {
        super(props)
        this.state = {
            shops:{},
        }
    }

    componentWillMount() {
        console.log('RecentScene willmount is called again')
    }

    componentDidMount(){
        this.requestShops()
    }


    async requestShops() {
        try {
            let json = await shopApi.getRecentViewedShops()
            let shops = json.data || []
            _.each(shops, (shop) => {
                shop.distance = calcDistance(shop.coordinateX, shop.coordinateY, true)
            })               
            this.setState({shops:shops}) 
        } catch (error) {
            console.log(error)
        }
    }

    renderCell = (shop: Object) => {
        return (
            <ShopCell
                shop={shop.item}
                navigation={this.props.navigation}
            />
        )
    }

    render() {      
        console.log('recent view render is called')
        if(this.state.shops.length)
            return (
            <View>
                <FlatList
                    data={this.state.shops}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderCell}
                />
            </View>
            )
        else
            return(
                <View style={{marginTop:screen.width*0.6}}>
                    <ActivityIndicator size='large' color={color.theme}/>
                </View>      
            )
    }
}

//make this component available to the app
export default RecentScene;


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },  
});