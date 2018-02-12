//import liraries
import React, { PureComponent } from 'react'
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native'

import { color, NavigationItem, SpacingView } from '../../widget'
import { screen, system, tool } from '../../common'
import { calcDistance } from '../../common/tool'
import Storage from '../../common/storage'

import shopApi from '../../api/shop'

import ShopCell from '../Home/ShopCell'

import _ from 'lodash'

// create a component
class Wishlist extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: (
            "My Offers"
        ),
        headerLeft: (<View></View>),
        headerRight: (<View></View>),
    })

    constructor(props: Object) {
        super(props)
        this.state = {
            loading: false, //For overall spinner
            shops: [],
        }
        this.loading = false
        this.page = 1
        this.canLoadMore = true
        this.loaded = false
        this.onEndReachedCalledDuringMomentum = true
        this.handleLoadMoreFirstTime = true
        this.user = null
    }

    componentDidMount = async () => {
        this.user = await Storage.get('user')
        console.log('Wishlist componentDidMount is called')
    }

    componentWillReceiveProps = (props) => {
        console.log('Wishlist componentWillReceiveProps is called')
        if(this.user && !this.loaded){
            this.loaded = true
            this.setState({ loading: true })
            this.requestShops()            
        }

    }

    async requestShops() {
        console.log('Wishlist requestShops is called')
        this.loading = true
        try {
            let json = await shopApi.findUserFavorite(this.page)
            let shops = json.data || []
            this.page++
            console.log(this.page-1+' '+shops.length)
            if (shops.length < 10)
                this.canLoadMore = false
            _.each(shops, (shop) => {
                shop.distance = calcDistance(shop.coordinateX, shop.coordinateY, true)
            })
            this.loading = false
            this.setState({ shops: this.state.shops.concat(shops), loading:false })
        } catch (error) {
            console.log(error)
            this.loading = false
        }
    }

    handleLoadMore = () => {
        console.log('Wishlist handleLoadMore is called')
        if (!this.loading && this.canLoadMore && !this.onEndReachedCalledDuringMomentum) {
            this.requestShops()
        }
    }

    deleteCallback = (index) => {
        shopApi.favorite(this.state.shops[index].id).then((response) => {
            if (response.success)
                this.setState({ shops: this.state.shops.slice(0, index).concat(this.state.shops.slice(index + 1))})
        })
    }

    renderCell = (shop: Object) => {
        return (
            <ShopCell
                shop={shop.item}
                navigation={this.props.navigation}
                showDelete={true}
                deleteCallback={() => this.deleteCallback(shop.index)}
            />
        )
    }

    render() {
        return (
            <View>
              {
                this.state.shops.length == 0 && this.state.loading &&
                <View style={{height:300,justifyContent:'center', alignItems: 'center',}}>
                    <ActivityIndicator size="large" color={color.theme} />
                </View>
            }
                <FlatList
                    data={this.state.shops}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderCell}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={3}
                    onMomentumScrollBegin={() => { 
                        this.onEndReachedCalledDuringMomentum = false
                        if(this.handleLoadMoreFirstTime){
                            this.handleLoadMoreFirstTime = false
                            this.handleLoadMore()   
                        }
                    }}                           
                />
            </View>
        )         
        

    }
}

//make this component available to the app
export default Wishlist;


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    }
});