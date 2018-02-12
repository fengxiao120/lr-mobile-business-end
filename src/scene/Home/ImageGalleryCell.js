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
class ImageGalleryCell extends PureComponent {
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
            <TouchableOpacity style={styles.container} onPress={this.onPress.bind(this)}>
                <Modal
                    visible={this.state.modalVisible}
                    animationType={'fade'}
                    onRequestClose={() => this.closeModal()}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center' }}>
                        <FullWidthImage source={{
                            uri: CONFIG.IMAGE_HOST + (this.props.pic && this.props.pic.uuid)
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
                <Image source={{ uri: CONFIG.IMAGE_HOST + (this.props.pic && this.props.pic.uuid) + '_thumb' }} resizeMode='stretch' style={{ marginRight: 10, width: (this.props.size || 120) / 2 * 3, height: (this.props.size || 120) }} />
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
    },
    price: {
        color: color.theme
    }
});

//make this component available to the app
export default ImageGalleryCell;
