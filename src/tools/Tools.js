// math extensions
Math.getTrianglesHeight = (length) => {
    return length / 2 * Math.sqrt(3);
}
Math.randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// chance calculations
class Chance {};
Chance.chance = (chance) => {
    const randomValue = Math.random() * 100;    // 0 - 99.99999999

    return randomValue < chance;
}
Chance.SIDES_ON_DIE = 6;
Chance.rollDie = () => {
    const value = Math.randomInt(1, Chance.SIDES_ON_DIE);
    return value;
}
Chance.rollDice = (amountOfDice) => {
    const amountOfDice1 = amountOfDice || 1;

    let values = [];
    for (var i = 0; i < amountOfDice1; i++) {
        const value = Chance.rollDie();
        values.push(value);
    }

    return values;
}
Chance.amountSuccessfullRolls = (amountOfDice, minValue) => {
    const values = Chance.rollDice(amountOfDice);
    const successfullRolls = values.filter(v => v >= minValue).length;
    console.log("Rolled " + amountOfDice + " dice. Result: [" + values + "]. MinValue: " + minValue + ". Succeeded " + successfullRolls + ".");

    return successfullRolls;
}
Chance.enoughSuccessfullRolls = (amountOfDice, minValue, neededAmount) => {
    const values = Chance.rollDice(amountOfDice);
    const successfullRolls = values.filter(v => v >= minValue).length;
    console.log("Rolled " + amountOfDice + " dice. Result: [" + values + "]. MinValue: " + minValue + ". Succeeded " + successfullRolls + " out of " + neededAmount + " needed successes.");
    return successfullRolls >= neededAmount;
}

// Number extensions
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

// Object extensions
Object.toArray = (obj) => {
    return Object.keys(obj).map(key => obj[key]);
}

// Array extensions
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
