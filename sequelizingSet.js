let SequelizingSet = {};
SequelizingSet.setValues = function (data) {
    Object.keys(data.dataValues).forEach( (el) => {
        if (!['day', 'open', 'high', 'low', 'close', 'volume', 'adj'].includes(el)) {
            delete data.dataValues[el];
        }
        else if (el === 'day') {
            data.dataValues[el] = new Date(data.dataValues[el])
                .toISOString()
                .replace(/T.*/, ' ')
                .split('-')
                .join('')
                .trim();
        }
    });
    return data.dataValues;
};

module.exports = SequelizingSet;
