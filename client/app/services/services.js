angular.module('untitled.services', [])

.factory('AddCard', function ($http, $location) {
  var allCards = [
  'Citi Hilton HHonors Visa Signature',
  'American Express Hilton HHonors',
  'American Express Hilton HHonors Surpass',
  'Citi Hilton HHonors Reserve',
  'Marriott Rewards Premier',
  'IHG Rewards Club Select Credit Card',
  'Starwood American Express',
  'Club Carlson Premier Rewards Visa',
  'Hyatt Visa'
  ];

  var personalCards = {};
  var selectedCard = "";
  var points = "";
  var cardToDelete = "";

  var addCard = function(card, points) {
    personalCards[card] = card;
    var obj = {card: card, points: points};
    $http.post('/api/cards/add', obj).success(function() {

    })
    .error(function() {

    });
  }

  var getCards = function(callback) {
    $http.get("/api/cards")
      .success(callback);
  }

  return {
    allCards: allCards,
    addCard: addCard,
    personalCards: personalCards,
    getCards: getCards,
    selectedCard: selectedCard,
    points: points,
    cardToDelete: cardToDelete
  }
})
.factory('Results', function() {
  var items = {
    rows: ['Hotel', 'Points', 'Card'],
    data: [
    {name: 'DoubleTree Los Angeles Downtown', points: 40000, card: 'Citi Hilton HHonors Reserve'},
    {name: 'Embassy Suites Los Angeles', points: 40000, card: 'Citi Hilton HHonors Reserve'},
    {name: 'Hilton Checkers Los Angeles', points: 40000, card: 'Citi Hilton HHonors Reserve'},
    {name: 'Hilton Garden Inn Hollywood', points: 50000, card: 'Citi Hilton HHonors Reserve'},
    {name: 'Hilton Los Angeles Airport', points: 30000, card: 'Citi Hilton HHonors Reserve'},
    {name: 'JW Marriott Los Angeles', points: 40000, card: 'Marriott Rewards Premier'},
    {name: 'Courtyard Los Angeles', points: 40000, card: 'Marriott Rewards Premier'},
    {name: 'Residence Inn Los Angeles', points: 40000, card: 'Marriott Rewards Premier'},
    {name: 'The Ritz-Carlton Los Angeles', points: 60000, card: 'Marriott Rewards Premier'},
    {name: 'Courtyard Pasadena', points: 30000, card: 'Marriott Rewards Premier'},
    {name: 'Residence Inn Burbank Downtown', points: 40000, card: 'Marriott Rewards Premier'},
    {name: 'Residence Inn Beverly Hills', points: 35000, card: 'Marriott Rewards Premier'},
    {name: 'Courtyard Century City', points: 30000, card: 'Marriott Rewards Premier'},
    {name: 'Renaissance Los Angeles', points: 25000, card: 'Marriott Rewards Premier'},
    {name: 'Los Angeles Airport Marriott', points: 30000, card: 'Marriott Rewards Premier'},
    {name: 'Hyatt Regency Century Plaza', points: 120000, card: 'Hyatt Visa'},
    {name: 'Hyatt Place Los Angeles/LAX', points: 15000, card: 'Hyatt Visa'},
    {name: 'HYATT house Los Angeles', points: 20000, card: 'Hyatt Visa'},
    {name: 'Hyatt Regency Valencia', points: 30000, card: 'Hyatt Visa'},
    {name: 'Hyatt Westlake Plaza in Thousand Oaks', points: 8000, card: 'Hyatt Visa'},
    {name: 'Radisson Hotel Los Angeles Midtown USC', points: 38000, card: 'Marriott Rewards Premier'},
    {name: 'Park Inn by Radisson Covina', points: 9000, card: 'Hyatt Visa'},
    {name: 'Country Inn & Suites Ontario', points: 28000, card: 'Hyatt Visa'},
    {name: 'Radisson Hotel Chatsworth', points: 28000, card: 'Hyatt Visa'},
    {name: 'Radisson Suites Hotel Buena Park', points: 38000, card: 'Hyatt Visa'},
    {name: 'Radisson Hotel Newport Beach', points: 38000, card: 'Hyatt Visa'},
    ]
  };

  return {
    items: items
  }
})
.factory('Search', function () {
  var place = {loc:""};
  var locations = [
  'Los Angeles, CA', 'San Francisco, CA',
  'San Diego, CA', 'Irvine, CA', 'Cerritos, CA',
  'Diamond Bar, CA', 'Chino Hills, CA', 'Pomona, CA',
  'Walnut, CA', 'San Jose, CA', 'Fremont, CA', 'Milpitas, CA',
  'Oakland, CA', 'Sacramento, CA', 'Palo Alto, CA', 'Mountain View, CA'
  ];

  var findHotels = function(location, card) {
    var obj = {card: card, points: points};
    $http.post('/api/hotels/search', obj).success(function() {

    })
    .error(function() {

    });
  }

  var recordLoc = function(loc) {
    place.loc = loc;
    // console.log(place);
  }

  return {
    place: place,
    locations: locations,
    findHotels: findHotels,
    recordLoc: recordLoc
  }
})
.factory('Auth', function ($http, $location, $window) {
  var submitted = false;
  var signupSubmitted = false;

  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      console.log('23445');
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.points');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.points');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout,
    submitted:submitted,
    signupSubmitted: signupSubmitted

  };
});
