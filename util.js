function getRandomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function doSomeHeavyTask() {
    const ms = getRandomValue([100, 150, 200, 300, 400, 500, 600, 1000, 1400, 2500]);
    const shouldThrowError = getRandomValue([1, 2, 3, 4, 5, 6, 7, 8]) === 8;
    if (shouldThrowError) {
        const randomeError = getRandomValue([
            "Error 1",
            "Error 2",
            "Error 3",
            "Error 4",
            "Error 5",
            "Error 6",
            "Error 7",
            "Error 8",
            "Error 9",
            "Error 10",
        ]);
        throw new Error(randomeError);
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(ms);
        }, ms);
    });
}

export default doSomeHeavyTask;

