import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, TextInput, Modal,
    ScrollView, TouchableOpacity,
    ListView, Image, StatusBar, FlatList, ActivityIndicator, Platform, Linking
} from 'react-native'
import { color, Button, NavigationItem, RefreshListView, RefreshState, Separator, SpacingView, FullWidthImage } from '../../widget'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CONFIG from '../../config'
import { screen } from '../../common'

class ProductScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Recommended ' + navigation.state.params.title,
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight: 'normal' },
        headerRight: (<View></View>)
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
    renderCell(data) {
        let product = data.item
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => { this.preview(product.album[0] && product.album[0].uuid) }}>
                    {
                        product.album[0] && product.album[0].uuid ?
                            <Image source={{ uri: CONFIG.IMAGE_HOST + (product.album[0] && product.album[0].uuid) + '_thumb' }} style={{ width: 100, height: 100 }} />
                            :
                            <Image source={require('../../img/Product/default.png')} style={{ width: 100, height: 100 }} />
                    }
                </TouchableOpacity>
                <View style={styles.rightContainer}>
                    <Text style={{ fontSize: 14 }}>{product.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <FontAwesome name={'thumbs-o-up'} color={'#0abab5'} size={20} />
                        <Text style={{ color: '#868686', fontSize: 12 }}>{product.recommendCount || '0'} Recommends</Text>
                    </View>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
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
                <FlatList
                    data={this.props.navigation.state.params.products}
                    keyExtractor={(item) => { return item.id }}
                    renderItem={this.renderCell.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',

    },
    rightContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    }
});
export default ProductScene;