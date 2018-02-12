//import liraries
import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, Button,
    FlatList, Modal, Alert, ActivityIndicator
} from 'react-native'

import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { color, NavigationItem, RefreshListView, RefreshState, SpacingView } from '../../widget'
import { screen, system, tool } from '../../common'


import Storage from '../../common/storage'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import reviewApi from '../../api/review'
import ReviewCell from './ReviewCell'

import _ from 'lodash'



// create a component
class MyReviewsScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'My Reviews',
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerRight: (<View></View>)
    })

    constructor(props: Object) {
        super(props)
        this.state = {
            loading: false,
            reviews: [],
        }
        this.loading = true
        this.page = 1
        this.canLoadMore = true
        this.onEndReachedCalledDuringMomentum = true
        this.handleLoadMoreFirstTime = true
    }

    componentWillMount() {
        console.log('MyReviewsScene willmount is called again')
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.requestReviews()
    }

    async requestReviews() {
        this.loading = true
        try {
            let json = await reviewApi.listByUser(this.page)
            let reviews = json.data.reviews || []
            console.log(this.page + ' ' + reviews.length)
            this.page += 1
            if (reviews.length < 10)
                this.canLoadMore = false
            this.setState({ reviews: this.state.reviews.concat(reviews), loading:false })
            this.loading = false
        } catch (error) {
            console.log(error)
            this.loading = false
            this.setState({loading:false })
        }
    }

    editCallback = async (index)=>{
        this.setState({loading:true})
        let review = await Storage.get('review')
        this.state.reviews[index] = review
        this.setState({loading:false})
    }

    deleteCallback = (index)=>{
        Alert.alert(
          '',
          'Are you sure you want to delete this review?',
          [
            {text: 'Cancel'},
            {text: 'Yes', onPress: () => this.deleteReview(index)},
          ],
          { cancelable: true }
        )
    }

    deleteReview = (index)=>{
        this.setState({loading:true})
        reviewApi.delete(this.state.reviews[index].id).then((response)=>{
            if(response.success)
                this.setState({reviews:this.state.reviews.slice(0,index).concat(this.state.reviews.slice(index+1)), loading:false})
        })             
    }

    renderCell = (review: Object) => {
        return (
            <ReviewCell
                review={review.item}
                navigation={this.props.navigation}
                full={false}
                editCallback={()=>this.editCallback(review.index)}
                deleteCallback={()=>this.deleteCallback(review.index)}
            />
        )
    }

    handleLoadMore = () => {
        console.log('MyReviewsScene handleLoadMore is run')
        if (!this.loading && this.canLoadMore && !this.onEndReachedCalledDuringMomentum)
            this.requestReviews()
    }

    render() {
        console.log('My reviews render is called')

        if(!this.state.loading)
            return (
            <View>         
                <FlatList
                    data={this.state.reviews}
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
        else
            return (
                <View style={{ alignItems: 'center', marginTop: screen.width * 0.7 }}>
                    <ActivityIndicator size="large" color={color.theme} />
                </View>
            )
    }
}

//make this component available to the app
export default MyReviewsScene;


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
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