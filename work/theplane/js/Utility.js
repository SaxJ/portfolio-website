var Utility = {
    randomNegative: function () {
        var r = Math.random();
        if (r <= 0.5) {
            return -1;
        } else {
            return 1;
        }
    },

    randomBool: function () {
        var r = Math.random();
        return (r > 0.5);
    }
};