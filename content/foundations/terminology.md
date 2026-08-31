

OBJECTIVE LANDSCAPE (LOSS LANDSCAPE):
	Training a neural network to model a given dataset entails several steps. First, the network designerchooses a loss function and a network architecture for a given dataset. The architecture is then initialized by populating its weights with random values drawn from some distribution. Finally, the network is trained by adjusting its weights to produce a loss as low as possible. We can think of the training procedure as traversing some path along an objective landscape. 
	<br>Consider a network parameterized by D weights. We can picture its associated objective landscape as a set of “hills and valleys” in D dimensions, where each point in RD corresponds to a value of the loss.
	<br>The paper says **objective landscape** because they want a slightly broader term: in supervised learning it may literally be a loss, but in RL or other optimization problems the objective could be reward or some other scalar criterion.

So:
$$
\boxed{  
\text{loss landscape} ⊆ \text{objective landscape terminology​}
}
$$



saddlepoints: structures which are “valleys” along a multitude of dimensions with “exits” in a multitude of other dimensions ^dauphin-saddles

