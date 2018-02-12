/**
 * Copyright (c) 2017-present, Liu Jinyong
 * All rights reserved.
 *
 * https://github.com/huanxsd/MeiTuan  
 * @flow
 */

//import liraries
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { screen, system, tool } from '../../common'
import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// create a component
class MeSceneCell extends PureComponent {
    render() {
        let icon = this.props.icon &&
            <FontAwesome name={this.props.icon} color={this.props.color}  size={this.props.size||24} style={{ ...this.props.iconStyle}}/>        
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => this.props.onPress(this.props.goTo)} >
                    <View style={[styles.content, this.props.style]}>
                        {icon}
                        <Text style={{color:'#333', fontSize:16}}>{this.props.title}</Text>
                        <View style={{ flex: 1, backgroundColor: 'blue' }} />
                        <Paragraph style={{ color: '#999999' }}>{this.props.subtitle}</Paragraph>
                        <FontAwesome name={'angle-right'} color={'#868686'} size={30} />
                    </View>

                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding:3
    },
    content: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 10,
        backgroundColor:'white'
    },
    icon: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    subtitleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    arrow: {
        width: 14,
        height: 14,
        marginLeft: 5,
    }
});

//make this component available to the app
export default MeSceneCell;
