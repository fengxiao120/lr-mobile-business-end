import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native'
import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { screen } from '../../common'
import { color, SpacingView } from '../../widget'
import CONFIG from '../../config'
import StarRating from 'react-native-star-rating'
import _ from 'lodash'

let count = 0;
// create a component
class ListCell extends PureComponent {
    cascadeNames(array_to_sort, byName) {
        let new_array = array_to_sort.slice(0, 2);
        // console.log(new_array);
        if (byName) {
            let sorted = new_array.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
            return sorted.map(item => item.name).join(", ");
        } else {
            let sorted = new_array.sort(function (a, b) {
                return a.localeCompare(b);
            });
            return sorted.join(", ");
        }
    }

    onPress() {
        if (this.props.navigation)
            this.props.navigation.navigate('Shop', { shop: this.props.shop })
    }

    render() {
        let offers = this.props.shop.offers.length > 0 &&
            <View style={{ flexDirection: 'row', backgroundColor: 'white', paddingBottom: 10 }} >
                <View style={{ width: 130, height: 0 }}>
                </View>
                <View style={{
                    flex: 1, paddingRight: 30, minHeight: 0, borderTopColor: '#EEE', borderTopWidth: 0.7, shadowOpacity: 0, shadowColor: 'transparent',
                }}>
                    {this.props.shop.offers.slice(0, 2).map((item) => {
                        return <View key={item.id} style={{ marginTop: 10, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ backgroundColor: '#0ABAB5', height: 14, width: 14, fontSize: 12, lineHeight: 14, color: 'white', textAlignVertical: 'top', textAlign: 'center', marginRight: 4 }} >$</Text>
                            <Text numberOfLines={1} style={{ color: '#868686', fontSize: 12 }}>{item.name}</Text>
                        </View>

                    })}
                </View>
            </View >
        return (
            <View style={{ backgroundColor: 'white' }}>
                <TouchableOpacity style={styles.container} onPress={this.onPress.bind(this)}>
                    <Image source={{ uri: CONFIG.IMAGE_HOST + (this.props.shop.album[0] && this.props.shop.album[0].uuid) + '_thumb' }} style={styles.icon} />
                    <View style={styles.rightContainer}>
                        <Heading1 numberOfLines={1}>{(this.props.index + 1) + '. ' + this.props.shop.name}</Heading1>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 2 }}>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        starColor='#0abab5'
                                        emptyStarColor='#0abab5'
                                        starSize={16}
                                        rating={this.props.shop.score.toFixed(1) / 2}
                                    />
                                </View>
                                <Text style={{ color: '#868686', minWidth: 40, marginLeft: 10 }}>{this.props.shop.score.toFixed(1)}</Text>
                            </View>

                            <Text style={{ color: '#868686', minWidth: 80 }}>{this.props.shop.reviewCount} Review{this.props.shop.reviewCount > 1 ? 's' : null}</Text>
                        </View>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={{ color: '#868686', flex: 2 }} numberOfLines={1}>{this.cascadeNames(this.props.shop.subCategories, true)}</Text>
                            <Text style={{ color: '#868686', minWidth: 80 }}>S${this.props.shop.avgCostPerPerson ? parseFloat(this.props.shop.avgCostPerPerson).toFixed(1).replace('.0', '') : "-"}/person</Text>
                        </View>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={{ color: '#868686' }}>{this.props.shop.district && this.props.shop.district.join(", ")}</Text>
                            <Text style={{ color: '#868686', minWidth: 50, marginRight: 30 }}>{parseFloat(this.props.shop.distance).toFixed(1)}km</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {offers}
                <SpacingView height={1} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
    },
    icon: {
        width: 100,
        height: 100
    },
    rightContainer: {
        minHeight: 90,
        flex: 1,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 10,
    }
});

//make this component available to the app
export default ListCell;
