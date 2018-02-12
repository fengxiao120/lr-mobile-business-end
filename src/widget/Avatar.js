//import liraries
import React, { PureComponent } from 'react'
import { Image, View } from 'react-native'
import CONFIG from '../config'
// create a component
class Avatar extends PureComponent {
    render() {
        return (
            <View>
                {
                    this.props.picture &&
                    <Image source={{ uri: CONFIG.IMAGE_HOST + this.props.picture.uuid + '_thumb' }} style={{ borderRadius: 20, width: this.props.size || 40, height: this.props.size || 40 }} />
                }
                {
                    !this.props.picture &&
                    <Image source={require('../img/Public/avatar.png')} style={{ borderRadius: 20, width: this.props.size || 40, height: this.props.size || 40 }} />
                }
            </View>

        );
    }
}

//make this component available to the app
export default Avatar;
