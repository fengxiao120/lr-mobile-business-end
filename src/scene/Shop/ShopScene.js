import React, { PureComponent } from 'react'
import { color, Button, NavigationItem, RefreshListView, RefreshState, Separator, SpacingView } from '../../widget'
import call from 'react-native-phone-call'
import shopApi from '../../api/shop'
import {
    View, Text, StyleSheet, TextInput, Modal,
    ScrollView, TouchableOpacity, Share,
    ListView, Image, StatusBar, FlatList, ActivityIndicator, Platform, Linking
} from 'react-native'
import StarRating from 'react-native-star-rating'
import ImageGalleryCell from './ImageGalleryCell'
import OfferCell from '../Offer/OfferCell'
import ReviewCell from '../Review/ReviewCell'
import ProductCell from '../Product/ProductCell'
import _ from 'lodash'
import { screen, system } from '../../common'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { calcDistance } from '../../common/tool'
import ShopCell from './ShopCell'
import Gallery from 'react-native-image-gallery';
import CONFIG from '../../config'

class ShopScene extends PureComponent {

    constructor(props: Object) {

        super(props)

        this.state = {
            modalVisible: false,
            recommendations: [],
            shop: this.props.navigation.state.params.shop,
            gallaryIndex: 0,
            loading:false
        }

        this.props.navigation.setParams({
            favorite: this.favorite.bind(this),
            share: this.share.bind(this),
            favoriteIcon: 'heart-o'
        })

    }

    openExternalApp(url) {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log('Don\'t know how to open URI: ' + url);
            }
        });
    }


    openImagePreviewModal(gallaryIndex) {
        this.setState({ modalVisible: true, gallaryIndex: gallaryIndex });
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    componentDidMount() {
        this.requestData()
        this.requestRecommendations()
    }

    renderShopCell(shop: Object) {
        return (
            <ShopCell
                shop={shop.item}
                navigation={this.props.navigation}
            />
        )
    }

    renderImageGalleryCell(data: Object) {
        return (
            <ImageGalleryCell
                pic={data.item}
                onPress={() => this.openImagePreviewModal(data.index)
                }
            />
        )
    }

    renderOfferCell(data: Object) {
        return (
            <OfferCell
                offer={data.item}
                navigation={this.props.navigation}
            />
        )
    }

    reviewCellCallback = ()=>{
        this.setState({loading:true})
        this.setState({loading:false})
    }

    loginCallback = ()=>{
        this.requestData()   
    }

    renderReviewCell = (item, index) => {
        return (
            <ReviewCell
                key={index}
                review={item}
                full={false}
                navigation={this.props.navigation}
                loginCallback={this.loginCallback}
            />
        )
    }

    openingHours() {
        if (this.props.navigation)
            this.props.navigation.navigate('OpeningHours', { shopName: this.state.shop.name, openingHours: this.state.shop.openingHours })
    }

    product() {
        if (this.props.navigation)
            this.props.navigation.navigate('Product', { products: this.state.shop.products, title: this.state.shop.category && this.state.shop.category.name == "Food" ? 'Dishes' : 'Products' })
    }

    call(number) {
        if (number)
            call({ number: number, prompt: true }).catch(console.error)
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

    async requestData() {
        let json = await shopApi.get(this.state.shop.id)
        let shop = json.data
        shop.displayReviews = shop.reviews
        if (shop.reviews.length > 3)
            shop.displayReviews = shop.reviews[0, 3]
        this.setState({
            shop: shop
        })
        if (shop.favorite)
            this.props.navigation.setParams({
                favoriteIcon: 'heart'
            })
    }

    async review() {
        let loggedIn = await ___login(this.props.navigation)
        if (loggedIn)
            this.props.navigation.navigate('WriteReview', { shop: this.state.shop, callback: this.requestData.bind(this) })
    }

    async favorite() {
        let loggedIn = await ___login(this.props.navigation)
        if (loggedIn) {
            let json = await shopApi.favorite(this.state.shop.id)
            this.props.navigation.setParams({
                favoriteIcon: json.data.result ? 'heart' : 'heart-o'
            })
        }
    }

    async share() {
        let url = 'https://localrecommends.com/shop?id=' + this.state.shop.id
        Share.share({
            message: this.state.shop.name + (Platform.OS === 'ios' ?'':'\n'+url),
            title: this.state.shop.name,
            url: url
        })
    }

    openGps() {
        var coor = this.state.shop.coordinateX + ',' + this.state.shop.coordinateY
        if (Linking.canOpenURL('http://maps.google.com/maps?daddr=' + coor))
            Linking.openURL('http://maps.google.com/maps?daddr=' + coor)
        else
            Linking.openURL('http://maps.apple.com/maps?daddr=' + coor)
    }

    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: 'white' },
        headerRight: (
            <View style={{ flexDirection: 'row' }}>
                <NavigationItem
                    icon={'share'}
                    color={'#0abab5'}
                    size={20}
                    style={{ alignSelf: 'center', marginRight: 20 }}
                    onPress={navigation.state.params.share}
                />
                <NavigationItem
                    icon={navigation.state.params.favoriteIcon || 'heart-o'}
                    color={'#0abab5'}
                    size={20}
                    style={{ alignSelf: 'center', marginRight: 20 }}
                    onPress={navigation.state.params.favorite}
                />
            </View>
        ),
    });

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    visible={this.state.modalVisible}
                    animationType={'fade'}
                    onRequestClose={() => this.closeModal()}
                >
                    <Gallery
                        style={{ position: 'absolute', flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}
                        initialPage={this.state.gallaryIndex}
                        images={
                            _.map(this.state.shop.album, (item) => {
                                return { source: { uri: CONFIG.IMAGE_HOST + item.uuid } }
                            })
                        }
                    >
                    </Gallery>
                    <TouchableOpacity
                        style={{ position: 'absolute', width: 60, height: 60, left: 10, top: 30 }}
                        onPress={() => {
                            this.closeModal()
                        }}>
                        <Text
                            style={{ fontSize: 30, backgroundColor: 'rgba(0,0,0,0)' }} >
                            <FontAwesome name={'close'} color={'#0abab5'} size={26} />
                        </Text>
                    </TouchableOpacity>
                </Modal>
                <ScrollView style={{ backgroundColor: "white" }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10 }}>{this.state.shop.name}</Text>
                    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingBottom: 5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 2 }}>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    starColor='#0abab5'
                                    emptyStarColor='#0abab5'
                                    starSize={16}
                                    rating={this.state.shop.score ? this.state.shop.score.toFixed(1) / 2 : 0}
                                />
                            </View>
                            <Text style={{ color: '#868686', marginLeft: 2 }}>{this.state.shop.score ? this.state.shop.score.toFixed(1) : '-'}</Text>
                        </View>
                        <Text style={{ color: '#868686', minWidth: 50, marginLeft: 20 }}>{this.state.shop.totalReviews || '0'} reviews</Text>
                        <Text style={{ color: '#868686', minWidth: 100, marginLeft: 20 }}>S${this.state.shop.avgCostPerPerson ? this.state.shop.avgCostPerPerson.toFixed(1) : "-"}/person</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingBottom: 5 }}>
                        <Text style={{ color: '#868686', minWidth: 50 }}>Service: {this.state.shop.score1 ? this.state.shop.score1.toFixed(1) : '-'}</Text>
                        <Text style={{ color: '#868686', minWidth: 50, marginLeft: 20 }}>{(this.state.shop.category && this.state.shop.category.name == "Food") ? "Food" : "Value"}: {this.state.shop.score2 ? this.state.shop.score2.toFixed(1) : '-'}</Text>
                        <Text style={{ color: '#868686', minWidth: 100, marginLeft: 20 }}>{(this.state.shop.category && this.state.shop.category.name == "Food") ? "Atmosphere" : "Quality"}: {this.state.shop.score3 ? this.state.shop.score3.toFixed(1) : '-'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingBottom: 5 }}>
                        <Text style={{ color: '#868686', minWidth: 50, flex: 1 }}>{(_.map(this.state.shop.subCategories, 'name')).join(", ")}</Text>
                        <Text style={{ color: '#868686', minWidth: 200 }}>{this.state.shop.district && this.state.shop.district.join(", ")}</Text>
                    </View>
                    <FlatList
                        horizontal={true}
                        keyExtractor={(item, index) => index}
                        style={{ height: 120, marginBottom: 10, paddingLeft: 10 }}
                        data={this.state.shop.album}
                        renderItem={this.renderImageGalleryCell.bind(this)}
                    />
                    <SpacingView height={3} />
                    <View style={{ flexDirection: 'row', minHeight: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingBottom: 5, paddingTop: 5 }}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={this.openGps.bind(this)}>
                            <Text
                                style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0)' }} >
                                <FontAwesome name={'map-marker'} color={'#0abab5'} size={20} />
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 14, }} onPress={this.openGps.bind(this)}>
                            <Text style={{ fontSize: 14 }}>{this.state.shop.address}</Text>
                        </TouchableOpacity>
                        <Text style={{ flex: 1, fontSize: 20, color: "#868686", fontWeight: '100' }}>|</Text>
                        <TouchableOpacity style={{ alignItems: 'center', flex: 1.5, paddingRight: 10 }} onPress={() => { this.call(this.state.shop.mobile) }}>
                            <Text
                                style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0)' }} >
                                <FontAwesome name={'phone'} color={'#0abab5'} size={20} />
                            </Text>
                            <Text style={{ fontSize: 13 }}>Call</Text>
                        </TouchableOpacity>
                    </View>
                    <SpacingView height={3} />
                    <TouchableOpacity onPress={this.openingHours.bind(this)} style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5 }}>
                        <NavigationItem
                            icon={'clock-o'}
                            color={'#0abab5'}
                            size={17}
                            style={{ marginRight: 0, flex: 1 }}
                        />
                        <Text style={{ flex: 13, fontSize: 14 }}>Opening Hours</Text>
                        <Text
                            style={{ fontSize: 15 }} >
                            <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                        </Text>
                    </TouchableOpacity>
                    {
                        this.state.shop.offers && this.state.shop.offers.length > 0 &&
                        <View>
                            <SpacingView height={8} />
                            <View style={{ paddingTop: 10, paddingLeft: 10, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 1 }}>Offers</Text>
                            </View>
                            <FlatList
                                keyExtractor={(item, index) => index}
                                scrollEnabled={false}
                                data={this.state.shop.offers}
                                renderItem={this.renderOfferCell.bind(this)}
                            />
                        </View>
                    }

                    {
                        this.state.shop.products && this.state.shop.products.length > 0 &&
                        <TouchableOpacity onPress={this.product.bind(this)}>
                            <SpacingView height={3} />
                            <View style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 14 }}>Recommended {this.state.shop.category && this.state.shop.category.name == "Food" ? 'Dishes' : 'Products'}</Text>
                                <Text
                                    style={{ fontSize: 15 }} >
                                    <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                                </Text>
                            </View>
                            <View style={{ padding: 10, flexDirection: 'row' }}>
                                {
                                    _.filter(this.state.shop.products, (product) => {
                                        return product.album.length > 0
                                    }).slice(0, 3).map(function (product) {
                                        return <ProductCell key={product.id} product={product}></ProductCell>
                                    })
                                }
                            </View>
                            <View style={{ margin: 10, flexDirection: 'row', flexWrap: 'wrap', maxHeight: 40, overflow: 'hidden' }}>
                                {this.state.shop.products.map(function (product) {
                                    if (product.album.length == 0)
                                        return <Text numberOfLines={2} style={{ height: 20, fontSize: 14, marginRight: 20 }} key={product.id}>{product.name}</Text>
                                })
                                }
                            </View>
                        </TouchableOpacity>
                    }
                    <SpacingView height={8} />
                    <View>
                        <TouchableOpacity style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }} onPress={() => {
                            if (this.props.navigation)
                                this.props.navigation.navigate('Review', { reviews: this.state.shop.reviews, shop: this.state.shop, callback:this.reviewCellCallback })
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 14 }}>Reviews({this.state.shop.totalReviews})</Text>
                            <Text
                                style={{ fontSize: 15 }} >
                                <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                            </Text>
                        </TouchableOpacity>
                        <SpacingView height={3} backgroundColor={'white'} />
                        {
                            this.state.shop.reviews && this.state.shop.reviews.length == 0 &&
                            <Text style={{ fontSize: 16, color: '#0abab5', marginTop: 5, paddingLeft: 10, marginBottom: 10 }}>Be the first to review!</Text>

                        }
                        { 
                            this.state.shop.reviews && this.state.shop.reviews.map((item, index)=>{
                                if(index<3)
                                    return this.renderReviewCell(item, index)
                            })
                        }
                    </View>
                    <SpacingView height={8} />
                    <View>
                        <Text style={{ padding: 10, fontSize: 16, fontWeight: 'bold', }}>Recommendations</Text>
                        <FlatList
                            keyExtractor={(item, index) => index}
                            scrollEnabled={false}
                            data={this.state.recommendations}
                            renderItem={this.renderShopCell.bind(this)}
                        />
                    </View>
                </ScrollView >
                <TouchableOpacity onPress={this.review.bind(this)} style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center", height: 50, backgroundColor: "#0abab5" }}><Text style={{ color: 'white', marginTop: 2, marginRight: 6 }}> <FontAwesome name={'edit'} style={{ fontSize: 18 }} /></Text><Text style={{ color: 'white', textAlign: "center", fontSize: 18, fontWeight: 'bold' }} >REVIEW</Text></TouchableOpacity>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'grey',
    },
    innerContainer: {
        alignItems: 'center',
    },
});


export default ShopScene;