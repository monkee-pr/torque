// math extensions
Math.getTrianglesHeight = (length) => {
    return length / 2 * Math.sqrt(3);
}
Math.randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * ((max - min) + 1 + min));
}
Math.chance = (chance) => {
    const randomValue = Math.random() * 100;    // 0 - 99.99999999

    return randomValue < chance;
}
Math.rollDice = (amountOfDice) => {
    const amountOfDice1 = amountOfDice || 1;

    let values = [];
    for (var i = 0; i < amountOfDice1; i++) {
        const value = Math.randomInt(1, 6);
        values.push(value);
    }

    return values;
}
Math.diceHigherX = (amountOfDice, minValue) => {
    const values = Math.rollDice(amountOfDice);

    return values.filter(v => v >= minValue);
}
Math.diceValueNeeded = (amountOfDice, minValue, neededAmount) => {
    return diceHigherX(amountOfDice, minValue).length >= neededAmount;
}

Number.isEven = (num) => {
    if (!Number.isInteger(num)) {
        console.error(num + " is not an integer");
        return null;
    } else {
        return num % 2 == 0;
    }
}
Number.isOdd = (num) => {
    if (!Number.isInteger(num)) {
        console.error(num + " is not an integer");
        return null;
    } else {
        return num % 2 != 0;
    }
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
