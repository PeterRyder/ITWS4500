Peter Ryder
Lab 8

This lab was slightly ambiguous in its directions, however
I think the site I created demonstartes the skills required
by the lab. The site is very simple presenting an input
box and a button to the user. In the input box, the user
can write queries using the SPARQL language. An example of
this would be:

select distinct ?Concept where {[] a ?Concept}

This is the example text shown when going to the query
editor. Any SPARQL query can be put into the input box.
A limit of 10 will automatically be added to the query,
so putting it in the query is not needed. A table is then
returned and presented to the user. I do not like the JSON
returned by the API as the query is the key for the values
being returned, and this does not make much sense to me.
That being said, the data can be returned by the API in
many different outputs, and an HTML table is one of those
ways.