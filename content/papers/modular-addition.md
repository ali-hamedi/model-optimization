---
authors: Jianliang He, Leda Wang, Siyu Chen, Zhuoran Yang
---
# On the Mechanism and Dynamics of Modular Addition: Fourier Features, Lottery Ticket, and Grokking


---

PRE::
		1. Why am I reading this?
		2. What do I expect it to claim?
		3. Which trench/lens question does it attack?

PRE::

1. more explanation and depth on the mechanistic side of the neural network learning; phase transition in grokking; the initalization critiera in LTH; and the whole emergance critiera

2. more insights on the learning dynamic and how NN learn

3. i want it to give more depth on the emargence of a generalization solution rather than memorizing one



#lens/representation #lens/emergance 

---


the precise way they build internal representations through
gradient-based training and make predictions on new, unseen data is not fully understood 

To gain a clearer view:
	Researchers often simplify the problem by studying how networks solve simple but rich tasks that can be precisely analyzed. By meticulously analyzing the learning process inthese controlled <span style="color:red">"toy"</span> settings
		we can uncover basic mechanisms that may apply more broadly
rior work has established that neural networks trained on modular arithmetic discover a Fourier feature representation [[Progress measures grokking]]
These studies have also highlighted the intriguing grokking [[Grokking]]


* (Q1) Mechanistic Interpretability: How does the trained network leverage its learned Fourier features to implement the modular addition algorithm precisely?
* (Q2) Training Dynamics: How do these specific Fourier features reliably emerge from gradient-based training with random initialization?


## Q1

prior work : neurons learn single-frequency features and exhibit phase alignment
we quantitatively characterize : 1.how these local features are synthesized into a global mechanism 2. network develops a collective diversification condition:
	(i) frequency diversification: The network ensuresthat the full spectrum of necessary Fourier components is represented across the neuron population.
	(ii) phase symmetry: Within each frequency group, neurons exhibit high-order symmetry to ensure the balance required for noise cancellation.

We rigorously prove that this dual condition allows the
network to aggregate the noisy, biased signals of individual neurons into a collective approximation of a flawed indicator function :
### Flawed indicator function

They say the network can:

> approximate a **flawed indicator function on the correct logic**

The ideal classifier would produce

$$
I_j(x,y)
=
\mathbf 1\{j=(x+y)\bmod p\}.
$$

So

$$
I_j=
\begin{cases}
1 & j=\text{correct answer}\\
0 & \text{otherwise}.
\end{cases}
$$

Example: $p=5$, $x=2$, $y=1$, so the correct answer is $3$:

$$
I(x,y)=[0,0,0,1,0].
$$

But the network instead produces something like

$$
[0.1,0.2,0.15,\boxed{1.0},0.2].
$$

So:

$$
\text{flawed indicator}
=
\text{correct signal}
+
\text{structured noise}.
$$

The key is

$$
\boxed{\text{correct index still gets the largest logit}}
$$

so argmax/softmax still gives the correct class.

Mechanistically, many individually noisy neurons combine so that much of the noise cancels while the correct signal reinforces.

> “Flawed” does not mean the algorithm is wrong; it means the internal indicator is imperfect but still reliably points to the correct answer.


and how these patterns emerge from gradient training
from a mean-field perspective driven by the layer-wise phase coupling dynamic:
	**Mean-field:** track the population of neurons.  
	**Phase coupling:** input/output phases of each neuron interact under gradient descent and become locked into ψ=2ϕ

## Q2
To address (Q2), we explain the emergence of these features via lottery ticket mechanism [[LTH]]
Our analysis of the gradient flow reveals a competitive dynamic in which multiple frequency components compete within each individual neuron during training:
	Specifically, by applying the ODE comparison lemma, we prove that the frequency component with the largest initial magnitude and the smallest phase misalignment grows exponentially faster than its competitors, eventually becoming the single dominant "winner"

Finally, having established the underlying mechanism and training dynamics, we can address the final bonus question

(Q3) Memorization to Generalization: How do these mechanisms and dynamics explain the full
timeline of grokking, from memorization to delayed generalization?

<span style="color:yellow">We characterize it as a three-stage process driven by the competition between loss minimization and
weight decay.</span>


## Notation / Setup

### Basic notation

- $\mathbb{N}_+$ = positive integers.
- $[n] = \{1,2,\dots,n\}$.
- $\mathbb{Z}_p = \{0,1,\dots,p-1\}$ with arithmetic modulo $p$.
- $\|\cdot\|_p$ = $\ell_p$-norm.
- For $\nu\in\mathbb{R}^d$, $\nu[i]$ denotes its $i$-th entry.

### Softmax

For $\nu\in\mathbb{R}^d$,

$$
\operatorname{smax}(\nu)_i
=
\frac{\exp(\nu_i)}
{\sum_j \exp(\nu_j)}.
$$

It converts logits into a probability distribution.

### Asymptotic notation

$$
f(x)\lesssim g(x)
\iff
f(x)\le c\,g(x)
$$

for some constant $c>0$.

Equivalent idea:

$$
f(x)=O(g(x)).
$$

Similarly,

$$
f(x)\gtrsim g(x)
$$

means $f$ is lower-bounded by a constant multiple of $g$.

And

$$
f(x)\asymp g(x)
$$

means both directions hold:

$$
f(x)\lesssim g(x)
\quad\text{and}\quad
g(x)\lesssim f(x),
$$

i.e.

$$
f(x)=\Theta(g(x)).
$$

---

## Modular Addition Task

Inputs:

$$
x,y\in\mathbb{Z}_p.
$$

Target:

$$
(x,y)\mapsto (x+y)\bmod p.
$$

Full dataset:

$$
\mathcal D_{\text{full}}
=
\{
(x,y,z)
\mid
x,y\in\mathbb Z_p,\;
z=(x+y)\bmod p
\}.
$$

There are $p^2$ possible input pairs.

The dataset is split into train/test sets to study generalization and grokking.

---

## Two-Layer Neural Network

- $M$ = number of hidden neurons.
- No bias terms.
- Each input $x$ has embedding

$$
h_x\in\mathbb R^d.
$$

The embedding can be:

1. canonical / one-hot:

$$
h_x=e_x\in\mathbb R^p,
$$

so $d=p$,

or

2. trainable:

$$
\{h_x\}_{x\in\mathbb Z_p}\subseteq\mathbb R^d.
$$

### Parameters

For hidden neuron $m$:

$$
\theta_m\in\mathbb R^d
$$

= layer-1 / input-to-hidden weights.

$$
\xi_m\in\mathbb R^p
$$

= layer-2 / hidden-to-output weights.

All parameters:

$$
\theta=\{\theta_m\}_{m\in[M]},
\qquad
\xi=\{\xi_m\}_{m\in[M]}.
$$

### Hidden activation

For neuron $m$:

$$
a_m(x,y)
=
\sigma\left(
\langle h_x+h_y,\theta_m\rangle
\right).
$$

### Network logits

$$
f(x,y;\xi,\theta)
=
\sum_{m=1}^{M}
\xi_m
\,
\sigma\left(
\langle h_x+h_y,\theta_m\rangle
\right)
\in\mathbb R^p.
$$

Mental model:

$$
\boxed{
\text{logits}
=
\sum_m
\text{hidden activation}_m
\times
\text{output-weight vector}_m
}
$$

### Activations

Experiments:

$$
\sigma(x)=\max(x,0)
$$

(ReLU)

Theory:

$$
\sigma(x)=x^2
$$

(quadratic activation).

### Classification

The logits are passed through softmax:

$$
\operatorname{smax}(f(x,y))
$$

to obtain probabilities over the $p$ possible answers.

Correct class:

$$
(x+y)\bmod p.
$$

### Cross-entropy loss

Conceptually:

$$
\ell_{\mathcal D}(\xi,\theta)
=
-\sum_{(x,y)\in\mathcal D}
\log
\left[
\operatorname{smax}(f(x,y))_{(x+y)\bmod p}
\right].
$$

So:

$$
\boxed{
(x,y)
\rightarrow
h_x+h_y
\rightarrow
\text{hidden neurons}
\rightarrow
\text{logits}
\rightarrow
\text{softmax}
\rightarrow
\text{CE loss}
}
$$

![[img7.png]]

D:: so inputs are X and Y which are a number in $[p]$, meaning they are in $\{0,\ldots,p-1\}$; then we embed them into $\mathbb{R}^D$ either via a learnable embedding or a one-hot embedding ($D=p$).
	let's take the canonical one-hot embedding ; X and Y turn into $X_{23 * 1}$ and $Y_{23*1}$ vectors which we have then to apply to layers $\theta_{512*23}$ and $\xi_{23*512}$ ; 

Then for input
$$
h_x+h_y\in\mathbb{R}^{23},
$$
you get all hidden preactivations via
$$
\Theta(h_x+h_y)\in\mathbb{R}^{512}.
$$
each row of $\theta$ namely $\theta_m$(the m'th row): contain 23 entries across row 5 form the Fourier/cosine pattern 
	$\theta_m[j]$ is the **value of the cosine wave at position $j$**.

Example: neuron 5 learns frequency $k=3$
Suppose

$$
\varphi(5)=3,
\qquad
\omega_3=\frac{2\pi\cdot3}{23}.
$$

and

$$
\alpha_5=2,
\qquad
\phi_5=0.4.
$$

Then

$$
\theta_5[j]
=
2\cos\left(\frac{6\pi}{23}j+0.4\right).
$$

So, for example,

$$
\theta_5[0]=2\cos(0.4),
$$

$$
\theta_5[1]
=
2\cos\left(\frac{6\pi}{23}+0.4\right),
$$

$$
\theta_5[2]
=
2\cos\left(\frac{12\pi}{23}+0.4\right),
$$

and so on up to $\theta_5[22]$.

### Fourier notation

$$
\varphi:[M]\to\left[\frac{p-1}{2}\right]
$$

$\varphi(m)$ assigns neuron $m$ a Fourier frequency index.

For $p=23$:

$$
\varphi(m)\in\{1,\dots,11\}.
$$

Example:

$$
\varphi(5)=3
$$

means neuron 5 uses frequency $k=3$.

---

$$
\alpha_m,\beta_m\in\mathbb R_+
$$

are the amplitudes/magnitudes of the input- and output-layer Fourier waves.

$$
\phi_m,\psi_m\in[-\pi,\pi)
$$

are their phases. This interval represents one full $2\pi$ cycle; e.g.

$$
\frac{3\pi}{2}\equiv-\frac{\pi}{2}.
$$

---

$$
\omega_k=\frac{2\pi k}{p}
$$

converts discrete frequency index $k$ into angular frequency.

For $p=23$:

$$
k=3
\Rightarrow
\omega_3=\frac{6\pi}{23}.
$$

Mental model:

$$
\boxed{
k=\text{frequency label},
\quad
\omega_k=\text{actual angular frequency}
}
$$

$p$ determines the available Fourier frequency grid; $\varphi(m)$ determines which one neuron $m$ learns.

By taking the **DFT / Fourier transform of those 23 numbers**.
So the logic is:
$$
23\text{ weights} \rightarrow \text{DFT} \rightarrow \text{spectrum} \rightarrow \text{one dominant }k \rightarrow \boxed{\text{single-frequency Fourier feature}}.
$$

And “wave” is just because the inverse form of one Fourier frequency is a sinusoid:

#### WHY the $[\frac{p-1}{2}]$?
For p=23p=23, a length-23 real vector has 23 Fourier degrees of freedom.

You can write it in the real Fourier basis as
$$
\theta[j] = c_0 + \sum_{k=1}^{11} \left[ a_k\cos\left(\frac{2\pi kj}{23}\right) + b_k\sin\left(\frac{2\pi kj}{23}\right) \right].
$$
Count them:

1+2(11)=23.

So:

- 1 constant component
- 11 cosine components
- 11 sine components

= exactly 23 dimensions.


$$
\cos\left(\frac{2\pi (23-k)j}{23}\right) = \cos\left(\frac{2\pi kj}{23}\right),
$$
while
$$
\sin\left(\frac{2\pi (23-k)j}{23}\right) = -\sin\left(\frac{2\pi kj}{23}\right).
$$
So k=22 gives no genuinely new real frequency beyond k=1; k=21 duplicates k=2, etc


----
---
---

After= applying a Discrete Fourier Transform  each neuron is represented by a single active frequency φ(m)
~ *Henceforth refer to αm and ϕm as the input magnitude and phase, and to βm and ψm the output magnitude and phase for neuron m.


![[img8.png]]

### Fig. 2A — DFT heatmap

Each row = one neuron’s 23 weights after converting them into the Fourier basis:
$$
[\text{const},\cos1,\sin1,\cos2,\sin2,\dots,\cos11,\sin11].
$$
If a neuron were a messy mix of frequencies, many columns in that row would light up.

Instead, each row is concentrated around one ($\cos k$,$\sin k$) pair:

 $\boxed{\text{one neuron} \approx \text{one Fourier frequency}}$

The cos/sin pair together represent one shifted cosine:
$$
A\cos(\omega_k j+\phi).
$$
Top heatmap = first-layer $\theta_m$.  
Bottom heatmap = second-layer $\xi_m$.  
For the same neuron, both usually concentrate at the same frequency.

### Fig. 2B — direct weight plot

Here they simply plot the actual 23 learned weights:
$$
j=0,\dots,22 \quad\text{vs}\quad \theta_m[j]\ \text{or}\ \xi_m[j].
$$
Blue = learned weights, red = fitted cosine.
The near-perfect overlap visually confirms the DFT result:
$$
\boxed{\text{the 23 weights themselves form a sinusoid.}}
$$

![[img9.png]]

D::
	in the first observation they showed that each neuron learns a single-frequency of the fourier-transform (neuron learning are sperated and the represntation is sparse)
	Now they show that the layers learning is not seperated and they are actually colaborative result is:
		feature emergence is structured across layers, while may be sparse within layers
![[img10.png]]
### Within-frequency-group structure

For neurons that learned the same frequency:

- phases are roughly uniformly spread over $[-\pi,\pi)$;
- magnitudes $\alpha_m,\beta_m$ are nearly equal.
the phases are spread roughly uniformly around the circle, rather than all clustering at one angle.

So you might see phases like

−π,−2,−1,0,1,2,…

So if one group has, say,

$\alpha_m \approx 0.5,\qquad \beta_m\approx0.6$

most neurons in that group have similar scale.
$$
\boxed{\text{same frequency} \Rightarrow \text{spread phases + similar scales}}
$$

+

every allowed Fourier frequency k=1,…,p−12 has at least one neuron assigned to it
$$
\boxed{\text{every allowed Fourier frequency }k=1,\dots,\frac{p-1}{2}\text{ has at least one neuron assigned to it}}
$$
WE illustrates the uniformity of phases within a specific frequency group Nk by examining the higher-order symmetry, i.e., the symmetry of ιϕm for ι ∈ {1, 2, 3, 4}. Both the visualizations
and the quantitative averages of sine and cosine values support the within-group uniformity claim stated in Observation 
### Higher-order phase symmetry

Within one frequency group $N_k$, the neuron phases are

$$
\phi_1,\phi_2,\dots
$$

Observation 3 claims they are approximately uniform on the circle.

To test this more strongly, the authors examine

$$
\iota\phi_m,
\qquad
\iota\in\{1,2,3,4\},
$$

modulo $2\pi$.

Why?

A phase distribution may look spread out but still contain hidden structure.

Example:

$$
\phi\in
\left\{
0,\frac{\pi}{2},\pi,\frac{3\pi}{2}
\right\}.
$$

Looks uniform-ish, but multiplying by $4$ gives

$$
4\phi\equiv0\pmod{2\pi},
$$

so all phases collapse to one point.

They also check

$$
\frac{1}{|N_k|}
\sum_{m\in N_k}\cos(\iota\phi_m)
\approx0,
$$

$$
\frac{1}{|N_k|}
\sum_{m\in N_k}\sin(\iota\phi_m)
\approx0.
$$

For a truly uniform phase distribution, these averages should vanish.

$$
\boxed{
\text{higher-order symmetry checks that no hidden low-order phase clustering remains}
}
$$


{. While previous work (e.g., Kumar et al., 2024), has introduced
the phase uniformity to provide a constructive model that solves modular addition, our findings significantly refine the understanding. Through empirical validations, we show that this phase uniformity is a consistent when M is large.} 
--> previous work: claimed uniform phases as the cause for solving the modular addition task but they claim that is a part of the mechanic and emerges if M is large enough



![[img11.png]]
~ *Finally, we report a surprising adaptivity in the learned
parametrization: the network continues to perform perfectly when ReLU is replaced by a broad class of alternative activations at the test time* :
	they train the model and at test-time they replace the activation function ReLU with one of these functions:
		ReLU($max\{x,0\}$), |x|, $x^2$, $x^4$, $x^8$ , $log(1 + e^{2x})$, $e^x$, $x$, $x3$,

Then we replace the ReLU activation to other activation functions thathas nonzero even-order components, e.g., |x|, x2, and x4, the resulting models still have perfect
prediction accuracy. However, suppose we replace ReLU to an activation wihout any even-ordercomponent, e.g., x and x3, the prediction accuracy is close to zero 

>This suggests that the key
property of ReLU activation is that it has even-order components

$$
\boxed{ \text{because of the network's phase symmetry, the sign-sensitive part of ReLU cancels, leaving its sign-insensitive }|x|\text{ part} }
$$



<i style="font-size:12px">Motivated by this key observation, in the sequel, we analyze the training dynamics of how two-layer neural networks solve modular addition using the more tractable quadratic activation.</i>

![[img12.png]]

![[img13.png]]

### Frequency competition / lottery-ticket dynamics

For each neuron-frequency pair $(m,k)$:

$$
D_m^k=(2\phi_m^k-\psi_m^k)\bmod 2\pi
$$

measures phase misalignment.

The dynamics satisfy roughly:

$$
\text{magnitude growth} \propto \cos(D_m^k)
$$

$$
\text{phase movement} \propto \sin(D_m^k)
$$

So frequencies with larger initial magnitude and better phase alignment tend to grow faster and dominate:

$$
\boxed{
\text{good init magnitude + good alignment}
\rightarrow
\text{faster growth}
\rightarrow
\text{winning frequency}
}
$$

This is the paper's lottery-ticket-style frequency selection mechanism.

### Circular phase distance

Because phase is circular,

$$
D=\epsilon
$$

and

$$
D=2\pi-\epsilon
$$

are equally close to alignment.

Useful distance:

$$
\delta(D)=\min(D,2\pi-D).
$$

Example:

$$
D=0.2
\quad\text{and}\quad
D=2\pi-0.2
$$

have the same alignment quality since

$$
\cos(0.2)=\cos(2\pi-0.2).
$$

But their sine signs differ, so they move toward zero from opposite directions.

### Figure 4

**Fig. 4a left:** phase misalignment of every frequency inside one neuron.  
They re-center $D$ from $[0,2\pi)$ to $(-\pi,\pi]$, so perfect alignment is at $0$ and trajectories can approach from either side.

**Fig. 4a middle:** magnitude of each frequency. The winning frequency grows much faster and dominates.

**Fig. 4b:** final magnitude as a function of initial magnitude and phase misalignment.

$$
\boxed{
\text{larger initial magnitude + smaller circular misalignment}
\Rightarrow
\text{larger final magnitude}
}
$$

$$
\boxed{ \text{large initial magnitude} + \text{phase close to }0\text{ or }2\pi \Rightarrow \text{large final magnitude} }
$$
(initial magnitude,initial phase)→eventual growth​



#### Grokking: From Memorization to Generalization

we identify two primary driving forces behind the dynamics: loss minimization and weight decay. These forces guide the training process through an initial memorization phase followed by two generalization stages

The morization phase is dominated by loss minimization, causing the model to fit the training data with its parameter norms increasing rapidly. As a result, the model achieves perfect accuracyon the training data and their symmetric counterparts in the test set (due to the exchangability of
the two input numbers), but completely fails to generalize to truly “unseen” test points 

At this phase, all the frequency components in one neuron keep growing but at different pacesimilar to the lottery ticket mechanism described previously, resulting in a perturbed Fourier solution that overfits the training data.


Next, the model enters the first generalization stage, which is characterized by a precise interplaybetween the two forces. We conclude that both forces are active because the parameter norms
continue to grow, which is a clear indicator of ongoing loss minimization. At the same time,weight decay induces a sparsification effect in the frequency domain. Specifically, the one frequency component that dominates in the lottery ticket mechanism continues growing, while weight decay
refines the learned sparse features by pruning the remaining components, making it closer to the clean single-frequency solution for each neuron and causing the test loss to drop sharply.
This dynamic culminates in a turning point around step 10,000, which marks the onset of the second and final
generalization stage. From this point, weight decay becomes the dominant force, slowly pushing the test accuracy toward a perfect score.

![[img14.png]]
Only after mastering the common data does the model shift its focus to the second phase: memorizing these rare examples
that appear only once.

C & D:: The paper [[Explain Grokking circuit efficiency]] make it two phases and explain the shift from memorizing to generalization as a more efficient solution (efficient solution being : yield bigger logits for the same parameter norm OR in real scenarios: smaller parameter norm for same logits) : they here exapnd and look through another lens ; they make the memorization into 2 parts : memorizing the common patterns then the rare patterns (seem interesting) then they make the generaliziation phase into 2 parts where in the first part where in the first part weight-decay work in collabration with  the optimizer and the result in the parameter-representation terms in the parameter step is the derivation of one single fourier frequency in each neuron while silencing the rest qoute <span style="color:cyan">(while weight decay
refines the learned sparse features by pruning the remaining components, making it closer to
the clean single-frequency solution for each neuron)</span> and then the next part of the generalization where the weight decay become the dominant force and reduce the weight norm 
BUT :![[img15.png]]
in their presented graph; the first part of the generalization (weight-decay & optimizer ) is where most of the work is done so it would raise the Q:: is weight decay the sole responsible mechanism for introducing sparsity? or in this context filtering out other fourier frequencies and in the Explain-grokking-thorugh-circuit-efficiency the main driving factor cause C:: [[Understanding DL requires rethinking Generalization]] shows that explicit-reguralizaiton methods alone are not ensured to cause generlizaiton they to do not usually (alex-net + data aug execption in their paper) prevent the model from memroizing the data in a setup where there are no other choices and here the authors make me thing that it's not the main factor in the switching from memorizing to generalization

H:: if the intializaiton select a dominanat fourier frequency [[LTH]] and SGD tends to work as an implicit regularizer [[Understanding DL requires rethinking Generalization]] and weight-decay is not the main role in the deriving sparse fourier frequencies; can we reach same generalization without it? or can we have a faster "grokking" with better initalizaiton ? or can we force the foruier frequency selection upon initalization and do one shot pruning ? [[Random Tickets can win]]

CLEAN UP OF THE ABOVE HYPOTHESIS : <pre style='font-size:14px'>{H:: In modular addition, initialization may largely determine which Fourier 
feature becomes dominant, while optimization amplifies that feature and
weight decay mainly removes residual competing components.

If so:

1. Is weight decay necessary for generalization, 
	or mainly for accelerating/cleaning the transition?
2. Can better initialization shorten or eliminate the grokking delay?
3. Can we initialize neurons near the eventual single-frequency 
	solution and obtain immediate generalization?
4. Can the winning Fourier components be identified at/near initialization 
	and the rest pruned early, analogous to LTH / Random Tickets?
}</pre>

#### Mechanistic Interpretation of Learned Model

We show that the trained model effectively approximates an
indicator function via a majority-voting scheme within the Fourier space 
	H & C:: maybe a new convention/prespective for the phase change from memorize-to-generalize 

Single-Neuron Contribution and Majority Voting
### Deriving the contribution of one neuron

For simplicity, define

$$
k=\varphi(m),\qquad
\omega=\omega_k,\qquad
\phi=\phi_m.
$$

From Observation 1,

$$
\theta_m[t]
=
\alpha_m\cos(\omega t+\phi).
$$

From phase alignment,

$$
\psi_m=2\phi,
$$

so

$$
\xi_m[j]
=
\beta_m\cos(\omega j+2\phi).
$$

We use one-hot inputs and quadratic activation

$$
\sigma(z)=z^2.
$$

---

#### Step 1 — Hidden preactivation

Because $e_x,e_y$ are one-hot,

$$
\langle e_x+e_y,\theta_m\rangle
=
\theta_m[x]+\theta_m[y].
$$

Therefore

$$
=
\alpha_m\cos(\omega x+\phi)
+
\alpha_m\cos(\omega y+\phi).
$$

Using

$$
\cos A+\cos B
=
2\cos\frac{A-B}{2}\cos\frac{A+B}{2},
$$

we get

$$
\boxed{
z_m
=
2\alpha_m
\cos\left(\frac{\omega(x-y)}2\right)
\cos\left(\frac{\omega(x+y)}2+\phi\right)
}
$$

---

#### Step 2 — Quadratic activation

$$
\sigma(z_m)=z_m^2
$$

so

$$
\boxed{
\sigma(z_m)
=
4\alpha_m^2
\cos^2\left(\frac{\omega(x-y)}2\right)
\cos^2\left(\frac{\omega(x+y)}2+\phi\right)
}
$$

This is still **one scalar**.

---

#### Step 3 — Convert scalar activation into logits

Neuron $m$ has output vector

$$
\xi_m\in\mathbb R^p.
$$

Its contribution to output class $j$ is

$$
f^{[m]}(x,y)[j]
=
\xi_m[j]\sigma(z_m).
$$

Since

$$
\xi_m[j]
=
\beta_m\cos(\omega j+2\phi),
$$

ignoring positive magnitude constants,

$$
f^{[m]}(x,y)[j]
\propto
\cos^2\left(\frac{\omega(x-y)}2\right)
\cos(\omega j+2\phi)
\cos^2\left(\frac{\omega(x+y)}2+\phi\right).
$$

---

#### Step 4 — Expand the squared cosine

Using

$$
\cos^2 u=\frac12(1+\cos2u),
$$

$$
\cos^2\left(\frac{\omega(x+y)}2+\phi\right)
=
\frac12
\left[
1+\cos(\omega(x+y)+2\phi)
\right].
$$

Therefore,

$$
f^{[m]}[j]
\propto
\cos^2\left(\frac{\omega(x-y)}2\right)
\cos(\omega j+2\phi)
\left[
1+\cos(\omega(x+y)+2\phi)
\right].
$$

Expand:

$$
\propto
\cos^2\left(\frac{\omega(x-y)}2\right)
\left[
\cos(\omega j+2\phi)
+
\cos(\omega j+2\phi)
\cos(\omega(x+y)+2\phi)
\right].
$$

Use

$$
2\cos A\cos B
=
\cos(A-B)+\cos(A+B).
$$

With

$$
A=\omega j+2\phi,
\qquad
B=\omega(x+y)+2\phi,
$$

we get

$$
A-B=\omega(j-x-y)
$$

and

$$
A+B=\omega(x+y+j)+4\phi.
$$

Since $\cos(-u)=\cos(u)$,

$$
\cos(\omega(j-x-y))
=
\cos(\omega(x+y-j)).
$$

Thus

$$
\boxed{
f^{[m]}(x,y)[j]
\propto
\cos^2\left(\frac{\omega(x-y)}2\right)
\left[
\cos(\omega(x+y-j))
+
2\cos(\omega j+2\phi)
+
\cos(\omega(x+y+j)+4\phi)
\right]
}
$$

![[img16.png]]
Here, $\cos(\omega_k(x+y-j))$ provides the primary signal, whose value peaks exactly at $j=(x+y)\bmod p$, while the remaining terms act as residual noise whose amplitude and sign depend on the chosen <u>frequency</u> $k$, <u>phase</u> $\phi_m$, and <u>input pair</u> $(x,y)$.


So the structure is:
$$
\boxed{ \text{neuron contribution} = \text{input-dependent strength} \times (\text{correct-answer signal}+\text{phase noise}) }
$$
That is the whole equation.


Majority-Voting Approximates Indicator via Overparameterization.


they first start by showing diversification : aka. model represent all of the frequencies for k=(p-1)/2

A:: they do not prove that the diversification comes from the overparameterization they just mention that "when M is suf-
ficiently large, the model naturally learns completely diver-
sified neuron every frequency k is represented, and the
phases exhibit uniform symmetry"

and they define their defenition of diversification as:
### Definition 4.1 — Full Diversification

The authors formalize the idea:

> many diverse neurons can cancel their individual phase-dependent noise while preserving the shared useful signal.

A neuron population is **fully diversified** if three conditions hold.

---

#### (i) Equal frequency coverage

Define

$$
N_k=\{m:\varphi(m)=k\}
$$

as the neurons whose dominant Fourier frequency is $k$.

They require

$$
|N_k|=N
$$

for every frequency $k$.

So every frequency gets the same number of neurons.

For $p=23$, there are $11$ frequencies. If $N=20$:

$$
20\text{ neurons per frequency}
$$

and

$$
M=11N=220.
$$

Meaning:

$$
\boxed{\text{all frequencies are equally represented}}
$$

This exact balance is an idealization; empirically it is only approximate for large $M$.

---

#### (ii) Equal effective scale

They require

$$
\alpha_m\beta_m^2=a
$$

for all neurons.

Interpretation:

$$
\boxed{\text{all neurons have roughly equal voting strength}}
$$

so no single neuron dominates the aggregate simply because its magnitude is much larger.

---

#### (iii) Phase-dependent noise cancellation

One neuron contributes roughly

$$
\text{strength}\times
\left[
\underbrace{\cos(\omega_k(x+y-j))}_{\text{signal}}
+
\underbrace{2\cos(\omega_kj+2\phi_m)}_{\text{noise 1}}
+
\underbrace{\cos(\omega_k(x+y+j)+4\phi_m)}_{\text{noise 2}}
\right].
$$

The useful term is phase-independent:

$$
\cos(\omega_k(x+y-j)).
$$

The two noise terms depend on

$$
2\phi_m
\quad\text{and}\quad
4\phi_m.
$$

So for every frequency group $N_k$, they require

$$
\sum_{m\in N_k}e^{i2\phi_m}=0
$$

and

$$
\sum_{m\in N_k}e^{i4\phi_m}=0.
$$

Since

$$
e^{i\theta}=\cos\theta+i\sin\theta,
$$

this implies, e.g.,

$$
\sum_m\cos(2\phi_m)=0,
\qquad
\sum_m\sin(2\phi_m)=0.
$$

Therefore

$$
\sum_{m\in N_k}\cos(A+2\phi_m)=0,
$$

so the $2\phi_m$ noise cancels.

Similarly,

$$
\sum_{m\in N_k}\cos(B+4\phi_m)=0,
$$

so the $4\phi_m$ noise cancels.

But the useful signal has no $\phi_m$, so it reinforces:

$$
\sum_{m\in N_k}
\cos(\omega_k(x+y-j))
=
N\cos(\omega_k(x+y-j)).
$$

Thus:

$$
\boxed{\text{phase-dependent noise cancels}}
$$

while

$$
\boxed{\text{shared useful signal adds}}
$$

---

### Mental model

Full diversification means

$$
\boxed{
\text{equal frequency coverage}
+
\text{equal neuron scale}
+
\text{phase-noise cancellation}
}
$$

which gives

$$
\boxed{
\text{many noisy individual votes}
\rightarrow
\text{clean collective signal}
}
$$

This is the paper's "majority voting" idea.

Important caveat:

$$
\boxed{\text{Full Diversification is a sufficient idealized condition, not something every successful network must satisfy exactly.}}
$$

### Proposition 4.2 — Whole Mechanism

Under:

- single-frequency Fourier neurons;
- phase alignment;
- full diversification;

the proof chain is:

$$
\boxed{
\text{single neuron}
\rightarrow
\text{signal + phase-dependent noise}
}
$$

$$
\boxed{
\text{phase diversification}
\rightarrow
\text{phase-noise cancellation}
}
$$

$$
\boxed{
\text{balanced frequency coverage}
\rightarrow
\text{sum over all Fourier frequencies}
}
$$

Using Fourier orthogonality,

$$
\sum_k \cos(\omega_k z)
=
-\frac12
+
\frac p2\mathbf 1\{z=0\pmod p\},
$$

so the network becomes an indicator-like classifier.

---

### Final logit formula

$$
f(x,y;\xi,\theta)[j]
=
\frac{aN}{2}
\left[
-1
+
\frac p2\,\mathbf 1\{x+y\bmod p=j\}
+
\frac p4
\sum_{z\in\{x,y\}}
\mathbf 1\{2z\bmod p=j\}
\right].
$$

Interpretation:

- $-1$ = common baseline;
- $x+y\bmod p$ = true-signal peak;
- $2x\bmod p$ and $2y\bmod p$ = spurious/noise peaks.

So the model is a **flawed indicator**:

$$
\boxed{
\text{large correct peak}
+
\text{two smaller spurious peaks}
}
$$

---

### Why prediction is still correct

The true-signal bonus is

$$
\frac p2,
$$

while each noise bonus is

$$
\frac p4.
$$

After multiplying by $\frac{aN}{2}$, the correct logit exceeds a spurious peak by

$$
\boxed{
\Delta
=
\frac{aNp}{8}
}
$$

so the correct class always has the largest logit.

---

### Softmax guarantee

If the correct logit exceeds every wrong logit by at least $\Delta$, then

$$
P_{\text{correct}}
\ge
\frac{1}
{1+(p-1)e^{-\Delta}}.
$$

To make the softmax output within error $\epsilon$ of the correct one-hot vector, it is enough that

$$
\Delta
\gtrsim
\log\frac p\epsilon.
$$

Since

$$
\Delta=\frac{aNp}{8},
$$

this gives

$$
\boxed{
a
\gtrsim
\frac{1}{Np}\log\frac p\epsilon
}
$$

up to constant factors.

So:

$$
\boxed{
\text{larger }aN
\rightarrow
\text{larger logit gap}
\rightarrow
\text{sharper softmax}
\rightarrow
\text{prediction closer to perfect one-hot}
}
$$
### Gradient-flow simplification

<span style="color:cyan">Gradient descent</span>:

$$
\Theta_{t+1}=\Theta_t-\eta\nabla\ell(\Theta_t)
$$

<span style="color:cyan">Gradient flow</span> = continuous-time version:

$$
\frac{d\Theta}{dt}=-\nabla\ell(\Theta)
$$

Used so they can analyze phase/magnitude dynamics with ODEs.

For theory, each neuron starts with <span style="color:orange">one Fourier frequency only</span>, rather than a mixture of many frequencies.

So first they study:

$$
\text{one frequency} \rightarrow \text{how magnitude + phase evolve}
$$

Then §6.1 brings back <span style="color:orange">multi-frequency competition</span>.


1. <span style="color:cyan">Frequency preservation</span>  
   If only frequency $k^\star$ is nonzero initially, all other frequencies stay zero during gradient flow.

2. <span style="color:orange">Phase alignment</span>  

$$
2\phi_m^\star(t)-\psi_m^\star(t)\to 0
$$

So:

$$
\text{start single-frequency}
\rightarrow
\text{stay single-frequency}
\rightarrow
\text{phases align}.
$$


### Remark 5.1 — Small Init ≈ Margin Maximization

At small initialization:

$$
f[j]\approx 0
$$

so

$$
e^{f[j]}\approx 1+f[j],
\qquad
\log(1+x)\approx x.
$$

Therefore cross-entropy becomes approximately

$$
\ell_{\mathrm{CE}}
\approx
-\left(
f[c]-\frac1p\sum_j f[j]
\right)
+\text{const}
=
-\ell_{\mathrm{AM}}+\text{const}.
$$

So early training approximately does:

$$
\boxed{\text{increase correct logit above average logit}}
$$

<span style="color:orange"><b>Takeaway:</b></span>  
Early feature emergence can be analyzed through a simpler margin objective instead of full softmax CE.

<span style="color:#999">Limitation:</span> this only holds while logits remain small.


### 6 Theoretical Extensions

