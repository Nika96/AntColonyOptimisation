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
    var start = city.getRandomCity();
    //update list of visited cities
    var visitedCities = Array();
    visitedCities.push( start  - 1);
    
    //update list of unvisited cities
    var unvisitedCities = Array();
    for(var i=0; i<city.numberOfCities; i++) {
      if(i != start-1) {
        unvisitedCities.push( i );
      }
    }
    
    var pValues = [];
    var neighbours;
    var helper = 0;
    while( visitedCities.length != city.numberOfCities ) {
      neighbours = unvisitedCities;
      //find value of P(j) for all neighbours of this city
      for(var i=0; i<neighbours.length; i++) {
        pValues[ neighbours[i] ] = this.P(start, neighbours[i]+1, neighbours);
      } 

      //choose next city to visit
      var nextCity = city.chooseCity(pValues, start) - 1;

      //update visited cities
      visitedCities.push( nextCity );
      //update unvisited cities
      unvisitedCities.splice( unvisitedCities.indexOf(nextCity), 1 );
      //update pheromone values on this edge i -> j
      this.tauLocal(visitedCities[helper]+1, visitedCities[helper]+1);

      helper++;
      start = nextCity+1;
      pValues = []; 
    }

    //change tauLocal for last step
    this.tauLocal( visitedCities[ visitedCities.length - 1] + 1, visitedCities[ 0 ] + 1);

    //last step - get back to the first node
    visitedCities.push( visitedCities[0] );    

    return visitedCities;
  }

  //method that calls number of ants that were requested
  aco( numberOfAnts ) {

    //for each ant check length of her road
    var roadLenght = 0;
    var  min = 10000;
    var minRoad = []; 
    for(var i = 0; i<numberOfAnts; i++) {
           
      var arr = this.singleAnt();
      
      roadLenght = 0;

      for(var j = 0; j < city.numberOfCities; j++ ) {
        roadLenght = roadLenght + city.cityMatrix[arr[j]][arr[j+1]];
      }

      //rounding result to the third place after coma
      roadLenght = parseFloat(roadLenght.toFixed(3));
           
      //checking if this road is the shortest
      if( roadLenght < min ) {
        min = roadLenght;
        minRoad = arr;
      }
    }
    return minRoad;
  }

  //P(j) for single city
  P( cityStart, cityFinish, unvisitedCities ) {
    var probability;
    
    var neighbours = unvisitedCities;

    //sum of t(i, otherCities)
    var sum = 0;
    for( var i=0; i < neighbours.length; i++) {
      sum = sum + this.t( cityStart, neighbours[i]+1);
    }

    probability = this.t( cityStart, cityFinish ) / sum;
    return probability;
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
    this.pheromoneMatrix[j-1][i-1] = value;
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
}

var aco = new ACO( 0.1, 2, 0.1, 0);
console.log(aco.aco( 10 ));