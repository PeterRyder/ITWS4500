Peter Ryder
Lab 9

For the installer portion of this lab, I assume the user has
installed a MongoDB server and that the MongoD server is running.
Without it the program will crash because it cannot create a
connection to the Mongo server. To install the program, simply
unzip the files and using the command prompt use npm install.
This will install all necessary packages for the program to
work. There is a slight issue with the twitter npm package
which I will explain later.

After installing, the program is very simple. You can grab
tweets from the Twitter API using a search field and an
input for the amount of tweets to get. There is some weirdness
going on with the twitter API, and the twitter node module would
crash after receiving 3 queries. I talked about this in previous
labs. To fix this, I have slightly modified the twitter module
so that it will not crash. I have forked the npm twitter module
and slightly modified it so that the server will not crash. The
changes are very basic, it is just commenting out a couple lines
and replacing them with a print statement. You can see the changes
I made here:

https://github.com/PeterRyder/node-twitter

This does not change the fact that the twitter API still refuses 
to stream data to me after making several queries without 
restarting the server, but I believe this is a rate issue and not 
something I can fix.