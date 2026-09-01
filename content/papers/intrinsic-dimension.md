---
authors: Chunyuan Li,Heerad Farkhoor, Rosanne Liu, and Jason Yosinski
---
# MEASURING THE INTRINSIC DIMENSION OF OBJECTIVE LANDSCAPES

---
PRE::
		1. Why am I reading this?
		2. What do I expect it to claim?
		3. Which trench/lens question does it attack?

PRE::

1 Why am I reading this? to get insights on a form "how many degrees of freedom / parameters to reach a good solution"

2 What do I expect it to claim? relation between parameter/weights/architecture to the solution/result/generalizaiton
	expect it to argue that the effective dimensionality of a solvable objective is much smaller than the raw parameter count, and that overparameterization adds redundancy rather than proportionally more task complexity.
	

3 Which trench/lens question does it attack?
memorizing-generalization trade off
#lens/representation #lens/geometry 

---

~ *One may intuitively use the number of parameters required as a rough gauge of the difficulty of a problem*
~ <span style="color:yellow"><i>How many parameters are really needed</i></span>*
	*we attempt to answer this question by training networks not in their native parameter space,  <span style="color:teal;">but instead in a smaller, randomly oriented subspace</span>*
	We slowly increase the dimension of this subspace, note at which dimension solutions first appear, and define this to be the <u>intrinsic dimension</u> of the <span style="font-weight:bold">objective landscap</span>

<div style="color:#FF7F50;text-align:center"> This latter result has the profound implication that once a parameter space is large enough to solve a problem, extra parameters serve directly to increase the dimensionality of the solution manifold</div>
meaning: once the network has enough parameters , adding more parameters: add more directions in parameter space along which you can change the weights and still remain at a solution.

D:: not yet specified that it creates new valleys/basins or exapnd the DoF in the same basin; 
A:: but for sure adding more parameters increase the chance to overfit (domain knowledge , industary standard)
	Q:: is less params -> more chance to generalize?
	Q:: let's we move from 0 params to $\infty$ params; do we reach generalization or memorizing faster??


In addition to providing new 1. cartography of the objective landscapes wandered by parameterized models, the method
is a simple technique for 2. constructively obtaining an upper bound on the minimum description length of a solution
	3. A byproduct of this construction is a simple approach for compressing networks, in some cases by more than 100 times

[[TERMINOLOGY#^dauphin-saddles]] showed that, in contrast
to conventional thinking about getting stuck in local optima (as one might be stuck in a valley in our familiar D = 2), local critical points in high dimension are almost never valleys but are instead saddlepoint 


In this paper we seek further understanding of the structure of the objective landscape by restricting training to random slices through it, allowing optimization to proceed in randomly generated sub spaces of the full parameter space. Whereas standard neural network training involves computing a gradient and taking a step in the full parameter space ($R^D$ above), we instead choose a random
d-dimensional subspace of $R^D$ , where generally d < D, and optimize directly in this subspace


Gradually larger values of d, we can find the subspace dimension at
which solutions first appear, which we call the measured intrinsic dimension of a particular problem.


### DEFINING AND ESTIMATING INTRINSIC DIMENSION

- $θ(D)$ $∈$ $R^D$ be a parameter vector in a parameter space of dimension D
- let $θ(D)$ be a randomly chosen initial parameter vector
- let $θ(D)_∗$ be the final parameter vector arrived at via optimization
- Denoting as s the dimensionality of the solution set\
- intrinsic dimensionality $d_{int}$ of a solution as the codimension of the solution set inside of $R^D$
$$
D = d_{int} + s
$$

example:
	let D = 1000 and where θ(D) optimized to minimize a squared error cost function that requires the first 100 elements to sum to 1, the second 100 elements to sum to 2, and so on until the vector has been divided into 10 groups with their requisite 10 sums; 
	With a little algebra, one can find that the manifold of solutions is a 990 dimensional hyperplane
	Here the intrinsic dimension dint is 10 (1000 = 10 + 990)
	$d_{int}$=10,D=1000,s=990

The above example had a simple enough form that we obtained dint = 10 by calculation. But in general we desire a method to measure or approximate dint for more complicated problems,
including problems with <u><b>data-dependent</b></u> objective function

<span style="color:#FF7F50;font-weight:bold;">Random subspace optimization provides such a method</span>

Standard optimization a.k.a. "direct method of training"->
evaluating the gradient w.r.t $θ(D)$ and steps in $θ(D)$ space

we define:
$$
θ(D) = θ_0(D) + Pθ^{(d)} 
$$
	- P is a randomly generated D × d projection matrix
	- $θ^{(d)}$ is a parameter vector in a generally smaller space $R_d$ 
	- $θ_0(D)$ are the initalized(randomly generated and frozen) weights
	- P is also randomly  generated and frozen
so the system has only `d` degrees of freedom

Suppose the full parameter space has
$$
D=3
$$

with
$$
\theta^{(3)}= \begin{bmatrix} \theta_1\\ \theta_2\\ \theta_3 \end{bmatrix}
$$
Choose a 1D random subspace:
$$
d=1
$$
Let
$$
\theta_0^{(3)}= \begin{bmatrix} 1\\ 2\\ -1 \end{bmatrix}, \qquad P= \begin{bmatrix} 2\\ -1\\ 3 \end{bmatrix}, \qquad \theta^{(1)}=\alpha.
$$
Then
$$
\theta^{(3)} = \theta_0^{(3)}+P\alpha = \begin{bmatrix} 1+2\alpha\\ 2-\alpha\\ -1+3\alpha \end{bmatrix}.
$$
Only one scalar, $\alpha$, is trained. Therefore the model can only move along a single line inside the original 3D parameter space.

D=3,d=1⇒1 trainable DoF inside a 3D parameter space
$$
\boxed{ D=3,\quad d=1 \Rightarrow 1\text{ trainable DoF inside a 3D parameter space} }
$$

In the paper, the same construction is used with very large $D$ and much smaller $d$.
	-  We initialize $θ(d)$ to a vector of all zeros, so initially $θ(D)$ = $θ_0(D)$
	-  it allows the network to benefit from beginning in a region of parameter space designed by any number of good initialization schemes (Glorot & Bengio, 2010; He et al., 2015) to be well-conditioned, such that gradient descent via commonly used optimizers will tend to work well 
		- GOOD INITALIZTION (KAIMING HE) & avoid weird geometry
basically they implacity say that $θ_0(D)$ != 0 cause it would mean $θ_(D)$ = 0 and if sultion set contain origin we can do that with d=1 (FALSE)
+
Since $θ_0$ is sampled from a continuous initialization distribution, it will be nonzero with probability 1


### Random subspace example

Let the full parameter space have dimension

$$
D=3
$$

and restrict training to a smaller subspace with

$$
d=2.
$$

Choose

$$
P=
\begin{bmatrix}
1 & 0\\
0 & 1\\
0 & 0
\end{bmatrix}.
$$

The columns of $P$ are

$$
p_1=
\begin{bmatrix}
1\\0\\0
\end{bmatrix},
\qquad
p_2=
\begin{bmatrix}
0\\1\\0
\end{bmatrix}.
$$

Therefore,

$$
\operatorname{Col}(P)
=
\operatorname{span}\{p_1,p_2\}
=
\left\{
\begin{bmatrix}
a\\b\\0
\end{bmatrix}
:a,b\in\mathbb R
\right\}.
$$

This is the $xy$-plane through the origin.

Now choose

$$
\theta_0=
\begin{bmatrix}
0\\0\\5
\end{bmatrix}.
$$

Using

$$
\theta^{(D)}
=
\theta_0+P\theta^{(d)},
$$

the set of reachable parameters becomes

$$
\theta_0+\operatorname{Col}(P)
=
\left\{
\begin{bmatrix}
a\\b\\5
\end{bmatrix}
:a,b\in\mathbb R
\right\}.
$$

So $\theta_0$ **shifts the whole 2D subspace** from the plane $z=0$ to the plane $z=5$.

> $\operatorname{Col}(P)$ determines the **directions you are allowed to move**.
> $\theta_0$ determines **where that subspace is located** in the full parameter space.


**The solution set might have geometry organized around the origin.**

Circle/sphere is the perfect example. Forcing all sampled subspaces through its center gives them an artificially high chance of hitting it.

Hence Li et al. want
$$
{\theta_0+\operatorname{Col}(P)}
$$
with random $θ_0$$ **and** random orientation P <span style="color:cyan;">so the sampled subspace has no privileged geometric relationship to the solution set</span>
 

Columns of P may also be orthogonalized if desired, but in our experiments we relied simply on the approximate orthogonality of high dimensional random vectors. By this construction P forms an approximately orthonormal basis for a randomly oriented d dimensional subspace of $R_D$ , with the origin of the new coordinate system at $θ_0(D)$
	SIMPLE:  we can do orthogonal, but it is hard for high dim, so we do approximate orthogonal. And why do we do that? To have a full subspace (full-rank matrix) at dimension d; not p[1,1,1], so d != 3 and d = 1???
	<br>They are not saying exact orthogonalization is hard because \(D\) is large. They’re saying they could orthogonalize the columns, but random vectors in high-dimensional space are already approximately orthogonal, so they don’t bother.

Columns of P are normalized to unit length, so steps of unit length in θ(d) chart out unit length motions of θ(D)

EXAMPLE :
If

$$
P=
\begin{bmatrix}
3\\
4
\end{bmatrix},
\qquad
\|P\|=5,
$$

then with

$$
\theta^{(D)}=\theta_0+P\alpha,
$$

a unit step

$$
\Delta\alpha=1
$$

causes

$$
\Delta\theta^{(D)}=
\begin{bmatrix}
3\\
4
\end{bmatrix},
\qquad
\|\Delta\theta^{(D)}\|=5.
$$

So:

$$
1\text{-unit step in small space}
\rightarrow
5\text{-unit step in full space}.
$$

Normalize $P$ so $\|P\|=1$ to keep the step scale consistent.


Consider a few properties of this training approach:
	1. If d = D AND P= large identity matrix ->recover exactly the direct optimization problem
	2. If d = D AND P= random orthonormal basis for all of $R^D$ (= ust a random rotation matrix) ->recover a rotated version of the direct problem
	3. “rotation-invariant” optimizers e.g SGD and SGD + momentum -> rotating the basis will not change the steps taken nor the solution found
	4. but for optimizers with axis-aligned assumptions e.g  RMSProp and Adam  path taken through θ(D) space by an optimizer will depend on the rotation chosen
	5. solution found by rotation-variants? Potentially yes ; 
	   but the paper’s sentence only guarantees that the path changes, not necessarily the final solution

key takes
* * Finally, in the general case where d < D and solutions exist in D, solutions will almost surely (with probability 1)
* * the other hand, when d ≥ D −s, ifthe solution set is a hyperplane, the solution will almost surely intersect the subspace; ( WE GET AN ANSWER)
  but for solution sets of arbitrary topology, intersection is not guaranteed. (BUT NOT ALWAYS) e.g; solution a circle and we fit a line (we already shifted so even 0 intersects)
### DETAILS AND CONVENTIONS
 
 - we first choose a heuristic for classifying points on the objective landscape as solution
 - The heuristic we choose is to threshold network performance at some level relative to a baseline mode
 - Where generally we take as baseline the best directly trained model
 - supervised classification settings -> accuracy
 - RL settings -> reward + shifted up or down such that the minimum reward is 0
 - Accuracy and reward are preferred to loss to ensure results are grounded toreal-world performance and to allow comparison across models with differing scales of loss and different amounts of regularization included in the loss
D::
	1 choose a heuristic to study the OBJECTIVE landscape (loss landscape)  
	2 the heuristic is distance from baseline model
		The heuristic is **not distance from the baseline model in parameter space**. It is **performance relative to the baseline model**. 
			say successful subspace-trained model gets 0.95 and baseline direct model get 90% acc; the subscape model acc is 0.9 x 0.95 = 85.5% 
	3 the criteria are acc and reward instead of loss to have more flexibility among models and regularizations and ...

A:: the accuracy is more flexible measure for accross models but not a more correct one; even loss is not a more correct one : 1 confidence 2 class distribution 3 percision,recall


### Why $d_{\text{int},100}$ can suddenly drop

Restricting training to a smaller random subspace can itself act as **regularization** and slightly improve validation performance.

Example:

- direct baseline: $95.0\%$
- subspace model with small $d$: $95.2\%$

Then the small-$d$ model already matches or exceeds the baseline, so it counts as a “100% solution.”

Thus $d_{\text{int},100}$ may become much smaller not because the task truly needs fewer degrees of freedom, but because subspace restriction improved generalization slightly.

> Confound: $d_{\text{int},100}$ can mix **task difficulty** with **regularization/generalization effects**.

Tiny concrete example:

- baseline: 95.0 \%
- d=5000d=5000: 94.9 \%
- d=1000d=1000: 95.1 \%

![[img3.png]]
### Why $d_{\text{int},100}$ is unstable

Near the top of the performance curve, accuracy changes very little as $d$ increases.

Example:

$$
\begin{array}{c|c}
d & \text{accuracy}\\
\hline
500 & 94.7\%\\
700 & 94.9\%\\
1000 & 95.0\%\\
2000 & 95.1\%
\end{array}
$$

If baseline accuracy is $95\%$, tiny training noise can change

$$
94.9\% \to 95.01\%
$$

so $d=700$ suddenly crosses the $100\%$ threshold.

Thus:

$$
\text{tiny accuracy noise}
\Rightarrow
\text{large change in measured } d_{\text{int}}.
$$

This is why $d_{\text{int},90}$ is usually more stable.
### RESULTS AND DISCUSSION

FC on MNIST; 784–200–200–10; D= 199,210
	784x200+200 +
	200x200+200 +
	200x10+10 +
	=
	199,210
$d_{int_{90}}$ = 750

750 / 199.210 = 0.4%; compelling corollary of this result:
	creating and training compressed network:
		1. the random seed to generate the frozen $θ_0(D)$
		2. the random seed to generate the frozen $P$
		3. he 750 floating point numbers in $θ_*(d)$
	260x compression

NOTES:
	- Unlike layerwise compression models  we operate in the entire parameter space, which could work better or worse, depending on the network
	- Compared to methods like that of Louizos et al. (2017), who take a Bayesian perspective and consider redundancy on the level of groups of parameters (input weights to a single neuron) by using group-sparsity-inducing hierarchical priors on the weights, our approach is simpler but not likely to lead to compression as high as the levels they attain
	- Our approach only reduces the number of degrees of freedom not the number of bits required to store (like in quantization)
	- inally, note the relationships between <u>weight pruning</u>, <u>weight tying</u>, and <u>subspace training</u>: 
		- weight pruning is equivalent to finding, post-hoc, a subspace that is orthogonal to certain axes of the full parameter space and that intersects those axes at the origin. 
		- Weight tying, e.g. by random hashing of weights into buckets (Chen et al., 2015), is equivalent to subspace training where the subspace is restrictedto lie along the equidistant “diagonals” between any axes that are tied together.

### Pruning, weight tying, and subspace training

All three can be viewed as restricting training to a subspace of the full parameter space.

#### Weight pruning

Suppose

$$
\theta=
\begin{bmatrix}
w_1\\
w_2
\end{bmatrix}.
$$

Pruning $w_2$ means forcing

$$
w_2=0.
$$

So allowed parameters are

$$
\theta=
\begin{bmatrix}
w_1\\
0
\end{bmatrix}
=
\begin{bmatrix}
1\\
0
\end{bmatrix}\alpha.
$$

Geometrically, training is restricted to the $w_1$-axis.

> Pruning = axis-aligned subspace where some coordinates are fixed to zero.

#### Weight tying

If

$$
w_1=w_2,
$$

then

$$
\theta=
\begin{bmatrix}
a\\
a
\end{bmatrix}
=
a
\begin{bmatrix}
1\\
1
\end{bmatrix}.
$$

Geometrically, training is restricted to the diagonal

$$
w_1=w_2.
$$

If three weights are tied,

$$
w_1=w_2=w_3,
$$

then

$$
\theta
=
a
\begin{bmatrix}
1\\
1\\
1
\end{bmatrix}.
$$

> Weight tying = subspace where tied coordinates move together.

#### Subspace training

General form:

$$
\theta=\theta_0+Pz.
$$

- pruning: $P$ selects coordinate axes
- weight tying: $P$ creates shared/diagonal directions
- Li et al.: $P$ is random, so the subspace has arbitrary orientation
So Li et al.'s compression is mainly:
$$
\boxed{\text{description/training degrees-of-freedom compression}}
$$
not
$$
\boxed{\text{
computational inference compression}}
$$

![[img4.png]]


Robustness of intrinsic dimension

We perform a grid sweep of networks with number of hidden layers L chosen from {1, 2, 3, 4, 5} and width W chosen from {50, 100, 200, 400}

As one can see, D changes by a factor of 24.1 between the
smallest and largest networks, but dint90 changes over this range by a factor of only 1.33, with much of this possibly due to noise <br>
	1. Thus it turns out that the intrinsic dimension changes little even as models grown in width or depth!
	<br>
	2. The striking conclusion is that every extra parameter added to the network — every extra dimension added to D — just ends up adding one dimension to the redundancy of the solution, s.

D:: as the model gets larger, there are more directions in parameter space along which you can move and still remain a solution, so solutions become less isolated relative to the total space. 
C:: [[Understanding DL requires rethinking Generalization]]
The mode $s/D$ approaches 1; the more we cover the loss landscape;


$d_{int}$ => robust to hyperparameters != universal across architectures.

#### Are random subspaces really more parameter-efficient for FC nets? 



We generated 1000 small networks (depth randomly chosen from {1, 2, 3, 4, 5}, layer width randomly from {2, 3, 5, 8, 10, 15, 20, 25}, seed set randomly) in an attempt to find high-performing, small FC networks:
	D:: Solution complexity and learning parameterization can differ sharply: a task may admit a solution controlled by only ~750 trainable degrees of freedom, yet directly parameterizing a network with ~750 parameters may not make that solution accessible. A larger ambient parameterization can make those few effective DoF much more useful.
	D:: parameters needed for the solution != parameters needed to get the answer(optimization)
	D::overparameterization may provide a better optimization scaffold

![[img5.png]]

Blue = take one large FC network, but only allow it to move in a random dd-dimensional subspace.

Gray = actually build a small FC network with roughly dd trainable parameters and train it directly.

D::large parameterization can make a solution easier to realize/find with the same number of trainable DoF 
$$ \boxed{\text{large parameterization can make a solution easier to realize/find with the same number of trainable DoF}}
$$

O:: WE CANNOT SOLVE UNLESS WE OVERPARAMETRIZE?

 
 
We can consider this $d$(intrinsic dimension) as an
upper bound on the MDL of the problem solution We cannot yet conclude the extent to which this bound is loose or tight, and tightness may vary by problem. 

there is some rigor behind our intuitive assumption that
LeNet is a better model than an FC network for MNIST image classification
because its d is lower (dint90 of 290 vs 750)
	but as models become larger, more complex, and more heterogeneous, conclusions of this type will often not be obvious


C:: [[Understanding DL requires rethinking Generalization]]
provocatively showed that large networks normally thought to generalize well can nearly as easily be
trained to memorize entire training sets with randomly assigned labels or with input pixels provided
in random order
	intrinsic dimension of each may be measured to expose the differences in problem difficulty. When training on a dataset with shuffled pixels:
		FC-network remains the same at 750
			FC-networks are invariant to input permutation
		But conv-net intrinsic dim increases from 290 to 1400
	When training on MNIST with shuffled labels:
		Training set requires a very high dimension, 
		dint90 = 190, 000, or 3.8 floats per memorized label

D:: Memorization appears to require many more effective degrees of freedom than solving the structured task.

D::**task, model, architecture, optimizer, training setup, and threshold fixed**, I still would not write
D::
$$\text{generalization}\propto \frac{1}{d_{\text{int}}}$$
H:: does it have a connection with memorizing/generalizing circuits in [[Explain Grokking circuit efficiency]]



It is also interesting to observe the difference of dint90 across network architectures. For example, to achieve a global >50% validation accuracy on CIFAR-10, FC, LeNet and ResNet approximately
requires dint90 = 9k, 2.9k and 1k, 
![[img6.png]]


POST::
#lens/representation #lens/geometry 
1. What did they actually establish?
	they established a new concept called intrinsic dim; a new represntation; they followed a notation on the objective landsacpe and showed 1 main point : most of the times the d required is way less than D(number of parameters; original parameter dimensionality) 2 a side point : this can be used as a compression; 3 a smaller side point : it's different for 1 tasks, 2 architectures and 3 withing architecture-family depth/widthes; and 4 the mega point for me : we cannot directly train a network with d dimension for parameters from scratch we need the over-parametrization for easy optimization<br>solution DoF!=parameterization needed to make that solution easy to find
	​
2. What do I think it means?
		kinda explained it in question1
3. What remains unproven / questionable?
	is less intrinsic dim => more generalization; for the same setup
4. What changed in my world model?
		an approval on one side(not the generalizaiton part) my statement "we need the over-parametrization for easy optimization and generalization" + "the num of params for the solution != the number for params to GETTING TO THE solution"