import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert, Share, Platform } from 'react-native'
import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { screen } from '../../common'
import { color, Avatar } from '../../widget'
import CONFIG from '../../config'
import StarRating from 'react-native-star-rating'
import Moment from 'moment';
import _ from 'lodash'

import ImageGalleryCell from '../Home/ImageGalleryCell'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ReviewApi from '../../api/review'

class ReviewCell extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            votes: this.props.review.votes,
            voted: this.props.review.voted,
        }
    }

    componentWillReceiveProps = (props)=>{
        this.setState({votes:props.review.votes, voted:props.review.voted})
    }
    renderImageGalleryCell = (data: Object) => {
        return (
            <ImageGalleryCell
                pic={data.item}
                size={80}
            />
        )
    }
    share =()=>{
        let url = 'https://localrecommends.com/review?id=' + this.props.review.id
        Share.share({
            message: 'Review of ' + this.props.shop.name + ' by ' + this.props.review.user.nickName + (Platform.OS=='ios'?'':'\n'+url), 
            title: this.props.shop.name,
            url: url
        })   
    }
    report = (reason)=>{
        ReviewApi.report(this.props.user.nickName, this.props.user.username, this.props.review.id, this.props.review.text.slice(0,500), 
            this.props.review.user.nickName, this.props.review.user.id,  this.props.shop.id, this.props.shop.name, reason).then( (res)=>{
            if(res.success)
                if(reason=='Inappropriate content')
                    Alert.alert(
                        '',
                        "Hi, we've got your complaint. Our administrator will look into it as soon as possible and treat it with our best discretion. If our administrator confirms your report, we'll notify you in the notification center. Have a good day!",
                        [
                            {text:'OK'},
                        ],
                        { cancelable: true }
                    )
                else
                    Alert.alert(
                        '',
                        "Hi, we've got your complaint. However, for copyright issues or maclious reviews, we'll need more supporting material to take action. Please send anything that can backup your complaint along with the review id:"
                        + this.props.review.id
                        + " to report@localrecommends.com. After getting the supporting material our administrator will look into it as soon as possible and treat it with our best discretion. If our administrator confirms your report, we'll notify you in the notification center. Have a good day!",
                        [
                            {text:'OK'},
                        ],
                        { cancelable: true }
                    )                    
            else
                alert('Something went wrong. Error:' + res.error + ' - ' + res.message + '. Status: '+res.status)
        })
    }
    reportOnPress = ()=>{
        Alert.alert(
          'Report',
          'Reasons for report:',
          [
            {text: 'Copyright issues', onPress:()=>this.report( 'Copyright issues')},
            {text: 'Inappropriate content', onPress:()=>this.report('Inappropriate content')},
            {text: 'Malicious review', onPress:()=>this.report('Malicious review')},
            Platform.OS=='ios'?{text:'Cancel'}:null
          ],
          { cancelable: true }
        )            
    }
    moreOnPress = async ()=>{
        let loggedIn = await ___login(this.props.navigation, null, this.props.loginCallback)
        if (loggedIn)           
            Alert.alert(
              '',
              'Maybe you want to....',
              Platform.OS=='ios'?[
                {text: 'Report', onPress:this.reportOnPress},
                {text: 'Share', onPress:this.share},
                {text:'Cancel'}
              ]:[
                {text: 'Report', onPress:this.reportOnPress},
                {text: 'Share', onPress:this.share},
              ],
              { cancelable: true }
            )        
    }

    thumbOnPress = async ()=>{
        let loggedIn = await ___login(this.props.navigation, null, this.props.loginCallback)
        if (loggedIn)        
            ReviewApi.vote(this.props.review.id).then(res => {
                this.props.review.voted = res.data.voted
                this.props.review.votes = res.data.votes
                if(this.props.callback)
                    this.props.callback()
                this.setState({votes:res.data.votes, voted:res.data.voted})
            })       
    }

    render() {
        return (
            <View style={styles.container}>
                <Avatar picture={this.props.review.user.picture} />
                <View style={styles.rightContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 14 }}>{this.props.review.user.nickName.length <= 20 ? this.props.review.user.nickName : this.props.review.user.nickName.substring(0, 20) + '...'}&nbsp;
                        {
                                this.props.review.user.isLocal &&
                                <Text style={{ backgroundColor: '#0abab5', color: 'white', fontSize: 12, fontWeight: 'bold', }}>&nbsp;Local&nbsp;</Text>
                            }
                        </Text>
                        <Text style={{ color: '#868686', fontSize: 12 }}>{Moment(this.props.review.createdTime).format('DD MMM YYYY')}</Text>
                    </View>
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
                            <Text style={{ marginLeft: 2 }}>{this.props.review.score * 2}</Text>
                        </View>
                    </View>
                    {
                        this.props.full &&
                        <View style={{ flexDirection: 'row', paddingRight: 10, paddingBottom: 5 }}>
                            <Text style={{ color: '#868686', minWidth: 50 }}>Service: {this.props.review.score1 ? this.props.review.score1 * 2 : '-'}</Text>
                            <Text style={{ color: '#868686', minWidth: 50, marginLeft: 20 }}>{(this.props.shop.category && this.props.shop.category.name == "Food") ? "Food" : "Value"}: {this.props.review.score2 ? this.props.review.score2 * 2 : '-'}</Text>
                            <Text style={{ color: '#868686', minWidth: 100, marginLeft: 20 }}>{(this.props.shop.category && this.props.shop.category.name == "Food") ? "Atmosphere" : "Quality"}: {this.props.review.score3 ? this.props.review.score3 * 2 : '-'}</Text>
                        </View>
                    }
                    <Text numberOfLines={this.props.full ? 1000 : 2}>{this.props.review.text}</Text>
                    {this.props.review.price != null &&
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', }}>
                            <Text style={{ color: '#0abab5', fontSize: 14 }}>S${this.props.review.price}</Text>
                            <Text style={{ color: '#868686', fontSize: 12, textDecorationLine: "line-through" }}>S${this.props.review.originalPrice}</Text>
                        </View>
                    }
                    {
                        this.props.full && this.props.review.recommendedProducts && this.props.review.recommendedProducts.length > 0 &&
                        <Text style={{ color: '#868686', minWidth: 50, marginTop: 5 }}>Recommended {this.props.shop.category && this.props.shop.category.name == "Food" ? 'Dishes' : 'Products'}: {_.map(this.props.review.recommendedProducts, (item) => { return item.name }).join(",  ")}</Text>
                    }
                    {this.props.review.album.length > 0 &&
                        <FlatList
                            horizontal={true}
                            keyExtractor={(item, index) => index}
                            style={{ height: 80, marginTop: 5 }}
                            data={this.props.review.album}
                            renderItem={this.renderImageGalleryCell.bind(this)}
                        />
                    }
                
                    <View style={{height:40,flexDirection:'row-reverse',alignItems:'center',marginTop:5}}>
                        {this.props.full && 
                            <TouchableOpacity style={{width:screen.width*0.11, height:screen.width*0.09,
                                justifyContent:'center',
                                flexDirection:'row',alignItems:'center'}}
                                onPress={this.moreOnPress}>
                                <FontAwesome name={'ellipsis-h'} color={'#aaa'}  size={this.props.size||20}/>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity style={{width:screen.width*0.11, height:screen.width*0.09,
                            justifyContent:'center',
                            flexDirection:'row',alignItems:'center',marginRight:6}}
                            onPress={this.thumbOnPress}>
                            <FontAwesome name={'thumbs-o-up'} color={'#02aaa5'}  size={this.props.size||22}/>
                            <Text style={{marginLeft:3}}>{this.state.votes?this.state.votes:null}</Text>
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
        flexDirection: 'row',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,       
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',

    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    }
});

//make this component available to the app
export default ReviewCell;
