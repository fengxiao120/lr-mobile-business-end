import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { screen } from '../../common'
import { color } from '../../widget'
import CONFIG from '../../config'
import StarRating from 'react-native-star-rating'
import _ from 'lodash'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

let count = 0;
// create a component
class OfferCell extends PureComponent {
    offer() {
        if (this.props.navigation)
            this.props.navigation.navigate('Offer', { offer: this.props.offer })
    }
    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.offer.bind(this)}>
                <Image source={{ uri: CONFIG.IMAGE_HOST + (this.props.offer.album[0] && this.props.offer.album[0].uuid) + '_thumb' }} style={styles.icon} />
                <View style={styles.rightContainer}>
                    <Text style={{ fontSize: 14 }}>{this.props.offer.name}</Text>
                    {this.props.offer.price >0 &&
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', }}>
                            <Text style={{ color: '#0abab5', fontSize: 14 }}>S${this.props.offer.price}</Text>
                            <Text style={{ color: '#868686', fontSize: 12, textDecorationLine: "line-through" }}>S${this.props.offer.originalPrice}</Text>
                        </View>
                    }
                </View>
                <Text
                    style={{ fontSize: 15 }} >
                    <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                </Text>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',

    },
    icon: {
        width: 80,
        height: 80
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingLeft: 10
    }
});

//make this component available to the app
export default OfferCell;
