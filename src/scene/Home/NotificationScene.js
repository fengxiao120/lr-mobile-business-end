//import liraries
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'

import { color, NavigationItem, SpacingView } from '../../widget'
import { screen, system, tool } from '../../common'
import { calcDistance } from '../../common/tool'

import Storage from '../../common/storage'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import notificationApi from '../../api/notification'
import moment from 'moment'
import _ from 'lodash'



// create a component
class NotificationScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: "Notifications",
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerRight: (<View></View>)
    })

    constructor(props: Object) {
        super(props)
        this.state = {
            notifications: [],
        }
    }

    componentDidMount() {
        this.requestNotifications()
    }


    async requestNotifications() {
        try {
            let json = await notificationApi.list()
            let notifications = json.data || []
            this.setState({ notifications: notifications })
        } catch (error) {
            console.log(error)
        }
    }

    renderCell = (notification: Object) => {
        return (
            <View style={{ backgroundColor: 'white', width: '100%', padding: 10 }}>
                <Text style={{ fontSize: 14, color: '#868686' }}>{moment(notification.item.time).format('DD MMM YYYY hh:mm')}</Text>
                <Text style={{ fontSize: 16, marginTop: 10, marginBottom: 10 }}>{notification.item.text}</Text>
            </View>
        )
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.notifications}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderCell}
                />
            </View>
        )
    }
}

//make this component available to the app
export default NotificationScene;


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
});