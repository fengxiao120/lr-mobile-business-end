
//import liraries
import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    FlatList, ListView, Image, TextInput, Picker, Alert, ActivityIndicator
} from 'react-native'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Storage from '../../common/storage'
import categoryApi from '../../api/category'
import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { color, Button, NavigationItem, RefreshListView, RefreshState, SpacingView, Filters } from '../../widget'
import { screen, system, tool } from '../../common'
import { calcDistance } from '../../common/tool'
import shopApi from '../../api/shop'
import filterApi from '../../api/filter'
import ListCell from './ListCell'
import ShopCell from '../Shop/ShopCell'
import _ from 'lodash'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DropdownView from "./DropdownView";


// create a component
class ListScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: (
            <TouchableOpacity style={styles.searchBar}>
                <Image source={require('../../img/Home/search_icon.png')} style={styles.searchIcon} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, }}>
                    <TextInput onChangeText={(text) => {
                        navigation.setParams({ keyword: text })
                    }}
                        ref={input => { navigation.___textInput = input }}
                        onSubmitEditing={() => {
                            navigation.state.params.search()
                        }
                        } style={{ fontSize: 14, flex: 1, height: 40 }} value={navigation.state.params.keyword} placeholder='Search for shop name or area' underlineColorAndroid="transparent"></TextInput>
                    <TouchableOpacity onPress={() => {
                        navigation.___textInput.clear()
                    }}>
                        <Text
                            style={{ fontSize: 15, backgroundColor: "rgba(0,0,0,0)", paddingRight: 10 }} >
                            <FontAwesome name={'times-circle'} color={'#CCCCCC'} size={16} />
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        ),
        headerRight: (
            <NavigationItem
                icon={'bell'}
                color={color.theme}
                size={20}
                style={{ alignSelf: 'center', marginRight: screen.width / 18 }}
                onPress={() => {
                    navigation.navigate('Notification')
                }}
            />
        ),
        headerStyle: { backgroundColor: 'white' },
    })

    constructor(props: Object) {
        super(props)
        this.state = {
            districtOptions: {},
            categories: [],
            recommendations: [],
            shops: []
        }
        this.props.navigation.setParams({
            search: this.search.bind(this)
        })
        this.page = 1
        this.categoryId = this.props.navigation.state.params.categoryId || null
    }

    componentDidMount() {
        this.requestAreas()
        this.requestCategory()
        this.requestShops()
        this.requestRecommendations()
    }

    search() {
        this.requestShops(true)
    }

    async requestCategory() {
        try {
            let json = await categoryApi.list()
            let categories = json.data
            _.each(categories, (item) => {
                item.subs = _.map(item.subCategories, (item) => { return item.name })
                item.subs.unshift("All")
                if (item.id == this.categoryId)
                    item.selected = true
            })
            this.setState({ categories: categories })
        } catch (error) {
            console.log(error)
        }
    }

    async requestRecommendations() {
        let json = await shopApi.appHomeList({ categoryNames: ['Food', 'Leisure', 'Beauty'], existingIds: [] })
        let shops = json.data || []
        _.each(shops, (shop) => {
            shop.distance = calcDistance(shop.coordinateX, shop.coordinateY, true)
        })
        this.setState({
            recommendations: shops
        })
    }

    async requestAreas() {
        let districtOptions = await Storage.get('district_options')
        if (!districtOptions) {
            let res = await filterApi.getList()
            let filtersData = res.data;
            let data = _.find(filtersData, item => {
                return item.name == "District";
            }).options
            districtOptions = {}
            _.each(data, (item) => {
                _.each(item.groupNames, (groupName) => {
                    if (!districtOptions[groupName])
                        districtOptions[groupName] = []
                    districtOptions[groupName].push(item.name)
                })
            })
            for (var key in districtOptions) {
                districtOptions[key].unshift('All')
            }
            Storage.set('district_options', districtOptions)
        }
        this.setState({
            districtOptions: districtOptions
        })
    }
    async requestShops(reset) {
        if (this.loading)
            return
        this.loading = true
        this.setState({ loading: true })
        if (reset) {
            this.page = 1
            this.setState({ shops: [] })
        }
        try {
            let requestBody = {
                page: this.page,
                keyword: this.props.navigation.state.params.keyword,
                categoryId: this.categoryId,
                sub: this.subs || [],
                district: this.areas || [],
                orderBy: this.ranking,
                order: this.order,
                distance: this.distance,
                X: ___location && ___location.coords.latitude,
                Y: ___location && ___location.coords.longitude
            }
            // console.log(requestBody)
            let json = await shopApi.customerFilter(requestBody)
            // console.log(json)
            let shops = json.data.shops || []

            this.page++;
            this.canLoadMore = (shops.length == 10)
            let current = this.state.shops
            if (reset)
                current = []
            _.each(shops, (shop) => {
                let exist = _.find(current, (item) => { return item.id == shop.id })
                if (!exist) {
                    shop.distance = calcDistance(shop.coordinateX, shop.coordinateY, true)
                    if (!this.distance || parseFloat(shop.distance.slice(0, -2)) < this.distance)
                        current.push(shop)
                }
            })
            this.loading = false
            this.setState({ shops: current, loading: false})
        } catch (error) {
            console.log(error)
            this.loading = false
        }
    }

    async handleLoadMore() {
        if (this.canLoadMore)
            this.requestShops()
    }


    filterCallback(params) {
        this.categoryId = null
        if (params.selectedCategoryL1) {
            this.categoryId = _.find(this.state.categories, (item) => { return item.name == params.selectedCategoryL1 }).id
        }
        this.subs = []
        if (params.selectedSub && params.selectedSub != "All") {
            this.subs.push(params.selectedSub)
        }
        this.areas = []
        if (params.selectedDistrict) {
            if (params.selectedDistrict != "All")
                this.areas.push(params.selectedDistrict)
            else
                this.areas = this.state.districtOptions[params.selectedAreaL1]
        }
        this.ranking = null
        this.order = null
        if (params.selectedRanking) {
            switch (params.selectedRanking) {
                case 'Score':
                    this.ranking = "score"
                    this.order = "desc"
                    break;
                case 'Popularity':
                    this.ranking = "click"
                    this.order = "desc"
                    break;
                case 'Most Reviewed':
                    this.ranking = "reviewCount"
                    this.order = "desc"
                    break;
                case 'Price high to low':
                    this.ranking = "avgCostPerPerson"
                    this.order = "desc"
                    break;
                case 'Price low to high':
                    this.ranking = "avgCostPerPerson"
                    this.order = "asc"
                    break;
            }
        }
        this.distance = null
        if (params.selectedDistance) {
            switch (params.selectedDistance) {
                case '<1km':
                    this.distance = 1
                    break;
                case '<3km':
                    this.distance = 3
                    break;
                case '<5km':
                    this.distance = 5
                    break;
                case '<10km':
                    this.distance = 10
                    break;
            }
        }
        this.requestShops(true)
    }

    onCellSelected(shop: Object) {
        if (this.props.navigation)
            this.props.navigation.navigate('Shop', { shop: shop })
    }


    renderShop(shop: Object) {
        return (
            <ListCell
                shop={shop.item}
                index={shop.index}
                navigation={this.props.navigation}
            />
        )
    }

    renderContent = () => {
        return (
            <TouchableOpacity >
                <Text style={styles.text}>index:{this.state.index} subindex:{this.state.subindex} title:{this.state.data.title}</Text>
            </TouchableOpacity>
        );
        // alert(this.state.data.title)
    }


    renderShopCell(shop: Object) {
        return (
            <ShopCell
                shop={shop.item}
                navigation={this.props.navigation}
            />
        )
    }


    onSelectMenu = (index, subindex, data) => {
        this.setState({ index, subindex, data });
    }//Not in use

    onSelected = () => {

    }

    render() {
        return (
            <View style={styles.container}>
                <Filters districtOptions={this.state.districtOptions} categories={this.state.categories} callback={this.filterCallback.bind(this)}></Filters>
                <View style={{ height: 50 }}></View>
                {
                    this.state.shops.length == 0 && this.state.loading &&
                    <View style={{height:300,justifyContent:'center', alignItems: 'center',}}>
                        <ActivityIndicator size="large" color={color.theme} />
                    </View>
                }
                {
                    this.state.shops.length != 0 &&
                    <FlatList
                        keyExtractor={(item, index) => index}
                        data={this.state.shops}
                        renderItem={this.renderShop.bind(this)}
                        onEndReached={this.handleLoadMore.bind(this)}
                    />
                }
                {
                    this.state.shops.length == 0 && !this.state.loading &&
                    < View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: "#868686" }}>Sorry, no result found</Text>

                    </View>
                }
                {
                    this.state.shops.length == 0 && !this.state.loading &&
                    <ScrollView style={{ flex: 1 }}>
                        <Text style={{ padding: 10, fontSize: 16, color: "#0ABAB5", backgroundColor: "white", textAlign: "center" }}>Recommendations</Text>
                        <SpacingView height={1} />
                        <FlatList
                            keyExtractor={(item, index) => index}
                            scrollEnabled={false}
                            data={this.state.recommendations}
                            renderItem={this.renderShopCell.bind(this)}
                        />
                    </ScrollView>
                }
            </View >

        );
    }
}

//make this component available to the app
export default ListScene;


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
    recommendHeader: {
        height: 35,
        justifyContent: 'center',
        borderWidth: screen.onePixel,
        borderColor: color.border,
        paddingVertical: 8,
        backgroundColor: 'white'
    },
    searchBar: {
        width: screen.width * 0.7,
        height: 30,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: 3,
        alignItems: 'center',
        backgroundColor: color.background,
        alignSelf: 'center',
    },
    searchIcon: {
        marginLeft: 10,
        marginRight: 5,
        width: 14,
        height: 14,
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
});