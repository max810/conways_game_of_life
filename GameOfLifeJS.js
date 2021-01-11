/**
 * Created by maxbe on 22.11.2016.
 */
var timerID;
document.getElementById('generate').addEventListener('click', function () {
    initializeGenerations();
    generateField();
    document.getElementById('width').value = '';
    document.getElementById('height').value = '';
});
document.getElementById('start').addEventListener('click', function () {
    getElements();
    if (!document.getElementById('freq').value) {
        document.getElementById('freq').value = 250;
    }
    timerID = setInterval(function () {
        getNextGeneration();
    }, document.getElementById('freq').value);
});
document.getElementById('pause').addEventListener('click', function () {
    clearInterval(timerID);
});
document.getElementById('clear').addEventListener('click', function () {
    clear();
});


//---------------------------------------------------------------------

var generation1 = [];
var generation2 = [];

function initializeGenerations() {
    generation1.length = document.getElementById('height').value;
    generation2.length = document.getElementById('height').value;
    for (var i = 0; i < generation1.length; i++) {
        generation1[i] = [];
        generation2[i] = [];
        for (var j = 0; j < document.getElementById('width').value; j++) {
            generation1[i][j] = 0;
            generation2[i][j] = 0;
        }
    }
}

function clear() {
    for (var i = 0; i < document.getElementsByTagName('tr').length; i++) {
        for (var j = 0; j < document.getElementsByTagName('tr')[i].children.length; j++) {
            document.getElementsByTagName('tr')[i].children[j].style.backgroundColor = '';
        }
    }
    for (var x = 0; x < generation1.length; x++) {
        for (var y = 0; y < generation1[x].length; y++) {
            generation1[x][y] = 0;
            generation2[x][y] = 0;
        }
    }
}

//-----------------------------------------------------------------------------

function generateField() {
    var width = document.getElementById('width').value;
    var height = document.getElementById('height').value;
    document.getElementById('field').innerHTML = '';
    for (var i = 0; i < height; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < width; j++) {
            var td = document.createElement('td');
            td.addEventListener('click', function () {
                if (this.style.backgroundColor == '') {
                    this.style.backgroundColor = 'black';
                } else {
                    this.style.backgroundColor = '';
                }
            });
            tr.appendChild(td);
        }
        document.getElementById('field').appendChild(tr);
    }
}

function getElements() {
    for (var i = 0; i < document.getElementsByTagName('tr').length; i++) {
        for (var j = 0; j < document.getElementsByTagName('tr')[i].children.length; j++) {
            if (document.getElementsByTagName('tr')[i].children[j].style.backgroundColor == 'black') {
                generation1[i][j] = 1;
            } else {
                generation1[i][j] = 0;
            }
        }
    }

}

//----------------------------------------------------------------------------------------

function getNextGeneration() {
    for (var i = 0; i < generation1.length; i++) {
        for (var j = 0; j < generation1[i].length; j++) {
            switch (getNeighbours(generation1, i, j)) {
                case 2:
                {
                    if (generation1[i][j] == 1) {
                        generation2[i][j] = 1;
                    } else {
                        generation2[i][j] = 0;
                    }
                    break;
                }
                case 3:
                {
                    generation2[i][j] = 1;
                    break;
                }
                default:
                {
                    generation2[i][j] = 0;
                }
            }
        }
    }
    evolve();
    if (ifParadise(generation1, generation2)) {
        alert('Эволюция достигла предела');
        clearInterval(timerID);
    }
    for (var a = 0; a < generation1.length; a++) {
        for (var b = 0; b < generation1[a].length; b++) {
            generation1[a][b] = generation2[a][b];
        }
    }

}

function ifParadise(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] != arr2[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function evolve() {
    for (var i = 0; i < generation2.length; i++) {
        for (var j = 0; j < generation2[i].length; j++) {
            if (generation2[i][j] == 1) {
                document.getElementsByTagName('tr')[i].children[j].style.backgroundColor = 'black';
            } else {
                document.getElementsByTagName('tr')[i].children[j].style.backgroundColor = '';
            }
        }
    }
}

function getNeighbours(arr, i, j) {
    var counter = 0;
    for (var a = 1; a > -2; a--) {
        for (var b = 1; b > -2; b--) {
            if (a == 0 && b == 0) {
                continue;
            } else {
                if (arr[i - a] == undefined || arr[i - a][j - b] == undefined) {
                    if (i - a == -1 && j - b == -1) {//top-left
                        if (arr[arr.length - 1][arr[arr.length - 1].length - 1] == 1) {
                            counter++;
                        }
                    } else if ((i - a == arr.length) && j - b == -1) {//bottom-left
                        if (arr[0][arr[0].length - 1] == 1) {
                            counter++;
                        }
                    } else if (i - a == -1 && (j - b == arr[0].length)) {//top-right
                        if (arr[arr.length - 1][0] == 1) {
                            counter++;
                        }
                    } else if (i - a == arr.length && j - b == arr[arr.length - 1].length) {//bottom-right
                        if (arr[0][0] == 1) {
                            counter++;
                        }
                    } else {
                        if (arr[i - a] != undefined && arr[i - a][j - b + 1] != undefined) {//left
                            if (arr[i - a][arr[i - a].length - 1] == 1) {
                                counter++;
                            }
                        } else if (arr[i - a] != undefined && arr[i - a][j - b - 1] != undefined) {//right
                            if (arr[i - a][0] == 1) {
                                counter++;
                            }
                        } else if (arr[i - a + 1] != undefined) {//top
                            if (arr[arr.length - 1][j - b] == 1) {
                                counter++;
                            }
                        } else {
                            if (arr[0][j - b] == 1) {
                                counter++;
                            }
                        }

                    }
                } else {
                    if (arr[i - a][j - b] == 1) {
                        counter++;
                    }
                }

            }
        }
    }
    return counter;
}
