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
    
    //generates random starting city
    getRandomCity() {
    return Math.floor(Math.random() * this.numberOfCities) + 1;
    }

    //choose next step city
    chooseCity( pValues, cityNumber ) {
    let nextCity;
    let f = Math.random();
    //randomizing algorithm - q paramether
    let q = Math.random();

    if( q < this.q0 ) {
        // t(i,j) - the biggest value
        let len = city.cityMatrix[cityNumber-1].length;
        let max = 0;
        for(let i=0; i < len; i++) {
        //if connection exist
        if( city.cityMatrix[cityNumber-1][i] != 0 ) {
            if( this.t(cityNumber, i+1) > max ) {
            max = this.t(cityNumber, i+1);
            nextCity = i+1;
            }
        }
        }
    }
    else {
        let t = [];
        let i = 0;
        while( i < pValues.length ) {
        if( pValues[i] != undefined ) {
            t.push(i);
        }
        i++;
        }

        //CASE: city has no neighbours
        if(t.length == 0) {
        throw "This city has no neighbours!";
        }

        i = 0;
        while( i < t.length ) {
        if( f < pValues[t[i]] ) {
            nextCity = t[i] + 1;
            break;
        } else if( i == t.length - 1 ) {
            nextCity = t[ t.length - 1 ];
        }
        pValues[t[i+1]] = pValues[t[i+1]] + pValues[t[i]];
        i++;
        }
    }
    return nextCity;
    }

    //returns array of unvisited neighbours
    unvisitedNeighbours( cityStart , unvisitedCities) {
        var neighbours =  Array();
        for(var i = 0; i< this.cityMatrix.length; i++) {
            if( this.cityMatrix[ cityStart - 1 ][i] != 0 ) {
            neighbours.push( i  );
            }
        }

        //cities that are neighbours and are unvisited
        for(var i = 0; i < neighbours.length; i++ ) {
            if(unvisitedCities.includes(neighbours[i])) continue;
            else neighbours.splice( neighbours.indexOf(neighbours[i]), 1 );
            
        }

        return neighbours;
    }

}

var g = new Graph('data.txt');

exports.cityMatrix = g.matrix;
exports.numberOfCities = g.numberOfCities;
exports.numberOfRoads = g.numberOfRoads;
exports.chooseCity = g.chooseCity;
exports.getRandomCity = g.getRandomCity;
exports.unvisitedNeighbours = g.unvisitedNeighbours;
