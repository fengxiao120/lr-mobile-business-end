/**
 * Copyright (c) 2017-present, Liu Jinyong
 * All rights reserved.
 *
 * https://github.com/huanxsd/MeiTuan  
 * @flow
 */

//import liraries
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import color from './color'

// create a component
class SpacingView extends PureComponent {
    render() {
        return (
            <View style={{ backgroundColor: this.props.backgroundColor||color.background, height: this.props.height || 14 }}>
            </View>
        );
    }
}

//make this component available to the app
export default SpacingView;
