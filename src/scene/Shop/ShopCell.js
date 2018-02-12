import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native'
import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { screen } from '../../common'
import { color, SpacingView } from '../../widget'
import CONFIG from '../../config'
import StarRating from 'react-native-star-rating'
import _ from 'lodash'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
let count = 0;
// create a component
class ShopCell extends PureComponent {
    onPress() {
        if (this.props.navigation) {
            this.props.navigation.navigate('Shop', { shop: this.props.shop })
        }
    }
    render() {
        //console.log(this.props.shop.distance)
        let deleteIcon = this.props.showDelete &&
            <TouchableOpacity style={{
                width: screen.width * 0.11, height: screen.width * 0.09,
                alignSelf: 'flex-end', justifyContent: 'center',marginRight:20,
                flexDirection: 'row', alignItems: 'center'
            }}
                onPress={this.props.deleteCallback}>
                <FontAwesome name={'trash'} color={'#02aaa5'} size={this.props.size || 22} />
            </TouchableOpacity>

        return (
            <View style={{ backgroundColor: 'white' }}>
                <TouchableOpacity style={[{marginBottom:this.props.showDelete?2:10}, styles.container]} onPress={this.onPress.bind(this)}>
                    <Image source={{ uri: CONFIG.IMAGE_HOST + (this.props.shop.album[0] && this.props.shop.album[0].uuid) + '_thumb' }} style={styles.icon} />
                    <View style={styles.rightContainer}>
                        <Heading1 numberOfLines={1}>{this.props.shop.name}</Heading1>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 2 }}>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    starColor='#0abab5'
                                    emptyStarColor='#0abab5'
                                    starSize={16}
                                    rating={this.props.shop.score.toFixed(2) / 2}
                                />
                            </View>
                            <Text style={{ color: '#868686', minWidth: 100, paddingLeft: 10 }}>S${this.props.shop.avgCostPerPerson ? parseFloat(this.props.shop.avgCostPerPerson).toFixed(1).replace('.0', '') : "-"}/person</Text>
                            <Text style={{ color: '#868686', minWidth: 50 }}>{parseFloat(this.props.shop.distance).toFixed(1)}km</Text>
                        </View>
                        <Text numberOfLines={1} style={{ color: '#868686' }}>
                            {this.props.shop.subCategoryNames ? this.props.shop.subCategoryNames.slice(0, 2).sort().join(", ") : this.props.shop.subCategories.slice(0, 2).map(item => item.name).sort().join(", ")}
                        </Text>
                        <Text numberOfLines={1} style={{ color: '#868686' }}>{this.props.shop.district && this.props.shop.district.slice(0, 2).join(", ")}</Text>
                    </View>
                </TouchableOpacity>
                {deleteIcon}
                <SpacingView height={1} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 20,
        marginRight:10,
        marginLeft:10,
        backgroundColor: 'white',
    },
    icon: {
        width: 100,
        height: 100
    },
    rightContainer: {
        flex: 1,
        height: 100,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 10,
    }
});

//make this component available to the app
export default ShopCell;
