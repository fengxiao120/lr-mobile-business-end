export default {
    API_ROOT:"https://api.localrecommends.com/api/",
    IMAGE_HOST:"https://s3-ap-southeast-1.amazonaws.com/data.localrecommends.com/prod/",
    // API_ROOT:"http://192.168.31.106:8080/api/",
    // IMAGE_HOST:"https://s3-ap-southeast-1.amazonaws.com/data.localrecommends.com/dev/",
    CATEGORY_ICONS:{
        food: require('./img/Home/food.png'),
        beauty: require('./img/Home/beauty.png'),
        car: require('./img/Home/car.png'),
        education: require('./img/Home/education.png'),
        fitness: require('./img/Home/fitness.png'),
        wedding: require('./img/Home/wedding.png'),
        shopping: require('./img/Home/shopping.png'),
        leisure: require('./img/Home/leisure.png'),
        'life service': require('./img/Home/life_service.png'),
        renovation: require('./img/Home/renovation.png')
    }
}
