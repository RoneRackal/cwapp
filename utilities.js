
function Clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function CreateMatrix(rows, cols, defaultValue) {
    var m = [];

    for (var i = 0; i < rows; i++) {
        m.push([]);
        m[i].push(new Array(cols));

        for (var j = 0; j < cols; j++) {
            if (typeof defaultValue === "object") {
                m[i][j] = Clone(defaultValue);
            }
            else {
                m[i][j] = defaultValue;
            }

        }
    }

    return m;
}

Array.prototype.removeAt = function (i)
{
    this.splice(i, 1);
}

Array.prototype.empty = function ()
{
    while (this.length > 0)
    {
        this.pop();
    }
}
