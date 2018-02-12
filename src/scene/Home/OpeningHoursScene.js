import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, TextInput, Modal,
    ScrollView, TouchableOpacity,
    ListView, Image, StatusBar, FlatList, ActivityIndicator, Platform, Linking
} from 'react-native'
import { color, Button, NavigationItem, RefreshListView, RefreshState, Separator, SpacingView } from '../../widget'
import FontAwesome from 'react-native-vector-icons/FontAwesome';


class OpeningHoursScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Openning Hours',
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight:'normal'},
        headerRight: (<View></View>)
    });
    render() {
        return (<View style={{ backgroundColor: 'white', flex: 1 }}>
            <SpacingView height={3} />
            <Text style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}>{this.props.navigation.state.params.shopName}</Text>
            <SpacingView height={3} />
            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <Text
                    style={{ fontSize: 20, marginRight: 5 }} >
                    <FontAwesome name={'clock-o'} color={'#0abab5'} size={20} />
                </Text>
                <Text style={{ fontSize: 14, flexGrow: 1 }}>{this.props.navigation.state.params.openingHours}</Text>
            </View>
        </View>)
    }
}
export default OpeningHoursScene;