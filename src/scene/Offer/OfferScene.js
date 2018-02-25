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

class OfferScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Offer',
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight: 'normal' },
        headerRight: (
            <View style={{ flexDirection: 'row' }}>
                
            </View>
        )
    });
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false
        }
        this.preview = this.preview.bind(this)
    }
    closeModal() {
        this.setState({ modalVisible: false });
    }
    preview(image) {
        this.setState({ modalVisible: true, imagePreview: image })
    }
    render() {
        return (<ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
            <Modal
                visible={this.state.modalVisible}
                animationType={'fade'}
                onRequestClose={() => this.closeModal()}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center' }}>
                    <FullWidthImage source={{
                        uri: CONFIG.IMAGE_HOST + this.state.imagePreview
                    }} />
                    <TouchableOpacity
                        style={{ position: 'absolute', width: 60, height: 60, left: 10, top: 30 }}
                        onPress={() => {
                            this.closeModal()
                        }}>
                        <Text
                            style={{ fontSize: 30, backgroundColor: 'rgba(0,0,0,0)' }} >
                            <FontAwesome name={'close'} color={'#0abab5'} size={26} />
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <TouchableOpacity onPress={() => { this.preview(this.props.navigation.state.params.offer.album[0] && this.props.navigation.state.params.offer.album[0].uuid) }}>
                <Image resizeMode={'stretch'} source={{ uri: CONFIG.IMAGE_HOST + (this.props.navigation.state.params.offer.album[0] && this.props.navigation.state.params.offer.album[0].uuid) }} style={{ height: 240, width:screen.width }} />
            </TouchableOpacity>
            <Text style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}>{this.props.navigation.state.params.offer.name}</Text>
            <SpacingView height={3} />
            {this.props.navigation.state.params.offer.price > 0 &&
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', padding: 10 }}>
                    <Text style={{ color: '#0abab5', fontSize: 14 }}>S$</Text>
                    <Text style={{ color: '#0abab5', fontSize: 24, marginBottom: -5, marginRight: 10 }}>{this.props.navigation.state.params.offer.price}</Text>
                    <Text style={{ color: '#868686', fontSize: 12, textDecorationLine: "line-through" }}>S${this.props.navigation.state.params.offer.originalPrice}</Text>
                </View>
            }
            <SpacingView height={8} />
            <Text style={{ fontSize: 14, fontWeight: 'bold', padding: 10 }}>Details</Text>
            <SpacingView height={3} />
            <Text style={{ fontSize: 14, padding: 10 }}>{this.props.navigation.state.params.offer.description || 'N/A'}</Text>
            <SpacingView height={8} />
            <Text style={{ fontSize: 14, fontWeight: 'bold', padding: 10 }}>Notice</Text>
            <SpacingView height={3} />
            <Text style={{ fontSize: 14, padding: 10 }}>{this.props.navigation.state.params.offer.purchaseNotice || 'N/A'}</Text>
        </ScrollView>)
    }
}
export default OfferScene;