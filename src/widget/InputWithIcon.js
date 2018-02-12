import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ViewPropTypes } from 'react-native'

// create a component
class InputWithIcon extends PureComponent {

    render() {
        return (
            <View style={{ ...styles.searchSection, ...this.props.style }}>
                <FontAwesome style={styles.searchIcon} name={this.props.icon} size={20} color="#000" />
                <TextInput
                    style={styles.input}
                    value={this.props.value}
                    secureTextEntry={this.props.secureTextEntry}
                    placeholder={this.props.placeholder}
                    onChangeText={this.props.onChangeText}
                    underlineColorAndroid="transparent"
                />
            </ View >
        )
    }
}


const styles = {
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchIcon: {
        width: 20,
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'center',
        color: '#868686'
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        color: '#868686',
    }
}

//make this component available to the app
export default InputWithIcon;