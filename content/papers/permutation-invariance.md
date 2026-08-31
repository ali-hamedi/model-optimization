---
authors: Rahim Entezari, Hanie Sedghi, Olga Saukh, Behnam Neyshabur
---
# The Role of Permutation Invariance inLinear Mode Connectivity of Neural Networks

## Related work

## [[Loss Landscape]]




~ *"Understanding the loss landscape of deep neural networks has been the subject of many studies due to its
close connections to optimization and generalization"*
~ *"One reason behind the abundance of minima is over-parametrization"* #niche

---

~ *"other contributing factor is the existence of scale and permutation invariances which allows the same function to be represented with many different parameter values of the same network and imposes a counter-intuitive geometry on the
loss landscape"* :
	1. Scale Invariance It is entirely about the **network**, not the data. It happens because of positive homogeneity in ReLU activation functions ($f(cx) = c \cdot f(x)$ for $c > 0$)
	2. ### Permutation Invariance Think of it as physically rearranging the order of neurons. If you swap the positions of Neuron A and Neuron B in a hidden layer—moving all their respective incoming and outgoing connections with them—the network computes the exact same final result.
		e.g : 
		Original State: 
			Neuron A: Computes $a = \text{ReLU}(2x_1 + 3x_2)$ and connects to the output with a weight of $5$
			Neuron B: Computes $b = \text{ReLU}(4x_1 + 1x_2)$ and connects to the output with a weight of $8$
			Output: $y = 5a + 8b$
			Permutation :
			New Position A: Now computes $a' = \text{ReLU}(4x_1 + 1x_2)$ and connects to the output with a weight of $8$
			New Position B: Now computes $b' = \text{ReLU}(2x_1 + 3x_2)$ and connects to the output with a weight of $5$
			New Output: $y = 8a' + 5b'$
Because one identical functional solution exists at multiple distinct parameter coordinates, it creates a landscape filled with duplicate, symmetrical minima.It doesn't create more equations to solve; rather, it creates millions of identical, equally correct answers #big-idea

---

~ *and the loss increase on the path between two solutions is often referred to as (energy) barrier* #terminology


~ *Understanding linear mode
connectivity (LMC) is highly motivated by several direct conceptual and practical implications from pruning
and sparse training to distributed optimization and ensemble methods* #areas-of-interest

~ *showed that solutions that are linearly connected with no barrier have the same lottery ticket* [[LMC]]

~ *stability of SGD : SGD solutions
that are linearly connected with no barrier can be thought of as being in the same basin of the loss landscape*

~ *input <-> 100 <-> 100 <-> output nn* :${100! \times 100! \approx 100^{315}}$ permutations 
~ *To overcome the computational challenge of directly evaluating the hypothesis empirically, which requires searching
in the space of all possible permutations, we propose an alternative approach. We consider a set of
solutions corresponding to random permutations of a single xed SGD solution (our model) and show
several empirical evidences suggesting our model is a good approximation for all SGD solutions(real
world) with different random seed : 
	1. **Initialization point 1** → train model → Model A (80% acc.)  → permute hidden layers → fake Model B ( 80% acc) NOTE **it's a permutation so the output is EXACTLY THE SMAE** → energy between A and Fake B = *x*
	2. **Initialization point 2** → train model → Model B (~80% acc.)  → energy between A and B = **same x**

~ *A basin is the slope that pulls parameters down and the valley is the flat floor at the bottom, but the paper uses both interchangeably to mean the exact same low-loss region(no loss spike).* #terminology #base

~ *[Şimşek et al. (2021)]([https://example.com](https://arxiv.org/abs/2105.12221)) showed that adding one extra neuron to
each layer is sucient to connect all these previously discrete minima into a single manifold*

~ *[Fukumizu and Amari (2000)](https://pubmed.ncbi.nlm.nih.gov/10937965/) prove that a point corresponding to the global minimum of a smaller model can be a local minimum or a saddle point of the larger mode* #niche 

~ *[Garipov et al., 2018](https://arxiv.org/abs/1802.10026)  has been observed in the literature that any two minimizers of a deep network can be connected via a non-linear low-loss path(no error spikes ) :*
	It is a mathematically proven fact for overparameterized networks. As long as the model has slightly more capacity than the absolute bare minimum, mathematical proofs guarantee a continuous, non-linear low-loss path exists without error spikes. For practical deep learning models, it is an established fact.

~ ***Barrier Example:** If Models A and B both have 10% error, blending their weights 50/50 reveals the barrier. A 90% midpoint error means a high barrier (0.80 spike) where representations break, while a 10% midpoint error means a zero barrier where direct weight averaging works perfectly.*

~ *Width vs. Barrier ($\propto \frac{1}{x}$  + Double Descent):** The barrier peaks at the exact capacity needed to barely memorize the training data( moving upward till then) then drops as overparameterization adds enough "wiggle room" to melt the isolated valleys together.*

~ *Depth vs. Barrier: As depth increases, aligning the permutations between layers becomes exponentially harder. A slight misalignment in layer 1 cascades and multiplies through layers 2, 3, and so on. This compounding error ruins the perfect linear path, causing the barrier to stay high (saturate) no matter how much you increase the width.*
~ *Task Difficulty vs. Barrier:** Harder tasks increase the loss barrier for shallow networks, but deep architectures stay stubbornly saturated at maximum barrier regardless of task complexity.*


~ **Unit-Rescaling (The one SGD naturally fixes)**
	 Because of ReLU's positive homogeneity, scaling incoming weights by a constant $c > 0$ and outgoing weights by $\frac{1}{c}$ cancels out: $\frac{1}{c}\text{ReLU}(cx) = \text{ReLU}(x)$
	 SGD naturally penalizes unbalanced weight magnitudes. Its implicit bias acts as a regularizer, automatically pushing the network toward a specific, balanced scale. Because SGD resolves this on its own, it is irrelevant for landscape analysis.
~ Permutation of Hidden Units:
	- Here we consider invariances that are in form of permutations of hidden units in each layer of the network, Each layer $i$ with parameters $W_i$ is replaced with $P_i W_i P_{i-1}$.


Paper Conjecture:
### Most SGD solutions belong to a set S whose elements can be permuted in such a way that there is no barrier on the linear interpolation between any two permuted elements in S ( **one massive, universal basin**) #big-idea 


~ ### *The conjecture eec tively means that dierent basins exist because ofthe permutation invariance and if permutation invariance is taken into account (by permuting solutions to remove the barriers between them), there is only one basin, i.e., all solutions reside in the same basin in the loss landscape*
