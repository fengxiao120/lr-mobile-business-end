import React, { Component } from 'react'
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, Image, Modal, Platform, Alert, ActivityIndicator } from 'react-native'
import { color, Button, NavigationItem, RefreshListView, RefreshState, SpacingView, Filters } from '../widget'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet'
import ImageApi from '../api/image'
import CONFIG from '../config'
import _ from 'lodash'

const CANCEL_INDEX = 0
const options = ['Cancel', 'Take a photo', 'Choose from album']

export default class Album extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: this.props.images || []
        }
    }

    handlePress(i) {
        if (i == 1)
            this.pickSingleWithCamera()
        if (i == 2)
            this.openPicLib()
    }

    upload(photo) {
        const data = new FormData();
        data.append('photo', {
            uri: photo.path,
            type: Platform.OS == 'ios'?photo.type:'image/jpeg',
            name: 'photo'
        });
        this.setState({
            loading: true
        })
        ImageApi.upload(data).then(json => {
            this.state.images.push({
                uuid: json.data
            })
            this.setState({
                images: this.state.images,
                loading: false
            })
            this.props.setAlbum(this.state.images)
        }, () => {
            this.setState({
                loading: false
            })
        })
    }

    pickSingleWithCamera = () => {
        ImagePicker.openCamera({
            cropping: false,
            compressImageMaxWidth: 1024,
            compressImageMaxHeight: 1024,
            compressImageQuality: 0.75
        }).then(photo => {
            this.upload(photo);
        }).catch(
            e => console.log(e)
            );
    }

    openPicLib = () => {
        if (Platform.OS === 'ios') {
            ImagePicker.openPicker({
                multiple: false,
                waitAnimationEnd: false,
                compressImageMaxWidth: 1024,
                compressImageMaxHeight: 1024,
                compressImageQuality: 0.75
            }).then(photo => {
                this.upload(photo);
            }).catch(e =>
                e => console.log(e)
                );

        } else {
            ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: false,
                cropperCircleOverlay: false,
                compressImageMaxWidth: 1024,
                compressImageMaxHeight: 1024,
                compressImageQuality: 0.75,
                mediaType: 'photo',
                compressVideoPreset: 'MediumQuality'
            }).then(photo => {
                this.upload(photo);
            }).catch(e => {
                if(e.message=='User cancalled image selection')
                    alert('Gotcha')
                else
                    Alert.alert(e.message
                        ? e.message
                        : e);
            });
        }
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                    _.map(this.state.images, (image) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                Alert.alert(
                                    'Alert',
                                    'Delete this photo?',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'OK', onPress: () => {
                                                let index = this.state.images.indexOf(image)
                                                this.state.images.splice(index, 1)
                                                this.setState({
                                                    images: this.state.images
                                                })
                                            }
                                        },
                                    ],
                                    { cancelable: false }
                                )
                            }} key={image.uuid} style={{ marginRight: 10, marginBottom: 10 }}>
                                <Image style={{ width: 100, height: 100 }} source={{ uri: CONFIG.IMAGE_HOST + image.uuid + '_thumb' }} />
                            </TouchableOpacity>
                        )
                    })
                }
                {
                    this.state.loading && <View style={{width: 100, height: 100, marginRight: 10, marginBottom: 10, 
                        alignItems: 'center', justifyContent: 'center', borderRadius: 5, 
                        borderWidth: 1, borderStyle: 'dotted', borderColor: '#0abab5' }}>
                        <ActivityIndicator size="large" color={color.theme} />
                     </View>
                }
                {   
                    !this.state.loading && <TouchableOpacity
                    onPress={() => {
                        this.ActionSheet.show();
                    }} style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderWidth: 1, borderStyle: 'dotted', borderColor: '#0abab5' }}>
                    <Text
                        style={{ fontSize: 40, color: '#0abab5', backgroundColor: 'rgba(0,0,0,0)' }} >
                        +
                    </Text>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        options={options}
                        cancelButtonIndex={CANCEL_INDEX}
                        onPress={this.handlePress.bind(this)}
                    />
                    </TouchableOpacity>
                }
            </View>
        );
    }
}