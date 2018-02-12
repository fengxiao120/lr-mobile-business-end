
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native'
// create a component
class LRSpinner extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible
        }
    }
    componentWillUnmount() {
        this.setState({
            visible: false
        })
    }
    componentWillReceiveProps(props) {
        if (this.state.visible != props.visible || props.visible == false)
            this.setState({
                visible: props.visible
            })
        let hide = () => {
            if (this.state.visible)
                this.setState({
                    visible: false
                })
        }
        setTimeout(hide.bind(this), 5000)
    }
    render() {
        return (
            <Modal
                visible={false}
                transparent={true}
                animationType={'fade'}
            >
                <View style={{
                    flex: 1, backgroundColor: "rgba(255,255,255,0.3)", alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ActivityIndicator size="large" color='#0abab5' />
                </View>
            </Modal>
        );
    }
}


//make this component available to the app
export default LRSpinner;
