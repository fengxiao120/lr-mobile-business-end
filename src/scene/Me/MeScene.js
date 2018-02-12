

//import liraries
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'

import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { screen, system, tool } from '../../common'
import { color, NavigationItem, SpacingView, LRSpinner } from '../../widget'
import MeSceneCell from './MeSceneCell'
import CONFIG from '../../config'
import Storage from '../../common/storage'
import Bus from '../../common/bus'
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


    state: {
        isRefreshing: boolean
    }

    constructor(props: Object) {
        super(props)

        this.state = {
            isRefreshing: false,
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
    async getUser() {
        let user = await Storage.get("user")
        this.setState({ user: user })
    }

    onHeaderRefresh() {
        this.setState({ isRefreshing: true })

        setTimeout(() => {
            this.setState({ isRefreshing: false })
        }, 2000);
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
        let avatar = this.state.user && this.state.user.picture ?
            (<TouchableOpacity onPress={this.editProfileImage}>
                <Image style={styles.avatar} source={{ uri: CONFIG.IMAGE_HOST + this.state.user.picture.uuid + '_thumb' }} />
            </TouchableOpacity>) :
            (<TouchableOpacity onPress={this.editProfileImage}>
                <Image style={styles.avatar} source={require('../../img/Me/avatar.png')} />
            </TouchableOpacity>)
        return (
            <View style={styles.header}>
                <View style={styles.userContainer}>
                    {avatar}
                    <Heading1 style={{ color: 'white' }}>{this.state.user ? 'Hi, ' + this.state.user.nickName : null}</Heading1>
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
        if (this.state.user)
            return (
                <ScrollView style={{ flex: 1, backgroundColor: 'transparent', width: screen.width, height: screen.width * 1.5 }}>
                    {this.renderHeader()}
                    {this.renderCells()}
                </ScrollView>
            )
        else
            return (
                <View>
                    {this.renderHeader()}
                    <Text style={{ marginTop: screen.width * 0.4, fontSize: 32, textAlign: 'center', color: '#ccc' }}>Not logged in</Text>
                </View>
            )
    }

    getDataList() {
        return (
            [
                [
                    { title: 'My Reviews', icon: 'edit', goTo: 'MyReviews' },
                    { title: 'Recent Views', icon: 'book', goTo: 'Recent' },
                    { title: 'Profile', icon: 'id-card', goTo: 'Profile', smallerIcon:true },
                    { title: 'Setting', icon: 'cog', goTo: 'Setting' },
                ],
                [
                    { title: 'Recommend to us!', icon: 'handshake-o', goTo: 'Recommend', smallerIcon:true },
                    { title: 'Business', icon: 'briefcase', goTo: 'Business' }
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
