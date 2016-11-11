// math extensions
Math.getTrianglesHeight = (length) => {
    return length / 2 * Math.sqrt(3);
}

// object extensions
Object.toArray = (obj) => {
    return Object.keys(obj).map(key => obj[key]);
}
