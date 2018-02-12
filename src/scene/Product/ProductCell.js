import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native'
import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { screen } from '../../common'
import { color, FullWidthImage } from '../../widget'
import CONFIG from '../../config'
import StarRating from 'react-native-star-rating'
import _ from 'lodash'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
let count = 0;
// create a component
class ProductCell extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false
        }
    }
    closeModal() {
        this.setState({ modalVisible: false });
    }
    onPress() {
        if (this.props.onPress)
            this.props.onPress()
        else
            this.setState({ modalVisible: true })
    }
    render() {
        return (
            <View style={{ height: 80, width: (screen.width / 3 - 10), marginTop: 10 }}>
                <Modal
                    visible={this.state.modalVisible}
                    animationType={'fade'}
                    onRequestClose={() => this.closeModal()}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center' }}>
                        <FullWidthImage source={{
                            uri: CONFIG.IMAGE_HOST + (this.props.product.album[0] && this.props.product.album[0].uuid)
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
                <TouchableOpacity onPress={this.onPress.bind(this)}>
                    <Image source={{ uri: CONFIG.IMAGE_HOST + (this.props.product.album[0] && this.props.product.album[0].uuid) + '_thumb' }} style={{ height: 80, width: (screen.width / 3 - 20) }} />
                </TouchableOpacity>
                <Text style={{ position: 'absolute', left: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', fontSize: 14, textAlign: 'center', width: (screen.width / 3 - 20) }}>{this.props.product.name}</Text>
            </View>
        );
    }
}



//make this component available to the app
export default ProductCell;
