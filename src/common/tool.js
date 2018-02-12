import Toast from 'react-native-root-toast'
//import { color} from '../widget'

/** Converts numeric degrees to radians */
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}



export function urlByAppendingParams(url: string, params: Object) {
    let result = url
    if (result.substr(result.length - 1) != '?') {
        result = result + `?`
    }

    for (let key in params) {
        let value = params[key]
        result += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`
    }

    result = result.substring(0, result.length - 1);
    return result;
}

export function calcDistance(lat2, lon2, forDisplay) {
    if (!___location) {
        if (forDisplay)
            return '- km'
        return -1
    }
    let lat1 = ___location.coords.latitude
    let lon1 = ___location.coords.longitude
    // console.log(lat1,lat2,lon1,lon2)
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2 - lat1).toRad();  // Javascript functions in radians
    var dLon = (lon2 - lon1).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    d = d.toFixed(2) + 'km'
    return d;
}

global.___toast = (msg, long)=>{
    Toast.show(msg, {
        duration: long?Toast.durations.LONG:Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor:'#0abab5'
    });
}