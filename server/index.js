// server/index.js

const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();

const cors = require("cors");
app.use(cors());

//load the quotes JSON
const quotes = require("./quotes.json");

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

// GET - SHOW SUCCESS

app.get("/api", function (request, response) {
  response.json({ success: "Server has Loaded", message: [] }); // Indicate that the server has loaded
});

app.get("/api/quotes", function (request, response) {
  // response.send(quotes);
  response.json({ success: "All the quotes", message: quotes }); // Indicate success
});

app.get("/api/quotes/random", function (request, response) {
  //return response.json(pickFromArray(quotes));
  response.json({ success: "Random Quote", message: pickFromArray(quotes) }); // Indicate success
});

/*
Allow the user of your quotes API to search your list of quotes.

It should work with requests like this one:

/quotes/search?term=life
/quotes/search?term=success
/quotes/search?term=miss

Make your search case-insensitive
Make the search return matches on quote OR author text.
*/

app.get("/api/quotes/search", function (request, response) {
  if ("query" in request && "term" in request.query) {
    const searchTerm = request.query.term.toLowerCase();
    const results = quotes.filter(
      ({ quote, author }) =>
        quote.toLowerCase().includes(searchTerm) ||
        author.toLowerCase().includes(searchTerm)
    );
    // response.send(results);
    response.json({ success: "Search", message: results }); // Indicate success
  }

  // Otherwise failure
  response.json({ failed: "Failure", message: [] });
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

//...END OF YOUR CODE

//You can use this function to pick one element at random from a given array
//example: pickFromArray([1,2,3,4]), or
//example: pickFromArray(myContactsArray)
//
function pickFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
