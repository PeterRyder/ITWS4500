Peter Ryder
Lab 10

This lab builds off the previous lab by adding a visualize
button to the main page. This button pulls all tweets from
the database and performs three visualizations on them.
The first visualization is a timeline of when tweets were
published. For a small data range this is fairly basic
but with a large enough dataset this could be very
intersting. The second visualization is a word cloud of all
the words used in the tweets gathered from the database.
Words which appear more frequently are larger in the word
cloud. Lastly is another word cloud. This word cloud
represents the username of the tweet with respect to how
many followers they have. The more followers an account has
the large their name appears.

To gather the data, the server pulls the tweets from the
database. The server then outputs 3 files which the client
reads to display the tweets.

Like the last lab, the node server expects a MongoDB instance
to already be running. Simply use 'npm install' to install
the server and then 'npm start' to start the server.