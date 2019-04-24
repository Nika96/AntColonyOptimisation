//Czytanie z pliku z zrobienie na tej podstawie macierzy sasiedztwa
const fs = require('fs')  

class Graph {
    //loading data with cities from file
    constructor(file) {
        var text = fs.readFileSync(file);
        var splitted = text.toString().split("\n");
        
        this.numberOfCities = splitted[0];
            this.numberOfRoads = splitted[1];
        this.matrix = Array( parseInt(this.numberOfCities) ).fill(0).map(x => Array( parseInt(this.numberOfCities) ).fill(0));

        var first=0, second =0, third=0;

        for (var i=0; i < this.numberOfRoads; i++) {
            first = Number(splitted[i+2].split(" ")[0]);
            second = Number(splitted[i+2].split(" ")[1]);
            third = Number(splitted[i+2].split(" ")[2]);
            this.matrix[ first - 1 ][ second - 1] = third; 
        }
    }
}

var g = new Graph('data.txt');

exports.cityMatrix = g.matrix;
exports.numberOfCities = g.numberOfCities;
exports.numberOfRoads = g.numberOfRoads;

//implementacja macierzowa grafu (zrobic w ten sposob)
//+wczytywanie dantch do programu ,iasto i wartosci krawedzi 
//werktor w ktorym przechowuje nazwa miasta - ID miasta
