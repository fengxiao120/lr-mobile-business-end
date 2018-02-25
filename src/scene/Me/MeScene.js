

//import liraries
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native'

import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { screen, system, tool } from '../../common'
import { color, NavigationItem, SpacingView, LRSpinner } from '../../widget'
import MeSceneCell from './MeSceneCell'
import CONFIG from '../../config'
import Storage from '../../common/storage'
import Bus from '../../common/bus'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import shopApi from '../../api/shop'
// create a component
class MeScene extends PureComponent {

    static navigationOptions = {
        headerStyle: {
            shadowOpacity: 0,
            elevation: 0,
            borderBottom: 'none',
            backgroundColor: color.theme
        }
    }

    constructor(props: Object) {
        super(props)

        this.state = {
            loading: false,
        }
        this.editProfileImage = this.editProfileImage.bind(this)
    }

    componentWillMount() {
        this.getUser()
        let ref = this
        Bus.addListener('USER_UPDATED', () => {
            ref.getUser()
        });
    }

    componentDidMount() {
        this.setState({loading:true})
        this.requestData()
    }

    async requestData() {
        let json = await shopApi.get(378) //Dummy data
        let shop = json.data
        __shop = shop
        __offers = shop.offers
        this.setState({
            loading:false,
        })        
    }    

    async getUser() {
        let user = await Storage.get("user")
        this.setState({ user: user })
    }

    componentWillReceiveProps(props) {
        this.getUser()
    }

    editProfileImage() {
        this.props.navigation.navigate('EditProfileImage', {
            callback: (user) => {
                this.setState({ user: user })
            }
        })
    }

    renderHeader = () => {
        return (
            <View style={styles.header}>
                <Text style={{textAlign:'center', color:'white', fontSize:16, height:56, textAlignVertical:'center'}}>{__shop.name}</Text>
                <View style={{flexDirection:'row', marginTop:20}}>
                    <TouchableOpacity style={{width:screen.width*0.25, alignItems:'center',}}>
                        <FontAwesome name={'barcode'} color={'white'} size={30} />
                        <Text style={{color:'white',}}>Scan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:screen.width*0.25, alignItems:'center',}}>
                        <FontAwesome name={'keyboard-o'} color={'white'} size={30} />
                        <Text style={{color:'white',}}>Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:screen.width*0.25, alignItems:'center',}}>
                        <FontAwesome name={'cart-arrow-down'} color={'white'} size={30} />
                        <Text style={{color:'white',}}>Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:screen.width*0.25, alignItems:'center',}}>
                        <FontAwesome name={'history'} color={'white'} size={30} />
                        <Text style={{color:'white',}}>Transcation</Text>
                    </TouchableOpacity>                                                            
                </View>
            </View>
        )
    }

    onCellSelected = (destination) => {
        this.props.navigation.navigate(destination)
    }

    renderCells = () => {
        let cells = []
        let dataList = this.getDataList()
        for (let i = 0; i < dataList.length; i++) {
            let sublist = dataList[i]
            for (let j = 0; j < sublist.length; j++) {
                let data = sublist[j]
                let cell = <MeSceneCell icon={data.icon} color='#666' title={data.title}
                    onPress={this.onCellSelected} goTo={data.goTo} size={data.smallerIcon?20:24}
                    key={data.title} iconStyle={{ width: 36 }} />
                cells.push(cell)
                if (j < sublist.length - 1)
                    cells.push(<SpacingView key={i + '_' + j} height={1} />)
            }
            if (i < dataList.length - 1)
                cells.push(<SpacingView key={i} height={1} />)
        }

        return (
            <View style={{ flex: 1 }}>
                {cells}
            </View>
        )
    }

    render() {
        if(this.state.loading)
            return ( <View style={{height:300,justifyContent:'center', alignItems: 'center',}}>
                    <ActivityIndicator size="large" color={color.theme} />
                </View>)

        else
            return (
                <ScrollView style={{ flex: 1, backgroundColor: 'transparent', width: screen.width, height: screen.width * 1.5 }}>
                    {this.renderHeader()}
                    <View style={{flexDirection:'row', backgroundColor:'white', paddingTop:10, paddingBottom:10, marginBottom:10}}>
                        <TouchableOpacity style={{width:screen.width*0.5, borderRightColor:'#ccc', borderRightWidth:0.2, justifyContent:'center', alignItems: 'center',}}>
                            <Text style={{fontSize:16}}>$800</Text>
                            <Text style={{color:'#aaa', fontSize:12,}}>Revenue Today</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:screen.width*0.5, justifyContent:'center', alignItems: 'center',}}>
                            <Text style={{fontSize:16}}>$8000</Text>
                            <Text style={{color:'#aaa', fontSize:12,}}>Revenue In Total</Text>                        
                        </TouchableOpacity>                        
                    </View>
                    {this.renderCells()}
                </ScrollView>
            )
    }

    getDataList() {
        return (
            [
                [
                    { title: 'Last Transcation', icon: 'edit', goTo: 'MyReviews' },
                    { title: 'My Transcation Today', icon: 'book', goTo: 'Recent' },
                    { title: 'My Revenue Today', icon: 'id-card', goTo: 'Profile', smallerIcon:true },
                    { title: 'Promote My Shop', icon: 'cog', goTo: 'Setting' },
                ],
                [
                    { title: 'Shop View History', icon: 'handshake-o', goTo: 'Recommend', smallerIcon:true },
                    { title: 'Shop Revenue History', icon: 'briefcase', goTo: 'Business' }
                ]
            ]
        )
    }

}

// define your styles
const styles = StyleSheet.create({
    header: {
        paddingBottom: 10,
        backgroundColor: color.theme,
    },
    userContainer: {
        alignItems: 'center',
        margin: 10,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#51D3C6',
    }
});

//make this component available to the app
export default MeScene;
