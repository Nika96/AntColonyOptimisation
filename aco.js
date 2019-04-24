var city = require('./city');

class ACO {

  //create matrix with feromone values
  constructor( alfa, beta, ro, q0 ) {
    this.beta = beta;
    this.alfa = alfa;
    this.ro = ro;
    this.q0 = q0;
    this.pheromoneMatrix = Array( parseInt(city.numberOfCities) ).fill(0)
                                                                .map(x => Array( parseInt(city.numberOfCities) )
                                                                .fill(0));
    var temp = 0;
    //for each edge t = 1 / d(i,j)^beta
    for (var i=0; i < city.numberOfCities; i++) {
      for(var j=0; j< city.numberOfCities; j++ ) {
        if( city.cityMatrix[i][j] != 0) {
          temp = 1 / Math.pow( city.cityMatrix[i][j], beta )
          this.pheromoneMatrix[i][j] = temp;
        }  
      }
    }
  }

  //single ant method
  singleAnt() {
    // get starting city 
    // var start = this.getRandomCity();
    var start = 2;

    //update list of visited cities
    var visitedCities = Array();
    visitedCities.push( start - 1 );

    //update list of unvisited cities
    var unvisitedCities = Array();
    for(var i=0; i<city.numberOfCities; i++) {
      if(i != start-1) {
        unvisitedCities.push( i );
      }
    }

    var neighbours = this.unvisitedNeighbours(start, unvisitedCities);
    var pValues = Array();


    //find value of P(j) for all neighbours of this city
    for(var i=0; i<neighbours.length; i++) {
      pValues[neighbours[i]] = this.P(start, neighbours[i]+1, neighbours);
    }    

    //0.024960738945990962
    pValues = [undefined, undefined, undefined, 0.024960738945990962];
    console.log(this.chooseCity(pValues, 3));
    //choose city
    return visitedCities;
  }

  //method that calls number of ants that were requested
  aco( numberOfAnts ) {
    for(var i= 0; i<numberOfAnts; i++) {
      console.log(this.singleAnt());
    }
  }

  //P(j) for single city
  P( cityStart, cityFinish, unvisitedCities ) {
    var probability;
    
    var neighbours = this.unvisitedNeighbours( cityStart, unvisitedCities );

    //sum of t(i, otherCities)
    var sum = 0;
    for( var i=0; i < neighbours.length; i++) {
      sum = sum + this.t( cityStart, neighbours[i]+1);
    }

    probability = this.t( cityStart, cityFinish ) / sum;
    return probability;
  }

  unvisitedNeighbours( cityStart , unvisitedCities) {
    var neighbours =  Array();
    for(var i = 0; i< city.cityMatrix.length; i++) {
      if( city.cityMatrix[ cityStart - 1 ][i] != 0 ) {
        neighbours.push( i  );
      }
    }
    //cities that are neighbours and are unvisited
    for(var i = 0; i < neighbours.length; i++ ) {
      if(unvisitedCities.includes(neighbours[i])) continue;
      else neighbours.pop(neighbours[i]);
    }
    return neighbours;
  }

  //choose next step city
  chooseCity( pValues, cityNumber ) {
    let nextCity;
    let f = Math.random();
    //randomizing algorithm - q paramether
    let q = Math.random();
    
    if( q < this.q0 ) {
      //wartosc funkcji t(i,j) jest najwieksza
      let len = city.cityMatrix[cityNumber-1].length;
      let max = 0;
      for(let i=0; i < len; i++) {
        //jezeli istnieje krawedz
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

      i = 0;
      console.log(" f = "+f);
      while( i < t.length ) {
        if( f < pValues[t[i]] ) {
          console.log("pValues = "+pValues[t[i]]);
          nextCity = i+1;
          break;
        }
        pValues[t[i+1]] = pValues[t[i+1]] + pValues[t[i]];
        i++;
        if( i == t.length - 1 ) nextCity = t[ t.length - 1 ];
      }
    }
    return nextCity;
  }

  //preference function
  t(i, j) {
    //concentration of pheromone / length of the road ^ beta
    return this.pheromoneMatrix[i-1][j-1] / Math.pow(city.cityMatrix[i-1][j-1], this.beta);
  }

  //change value of pheromone between two cities
  tauLocal(i ,j) {
    var value = this.ro * this.pheromoneMatrix[i-1][j-1] + this.alfa / (3.4 * 4); 
    this.pheromoneMatrix[i-1][j-1] = value;
    return value;
  }

  //after finding shortest path change all pheromone values on this path
  tauGlobal( road ) {
    var tau = 0;
    for (var i=0; i < city.numberOfCities-1; i++) {
      tau = this.ro * this.pheromoneMatrix[ road[i]-1 ][ road[i+1] - 1 ] + this.alfa * (1 / city.cityMatrix[ road[i]-1 ][ road[i+1] - 1 ]);
      this.pheromoneMatrix[ road[i]-1 ][ road[i+1] - 1 ] = tau;
      this.pheromoneMatrix[ road[i+1] - 1 ][ road[i]-1 ] = tau;
    }
  }

  //generates random starting city
  getRandomCity() {
    return Math.floor(Math.random() * city.numberOfCities) + 1;
  }
}

var aco = new ACO( 0.1, 2, 0.3, 0.0000001);
aco.singleAnt();
aco.t(2,1);