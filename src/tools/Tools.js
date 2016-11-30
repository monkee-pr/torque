// math extensions
Math.getTrianglesHeight = (length) => {
    return length / 2 * Math.sqrt(3);
}
Math.randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// object extensions
Object.toArray = (obj) => {
    return Object.keys(obj).map(key => obj[key]);
}

Array.getRandomElement = (arr) => {
    const i = Math.randomInt(0, arr.length-1);
    return arr[i];
}
Array.flatten = (arr) => {
    var ret = [];
    for(var i = 0; i < arr.length; i++) {
        if(Array.isArray(arr[i])) {
            ret = ret.concat(Array.flatten(arr[i]));
        } else {
            ret.push(arr[i]);
        }
    }
    return ret;
}
