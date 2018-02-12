import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, TextInput, Modal, BackHandler,
    ScrollView, TouchableOpacity,
    ListView, Image, StatusBar, FlatList, ActivityIndicator, Platform, Linking, ViewPagerAndroid
} from 'react-native'
import { color, Button, NavigationItem, RefreshListView, RefreshState, Separator, SpacingView} from '../../widget'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CONFIG from '../../config'
import ReviewCell from '../Review/ReviewCell'
import ReviewApi from '../../api/review'

import Storage from '../../common/storage'
import _ from 'lodash'

class ReviewScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Reviews',
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerRight: (<View></View>)
    });

    constructor(props) {
        super(props)
        this.canLoadMore = true
        this.page = 2
        this.state = {
            loading:false,
            reviews: this.props.navigation.state.params.reviews
        }
    }

    renderReviewCell = (data: Object) => {
        return (
            <ReviewCell
                review={data.item}
                shop={this.props.navigation.state.params.shop}
                full={true}
                user={this.props.screenProps.user}
                navigation={this.props.navigation}
            />
        )
    }

    handleLoadMore = async (fresh) => {
        if (!this.loading && this.canLoadMore) {
            this.loading = true
            this.setState({loading:true})
            let json = await ReviewApi.list(this.props.navigation.state.params.shop.id, this.page)
            let newReviews = json.data
            if(fresh){
                let review = _.find(newReviews, item => {
                    return item.user.id = this.props.screenProps.user.id
                })
                if(review)
                    this.props.navigation.state.params.shop.currentReview = review
            }
            if (newReviews.length < 10)
                this.canLoadMore = false
            this.setState({ reviews: this.state.reviews.concat(newReviews), loading:false })
            this.page++
            this.loading = false
        }
    }

    render() {
        return (
        <View style={{flex:1}}>
        <FlatList
            keyExtractor={(item, index) => index}
            data={this.state.reviews}
            renderItem={this.renderReviewCell}
            onEndReached={this.handleLoadMore}
            onEndThreshold={12}
        />   
        </View>)
    }


}
export default ReviewScene;