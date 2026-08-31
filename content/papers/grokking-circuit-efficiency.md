---
authors: Vikrant Varma, Rohin Shah, Zachary Kenton, János Kramár, Ramana Kumar
---
# Explaining grokking through circuit efficiency

~ *We propose that grokking occurs when the task admits a generalising solution and a memorising solution,
where the generalising solution is slower to learn but more efficient, <span style="color: #FF5A5F;">producing larger logits with the same parameter norm : </span>*

## **$C_{gen}$ (Low-Rank Projection):**
Generalizing features ($\mathbf{h}_{gen}$) capture the true mathematical manifold (e.g., Fourier frequencies for modular addition). Because the data maps to a dense, low-dimensional subspace, the weight vector $\mathbf{w}_{gen}$ perfectly aligns with all inputs ($\cos \theta \approx 1$).

$$z = \vert{}\vert{}\mathbf{w}_{gen}\vert{}\vert{} \cdot \vert{}\vert{}\mathbf{h}_{gen}\vert{}\vert{}$$

A tiny parameter norm $\vert{}\vert{}\mathbf{w}_{gen}\vert{}\vert{}$ naturally yields a massive logit $z$. Efficiency remains constant regardless of dataset size.

## **$C_{mem}$ (High-Dimensional Interpolation):**

Memorization fits unstructured noise. The features ($\mathbf{h}_{mem}$) for $D$ distinct inputs act as near-orthogonal vectors in a high-dimensional space. To output $z = k$ for all $D$ independent points, $\mathbf{w}_{mem}$ must be a linear combination of all $D$ orthogonal vectors:

$$\mathbf{w}_{mem} \approx \sum_{i=1}^D \alpha_i \mathbf{h}_{mem, i}$$
Because they are orthogonal, the squared $L_2$ norm expands additively (Weight decay penalty) #Foundation

## Example
Assume a 3-neuron layer $\mathbf{h} = [h_1, h_2, h_3]$. We want the correct class logit to be $z = 10$.

**$C_{gen}$ (Structured):**

The inputs share a true underlying pattern. Every valid input vector aligns perfectly, e.g., $\mathbf{h} = [10, 10, 10]$.

To achieve $z=10$, the weights only need to be $\mathbf{w}_{gen} = [\frac{1}{3}, \frac{1}{3}, \frac{1}{3}]$.

$\vert{}\vert{}\mathbf{w}_{gen}\vert{}\vert{} = \sqrt{(\frac{1}{3})^2 + (\frac{1}{3})^2 + (\frac{1}{3})^2} \approx 0.57$.

**$C_{mem}$ (Unstructured):**

The network memorizes raw data points. The inputs are uncorrelated and orthogonal: $\mathbf{h}_1 = [10, 0, 0]$, $\mathbf{h}_2 = [0, 10, 0]$, and $\mathbf{h}_3 = [0, 0, 10]$.

To achieve $z=10$ for _every_ independent point, the weights must be $\mathbf{w}_{mem} = [1, 1, 1]$.

$\vert{}\vert{}\mathbf{w}_{mem}\vert{}\vert{} = \sqrt{1^2 + 1^2 + 1^2} \approx 1.73$.

Both circuits output the exact same logit ($10$), but $C_{mem}$ requires a significantly larger parameter norm. Weight decay aggressively penalizes $1.73$ over $0.57$, forcing the network to discard $C_{mem}$ for $C_{gen}$

## Example2:
Assume the hidden representations ($\mathbf{h}_i$) output by the network all have a magnitude of **2** ($\vert{}\vert{}\mathbf{h}_i\vert{}\vert{}_2 = \mathbf{2}$).

We will strictly cap the weight norm budget (the "Weight Tax") at $\vert{}\vert{}\mathbf{w}\vert{}\vert{}_2 = \mathbf{1}$.

### $C_{gen}$ (Structured Manifold)

The true mathematical pattern projects all 4 inputs into the exact same aligned feature space.

- $\mathbf{h}_1 = \mathbf{h}_2 = \mathbf{h}_3 = \mathbf{h}_4 = [2, 0, 0, 0]$
    
- **The Weight:** To maximize the dot product, $\mathbf{w}_{gen}$ points entirely in that single direction: $\mathbf{w}_{gen} = [1, 0, 0, 0]$.
    
- **Budget Check:** $\vert{}\vert{}\mathbf{w}_{gen}\vert{}\vert{}_2 = \sqrt{1^2 + 0 + 0 + 0} = \mathbf{1}$.
    
- **The Logit:** $z = \mathbf{w}_{gen}^T \mathbf{h}_1 = (1 \times 2) = \mathbf{2}$.
    

### $C_{mem}$ (Orthogonal Memorization)

Because memorization fits unstructured noise, it maps the 4 inputs into completely independent, orthogonal dimensions.

- $\mathbf{h}_1 = [2, 0, 0, 0]$
    
- $\mathbf{h}_2 = [0, 2, 0, 0]$
    
- $\mathbf{h}_3 = [0, 0, 2, 0]$
    
- $\mathbf{h}_4 = [0, 0, 0, 2]$
    
- **The Weight:** To predict all 4 points correctly, the weight vector must distribute itself equally across all 4 dimensions: $\mathbf{w}_{mem} = [w, w, w, w]$.
    
- **Budget Check:** To keep the norm budget at exactly **1**, we solve $\sqrt{w^2 + w^2 + w^2 + w^2} = 1 \implies \sqrt{4w^2} = 1 \implies 2w = 1 \implies w = \mathbf{0.5}$.
    
- So, $\mathbf{w}_{mem} = [0.5, 0.5, 0.5, 0.5]$.
    
- **The Logit:** $z = \mathbf{w}_{mem}^T \mathbf{h}_1 = (0.5 \times 2) + 0 + 0 + 0 = \mathbf{1}$

---
~ *We hypothesise that memorising circuits become more inefficient with largertraining datasets while generalising circuits do not:
	**$C_{mem}$:** Memorizes noise via orthogonal vectors. To maintain confidence, its parameter norm must scale by $\sqrt{D}$, causing efficiency to crash as dataset $D$ grows.
    **$C_{gen}$:** Learns the true rule. New data inherently aligns with existing weights, keeping the parameter norm constant and making efficiency completely immune to $D$.
    
	
<span style="color : cyan;">suggesting there is a critical dataset size at which memorisation and generalisation are equally efficient</span>*

~ *we demonstrate two novel and surprising behaviours: <span style="color:yellow;">ungrokking</span>, in which a network regresses from perfect to low test
accuracy, and  <span style="color:yellow;">semi-grokking</span>, in which a network shows delayed generalisation to partial rather than perfect test accuracy *

~ *This paper empirically confirms Nanda et al. (2023)'s [[Progress measures grokking]] theory that grokking is driven by the simplicity and efficiency of the generalizing solution*

~ *We analyse the interplay between the internal mechanisms that the neural network uses to calculate the outputs, which we loosely call “circuits”*

#terminology:In mechanistic interpretability, a **circuit** is a specific **computational subgraph** within a neural network that implements a human-understandable algorithm.
It consists of two core components:
1. **Features (Nodes):** Interpretable directions in the network's activation space (e.g., a "base-10 number" feature).
    
2. **Weights (Edges):** The specific connections routing information between these features.
#terminology #big-idea #Foundation :Mechanistic interpretability is the field of reverse-engineering neural networks. It aims to break down black-box models into human-understandable features, circuits, and algorithms, similar to decompiling software code.


~ *They hypothesise that there are two families of circuits that both achieve good training performance: one which generalises well($C_{\mathrm{gen}}$ ) and one which memorises the dataset ($𝐶_{mem}$ )* #terminology 

~ *<span style="color:teal;">he key insight is that when there
are multiple circuits that achieve strong training performance, weight decay prefers circuits with high efficiency </span>

~ *if $𝐶_{gen}$ is more efficient than $𝐶_{mdm}$ gradient descent can reduce nearly perfect training loss even further by strengthening $𝐶_{gen}$ while weakening $𝐶_{mem}$ : 
1. $C_{\mathrm{gen}}$ generalises well while $C_{\mathrm{mem}}$ does not,
2. $C_{\mathrm{gen}}$ is more efficient than $C_{\mathrm{mem}}$, and
3. $C_{\mathrm{gen}}$ <span style="color: #d14;">is learned more slowly than </span>$C_{\mathrm{mem}}$.*

~ there exists a crossover point at which $C_{\mathrm{gen}}$  becomes more efficient than $C_{\mathrm{mem}}$  , which we call the critical dataset size $D_{\mathrm{crit}}$ 


~ *Given a circuit with perfect training accuracy , he cross entropy loss Lx-ent incentivises gradient descentto scale up the classifier’s logits, as that makes its answers more confident, leading to lower loss; typical neural networks, this would be achieved by making the parameters larger.Meanwhile, weight decay $L{wd}$ pushes in the opposite direction *

~ *When we have multiple circuits that achieve strong training accuracy, this constraint applies to each individually*
~ When we have multiple circuits that achieve strong training accuracy, this constraint applies to
each individually
~ *Intuitively, the answer depends on the
<span style="color: #d14;">efficiency</span> of each circuit, that is, the extent to which the circuit can <span style="color: #d14;">convert relatively small parameters into relatively large logits</span>*

~ $L_{x-ent}$ push toward larger params & $L_{wd}$ push toward smaller --> efficient circuits are stronger (in each local minima)

~ this paper explanation of grokking 
	<p style="color:teal;">
	In the first phase, 𝐶mem is learned quickly, leading to strong train performance and poor test performance. In the second phase,𝐶gen is now learned, and parameter norm is “reallocated” from 𝐶mem to 𝐶gen , eventually leading to amixture of strong 𝐶gen and weak 𝐶mem , causing an increase in test performance
	</p>


--- 
---


~ *Consider a classifier $ℎ_D$ obtained by training on a dataset D of size 𝐷 with weight decay, and a classifier $ℎ_{D^′}$ obtained by training on the same dataset with one additional point: D′ = D ∪ {(𝑥, 𝑦∗)}. 
Intuitively, $ℎ_{D^′}$ cannot be more efficient than $ℎ_{D}$ : if it was, then $ℎ_{D^′}$ would outperform $ℎ_{D}$ even on just D, since it would get similar $L_{x-ent}$ while doing better by weight decay
	If that impossible scenario were true, look at what would happen on just the original dataset $D$:
		Similar Cross-Entropy Loss ($\mathcal{L}_{x\text{-}ent}$):** Both models achieve 100% accuracy on $D$, meaning their performance error on the data is identical.
		**Better Weight Decay Penalty:** Because you assumed $h_{D'}$ is more efficient, its overall weight norm is smaller. Weight decay penalizes large weights ($\frac{\alpha}{2}\Vert{}\theta\Vert{}^2$). A smaller weight norm means $h_{D'}$ pays a **lower weight decay tax**.
		**The Contradiction:** If $h_{D'}$ has the exact same accuracy on $D$ but pays a lower weight decay tax, its **total loss** on $D$ would be lower than $h_D$'s total loss.
So we should expect that,
on average,<span style="color:#FFBF00;">classifier efficiency is monotonically non-increasing in dataset size</span>.

- Let us suppose that ℎD successfully generalises to predict 𝑦∗ for the new input 𝑥
- as we move from D to D′, Lx-ent (ℎD ) likely does not worsen with this new data point
- Now suppose ℎD instead fails to predict the new data point (𝑥, 𝑦∗). 
- Then the classifier learned for D′ will likely be less efficient
- $L_{x-ent}$ would be much higher due to this new data poin
## SO:

~ *We should expect 𝐶gen ’s efficiency to remain unchanged
as 𝐷 increases arbitrarily high*
~ M*ote however that when the set of possible inputs is small, even the maximal 𝐷 may not be “sufficiently large”*

~ we expect for very small datasets that $C_{mem}$ would be more efficient that $C_{gen}$ but with increasing the size D, $C_{mem}$ would become less efficient and there is a size $D_{crit}$ that both $C_{mem}$ and $C_{gen}$ are likely efficient.

## Ungrokking. 
~ *Suppose we take a network that has been trained on a dataset with 𝐷 > $D_{crit}$ and has already exhibited grokking, and continue to train it on a smaller dataset with size 𝐷′ < $D_{crit}$. In this
new training setting, $C_{mem}$ is now more efficient than $C_{gen}$ , and so we predict that with enough further training gradient descent will reallocate weight from $C_{gen}$ to c , leading to a transition from high test performance to low test performance. Since this is exactly the opposite observation as in regulargrokking, we term this behaviour “ungrokking”
	1. Ungrokking can be seen as a special case of catastrophic forgettin
	2. Since ungrokking should only be expected once 𝐷′ < $D_{crit}$, if we vary 𝐷′ we predict that there will be a sharp transition from very strong to near-random test accuracy (around $D_{crit}$)
	3. We predict that ungrokking would arise even if we only remove examples from the training dataset, whereas catastrophic forgetting
## Semi-grokking

~ Suppose we train a network on a dataset with 𝐷 ≈ $D_{crit}$. $C_{gen}$ and $C_{mem}$ would be similarly efficient, and there are two possible cases:
	1. gradient descent would select either $C_{mem}$  or $C_{gen}$  , and then make it the maximal circuit. This could happen in a consistent manner (for example, perhaps since $C_{mem}$  is learned faster it always becomes the maximal circuit), or in a manner dependent on the random initialisation = presence or absence of grokking
	2. In the second case, gradient descent would produce a mixture of both $C_{mem}$  and $C_{gen}$  . Since neither $C_{mem}$  nor $C_{gen}$would dominate the prediction on the test set, we would expect middling test performance =  we only get to middling generalisation unlike in typical grokking


