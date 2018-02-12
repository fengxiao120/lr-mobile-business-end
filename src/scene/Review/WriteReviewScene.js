import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, TextInput, Modal, Button,
    ScrollView, TouchableOpacity,
    ListView, Image, StatusBar, FlatList, ActivityIndicator, Platform, Linking, ViewPagerAndroid, KeyboardAvoidingView
} from 'react-native'
import { color, NavigationItem, RefreshListView, RefreshState, Separator, SpacingView, Album } from '../../widget'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CONFIG from '../../config'
import ReviewCell from '../Review/ReviewCell'
import { TagSelect } from 'react-native-tag-select';
import StarRating from 'react-native-star-rating'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import ReviewApi from '../../api/review'
import _ from 'lodash'
import Storage from '../../common/storage'
class WriteReviewScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Write Review',
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerRight: (
            <TouchableOpacity onPress={navigation.state.params.submit}>
                <Text style={{ backgroundColor: '#0abab5', color: 'white', padding: 5, marginRight: 10 }}>Submit</Text>
            </TouchableOpacity>
        )
    });

    constructor(props) {
        super(props)
        this.canLoadMore = true
        this.page = 2
        this.props.navigation.setParams({
            submit: this.submit.bind(this)
        })

        this.state = this.props.navigation.state.params.shop.currentReview || {}
    }

    async submit() {
        let data = this.state
        data.user = this.props.screenProps.user
        data.album = this.state.album || []
        data.shopId = this.props.navigation.state.params.shop.id
        data.recommendedProductIds = _.map(this.tags?this.tags.itemsSelected:[], (item) => { return item.id })
        Storage.set('review', data)
        let json = await ReviewApi.review(data)
        if (json.success) {
            this.props.navigation.state.params.callback()
            this.props.navigation.goBack()
            ___toast('Review Saved')
        }
    }

    updateRating(field, value) {
        let state = {}
        state[field] = value
        this.setState(state)
    }

    setAlbum(album) {
        this.setState({
            album: album
        })
    }

    render() {
        return (

            <KeyboardAwareScrollView style={{ backgroundColor: 'white', flex: 1 }} behavior="padding">
                <Text style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}>{this.props.navigation.state.params.shop.name}</Text>
                <View style={styles.container}>
                    <Text style={styles.ratingLabel}>Overall</Text>
                    <StarRating
                        maxStars={5}
                        starColor='#0abab5'
                        emptyStarColor='#0abab5'
                        starSize={30}
                        rating={this.state.score}
                        selectedStar={(value) => { this.updateRating('score', value) }}
                    />
                </View>
                <SpacingView height={1} />
                <View style={styles.container}>
                    <Text style={styles.ratingLabel}>Food</Text>
                    <StarRating
                        maxStars={5}
                        starColor='#0abab5'
                        emptyStarColor='#0abab5'
                        starSize={30}
                        rating={this.state.score1}
                        selectedStar={(value) => { this.updateRating('score1', value) }}
                    />
                </View>
                <View style={styles.container}>
                    <Text style={styles.ratingLabel}>Service</Text>
                    <StarRating
                        maxStars={5}
                        starColor='#0abab5'
                        emptyStarColor='#0abab5'
                        starSize={30}
                        rating={this.state.score2}
                        selectedStar={(value) => { this.updateRating('score2', value) }}
                    />
                </View>
                <View style={styles.container}>
                    <Text style={styles.ratingLabel}>Atmosphere</Text>
                    <StarRating
                        style={{ flex: 1 }}
                        maxStars={5}
                        starColor='#0abab5'
                        emptyStarColor='#0abab5'
                        starSize={30}
                        rating={this.state.score3}
                        selectedStar={(value) => { this.updateRating('score3', value) }}
                    />
                </View>
                <SpacingView height={3} />
                <TextInput
                    placeholder="Tell us more about the shop."
                    style={{ height: 150, padding: 10, fontSize: 16 }}
                    value={this.state.text}
                    onChangeText={(data) => { this.setState({ text: data }) }}
                    multiline={true}
                    underlineColorAndroid="transparent"
                />
                <SpacingView height={8} />
                <View style={styles.container}>
                    <Text style={{ fontSize: 16 }}>Cost Per Person  S$</Text>
                    <TextInput style={{ flex: 1, fontSize: 16 }} placeholder="Price" 
                    value={(this.state.costPerPerson ? this.state.costPerPerson : '') + ''} 
                    onChangeText={(data) => { this.setState({ costPerPerson: data }) }}
                    underlineColorAndroid="transparent"></TextInput>
                </View>
                <SpacingView height={8} />
                <View style={styles.container}>
                    <Album images={this.state.album} setAlbum={this.setAlbum.bind(this)}></Album>
                </View>
                <SpacingView height={8} />
                { 
                    this.props.navigation.state.params.shop.products && this.props.navigation.state.params.shop.products.length ?
                    (<View style={{flex:1}}>
                        <View style={styles.container}>
                            <Text style={{ fontSize: 16 }}>Recommended {this.props.navigation.state.params.shop.category.name == "Food" ?'Dishes':'Products'}:</Text>
                        </View>
                        <View style={styles.container}>
                            <TagSelect
                                data={this.props.navigation.state.params.shop.products}
                                labelAttr='name'
                                keyAttr='id'
                                itemStyle={styles.item}
                                itemLabelStyle={styles.label}
                                itemStyleSelected={styles.itemSelected}
                                itemLabelStyleSelected={styles.labelSelected}
                                ref={(tags) => {
                                    this.tags = tags;
                                }}
                                value={this.state.recommendedProducts}
                            />
                        </View>
                    </View>):null
                }
            </KeyboardAwareScrollView>

        )
    }
}

const styles = {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    ratingLabel: {
        width: 110,
        fontSize: 16,
        textAlign: 'right',
        marginRight: 10
    },
    buttonContainer: {
        padding: 15,
    },
    buttonInner: {
        marginBottom: 15,
    },
    labelText: {
        color: '#868686',
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 15,
    },
    item: {
        borderWidth: 1,
        borderColor: '#868686',
        backgroundColor: '#FFF',
    },
    label: {
        color: '#868686'
    },
    itemSelected: {
        borderColor: '#0abab5',
        backgroundColor: '#0abab5',
    },
    labelSelected: {
        color: '#FFF',
    },
}

export default WriteReviewScene;