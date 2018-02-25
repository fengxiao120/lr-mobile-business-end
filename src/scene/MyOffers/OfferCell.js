import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, TextInput, Modal,
    ScrollView, TouchableOpacity,
    ListView, Image, StatusBar, FlatList, ActivityIndicator, Platform, Linking
} from 'react-native'
import { screen, system, tool } from '../../common'
import { color, Button, NavigationItem, RefreshListView, RefreshState, Separator, SpacingView, FullWidthImage } from '../../widget'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CONFIG from '../../config'

class OfferCell extends PureComponent {
    render() {
        return (<View style={{ backgroundColor: 'white', flex: 1 }}>
            <Image resizeMode={'stretch'} source={{ uri: CONFIG.IMAGE_HOST + (this.props.offer.album[0] && this.props.offer.album[0].uuid) }} style={{ width:screen.width, height: screen.width*2/3 }} />
            <Text style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}>{this.props.offer.name}</Text>
            <SpacingView height={3} />
            {this.props.offer.price > 0 &&
                <View style={{flex:1}}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', padding: 10 }}>
                    <Text style={{ color: '#0abab5', fontSize: 14 }}>S$</Text>
                    <Text style={{ color: '#0abab5', fontSize: 24, marginBottom: -5, marginRight: 10 }}>{this.props.offer.price}</Text>
                    <Text style={{ color: '#868686', fontSize: 12, textDecorationLine: "line-through" }}>S${this.props.offer.originalPrice}</Text>
                </View>
                <SpacingView height={3} />
                </View>
            }
            <Text style={{ fontSize: 14, fontWeight: 'bold', padding: 10 }}>{'Details:\n'}
                <Text style={{fontWeight:'normal' }}>{this.props.offer.description || 'N/A'}</Text>
            </Text>
            
            <SpacingView height={3} />

            <Text style={{ fontSize: 14, fontWeight: 'bold', padding: 10 }}>{'Notice:\n'}
                <Text style={{fontWeight:'normal' }}>{this.props.offer.purchaseNotice || 'N/A'}</Text>
            </Text>                
            <SpacingView height={20} />
        </View>)
    }
}
export default OfferCell;