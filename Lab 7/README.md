Peter Ryder
Lab 7

For this lab, I again continued on from the previous lab.
I added the Mongo database which will store the tweets 
returned to the user from the API. The way this works is
the server fetches the tweets and sends them to the user.
The user can then see these tweets. If the user decides
they want to store these tweets in the database, the client
unfortunately has to send the tweets back to the server
and the server will then rebuild the database and store
the new tweets. The reason the tweets get passed back and
forth is if there are multiple clients connected the server
should not store which tweets it has sent to what clients.
This creates uneccessary network traffic but I think it is
better.

There is also a button which reads all the tweets from the 
database and creates an xml file of those tweets. The output
functionality from the previous lab remains, and the user can
directly output the tweets they have recieved into JSON or CSV
format on the server.