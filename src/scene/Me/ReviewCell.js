import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { screen } from '../../common'
import { color, Avatar } from '../../widget'
import CONFIG from '../../config'
import StarRating from 'react-native-star-rating'
import Moment from 'moment';
import _ from 'lodash'

import ImageGalleryCell from '../Shop/ImageGalleryCell'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Storage from '../../common/storage'

class ReviewCell extends PureComponent {
    constructor(props) {
        super(props)
        this.shop = {
            name: props.review.shop.name,
            products: props.review.shop.products,
            id: props.review.shop.id,
            currentReview: props.review,
        }
    }
    renderImageGalleryCell(data: Object) {
        return (
            <ImageGalleryCell
                pic={data.item}
                size={80}
            />
        )
    }

    editOnPress = () => {
        this.props.navigation.navigate('WriteReview', { shop: this.shop, review: this.props.review, callback: this.props.editCallback })
    }

    deleteOnPress = () => {
        this.props.deleteCallback()
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('Shop', { shop: this.props.review.shop })}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop:6, marginBottom:6 }}>{this.props.review.shop.name}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', marginTop: 5, paddingRight: 10, paddingBottom: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            starColor='#0abab5'
                            emptyStarColor='#0abab5'
                            starSize={16}
                            rating={this.props.review.score}
                        />
                        <Text style={{ marginLeft: 2, color: '#868686' }}>{this.props.review.score * 2}</Text>
                    </View>
                    <Text style={{ color: '#868686', marginLeft: 20 }}>S${this.props.review.costPerPerson ? this.props.review.costPerPerson : "-"}/person</Text>
                </View>

                <View style={{ flexDirection: 'row', paddingRight: 10, paddingBottom: 5 }}>
                    <Text style={{ color: '#868686', minWidth: 50 }}>Service: {this.props.review.score1 ? this.props.review.score1 * 2 : '-'}</Text>
                    <Text style={{ color: '#868686', minWidth: 50, marginLeft: 20 }}>{(this.props.review.shop.category && this.props.review.shop.category.name == "Food") ? "Food" : "Value"}: {this.props.review.score2 ? this.props.review.score2 * 2 : '-'}</Text>
                    <Text style={{ color: '#868686', minWidth: 100, marginLeft: 20 }}>{(this.props.review.shop.category && this.props.review.shop.category.name == "Food") ? "Atmosphere" : "Quality"}: {this.props.review.score3 ? this.props.review.score3 * 2 : '-'}</Text>
                </View>

                <Text numberOfLines={1000}>{this.props.review.text}</Text>
                {
                    this.props.review.recommendedProducts && this.props.review.recommendedProducts.length > 0 &&
                    <Text style={{ color: '#868686', minWidth: 50, marginTop: 5 }}>Recommended {this.props.review.shop.category && this.props.review.shop.category.name == "Food" ? 'Dishes' : 'Products'}: {_.map(this.props.review.recommendedProducts, (item) => { return item.name }).join(",  ")}</Text>
                }
                {
                    this.props.review.album.length > 0 &&
                    <FlatList
                        horizontal={true}
                        keyExtractor={(item, index) => index}
                        style={{ height: 80, marginTop: 5 }}
                        data={this.props.review.album}
                        renderItem={this.renderImageGalleryCell.bind(this)} />
                }
                <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
                    <Text style={{ color: '#868686', fontSize: 12, marginBottom:10, alignSelf:'flex-end'}}>{Moment(this.props.review.createdTime).format('DD MMM YYYY')}</Text>
                    <View style={{ height: 40, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{
                        width: screen.width * 0.11, height: screen.width * 0.09,
                        justifyContent: 'center', marginTop:2,
                        flexDirection: 'row', alignItems: 'center', marginRight: 10
                    }}
                        onPress={this.editOnPress}>
                        <FontAwesome name={'edit'} color={'#02aaa5'} size={this.props.size || 22} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        width: screen.width * 0.11, height: screen.width * 0.09,
                        justifyContent: 'center',
                        flexDirection: 'row', alignItems: 'center', marginRight: 10
                    }}
                        onPress={this.deleteOnPress}>
                        <FontAwesome name={'trash'} color={'#02aaa5'} size={this.props.size || 22} />
                    </TouchableOpacity>
                    </View>
                </View>
            </View >
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,

    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
});

//make this component available to the app
export default ReviewCell;
