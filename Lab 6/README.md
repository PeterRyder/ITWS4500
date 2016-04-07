Peter Ryder
Lab 6

For this lab, I built up from the previous lab and added CSV as
an export option. 

I think that doing the conversion on the server
makes more sense as that is what is getting the data, and that is
where the data is being output. The only good thing about
offloading the conversion to the client would be if it was
computationally intensive, as this would distribute the workload. 
As this is not a computationally intensive task, I think that
doing this work on the server is OK. The Twitter API key is stored
on the server so the client cannot see this information.