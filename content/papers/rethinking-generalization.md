---
authors: hiyuan Zhang,Samy Bengio,Moritz Hardt,Benjamin Recht,Oriol Vinyals
---

# UNDERSTANDING DEEP LEARNING REQUIRES RE-THINKING GENERALIZATION

---
PRE::
		1. Why am I reading this?
		2. What do I expect it to claim?
		3. Which trench/lens question does it attack?

PRE::

1 Why am I reading this?
To better understand why SGD chooses generalizing solutions despite
the network having enough capacity to memorize, and whether this
eventually connects generalization to compression.

2 What do I expect it to claim?
I expect it to challenge conventional explanations of generalization.
My stronger/speculative prediction is that it may support my idea that
networks can first find memorizing/redundant solutions and later move
toward more generalizing ones.

3 Which trench/lens question does it attack?
Primary prediction: Representation.
Secondary: Training Dynamics.
I don't currently expect Structure or Optimization Geometry to be central.

---

~ *Conventional wisdom attributes small generalization error either to properties of the model family, or to the regularization techniques used during training*
> so conventional wisdom says generalization -> properties of the model family or the reguralization techniques



~ *<span style="color:orange">Through extensive systematic experiments</span> we showthese traditional approaches fail to explain why large neural networks generalize well in practice*


~ *Our experiments establish that state-of-the-art convolutional networks for image classification trained with stochastic gradient methods easily fit a random labeling of the training data.*
	This phenomenon is qualitatively unaffected by explicit regularization <span style="color:teal">regularization doesn't stop memorizing</span>

~ * that simple depth two neural networks al-
ready have perfect finite sample expressivity as soon as the number of parameters exceeds the number of data points as it usually does in practice*

> D:: Even if the network doesn't have enough functional representational capacity (“depth”) to learn the underlying data pattern, if it has enough parameters, it can still “memorize” the data.

~ *Deep artificial neural networks often have far more trainable model parameters than the number of
samples they are trained on*

~ *generalization error, i.e., difference between “training error” and “test error” *  #Foundation #niche 

~ To answer such a question (. What is it then
that distinguishes neural networks that generalize well from those that don’):
	statistical learning theory has proposed a number of different complexity measures that are capable of controlling generalization error. These include VC dimension (Vapnik,1998), Rademacher complexity (Bartlett & Mendelson, 2003), and uniform stability (Mukherjee et al., 2002; Bousquet & Elisseeff, 2002; Poggio et al., 2004). #T1 #generalization #statistical-learning-theory #interesting 


~ *Moreover, when the number of parameters is large, theory suggests that some form of regularization is needed to ensure small
generalization error. Regularization may also be implicit as is the case with early stopping*
	D:: With a larger number of parameters, there is a greater ability to memorize the data, so we should enforce regularization to “make sure” the network learns the underlying pattern rather than simply memorizing the data.
	A::Why does the existence of many memorizing solutions imply that we need regularization (explicit or implicit)?
	C:: [[Explain Grokking circuit efficiency]] says that if a generlizing ciruit is learned first we should enfore switching to a memorising one so maybe we don't need enforced regularization

## Randomization tests
Our central finding can be summarized as:

<div style="text-align:center">
Deep neural networks easily fit random labels
</div>
~ *In other words, by randomizing labels
alone we can force the generalization error of a model to jump up considerably without changing the <u style="color:pink">model</u>, its <u style="color:pink">size</u>, <u style="color:pink">hyperparameters</u>, or the <u style="color:pink">optimizer</u>.*

~ *We furthermore vary the amount of randomization, <span style ="color:cyan">interpolating smoothly between the case of no noise and complete noise</span>. This leads to a range of intermediate learning problems where there remains some level of signal in the labels. We observe a steady deterioration of the generalization error as we increase the noise level.*

~ *<span style="color:red">We discuss in further detail below how these observations rule out all of VC-dimension, Rademacher
complexity, and uniform stability as possible explanations for the generalization performance of state-of-the-art neural network</span>*



## The role of explicit regularization

~ If the model architecture itself isn’t a sufficient regularizer, it remains to see how much explicit regularization helps. We show that explicit forms of regularization, such as <u style="color:teal">weight-decay</u>, <u style="color:teal">dropout</u>, and <u style="color:teal">data-augmentation</u>, do not adequately explain the generalization error of neural networks. Put differently:

<div style="color:yellow;text-align:center">
Explicit regularization may improve generalization performance, but is neither necessary nor by
itself sufficient for controlling generalization error
</div>

~ but the absence of all regularization does not necessarily imply poor generalization er-
ror. #lens/emergance 

## Finite sample expressivity


We complement our empirical observations with a theoretical construction showing that **large neural networks can express any labeling of the training data**.

> **Key result:** A simple **two-layer ReLU network** with
> **(p = 2n + d)** parameters can express **any labeling** of any sample of size (n) in (d) dimensions.


A concrete example: suppose we have **(n=1000)** training examples, each in **(d=50)** dimensions. Zhang et al. show that a two-layer ReLU network can represent **any arbitrary labeling** of these 1000 examples using only

$$  
p=2n+d=2(1000)+50=2050  
$$

parameters.
~ *A previous construction due to Livni et al. (2014) achieved a similar result with far more parameters, namely, $O(dn)$ While our
depth 2 network inevitably has large width, we can also come up with a depth k network in which each layer has only $O(n/k)$ parameters*

~* While prior expressivity results focused on what functions neural nets can represent over the entire domain, we focus instead on the expressivity of neural nets with regards to a finite sample*
	D:: function representability != expressivity #lens/representation 


## The role of implicit regularization

we analyze how SGD acts as an implicit regularizer. For linear models,<span style="color:purple">SGD always converges to a solution with small norm</span>
~ *we show on small data sets that even Gaussian kernel methods can generalize well with no regularizatio*

~ *Though this doesn’t explain why certain architectures generalize better than other architectures, it does suggest that more investigation is needed to understand exactly what the properties are inherited by models that were trained using SGD*

~ ~Hardt et al. (2016) give an upper bound on the generalization error of a model trained with stochastic gradient descent in terms of the number of steps gradient descent too #interesting

~  We instead study the representational power of neural networks for a finite sample of size n. This leads to a very simple proof
that even O(n)-sized two-layer perceptrons have universal finite-sample expressivity
	A:: representational power != finite-sample expressivity
	it is the functional-representational capacity


---
Bartlett (1998) proved bounds on the fat shattering dimension of multilayer perceptrons with sig- moid activations in terms of the 1-norm of the weights at each nod

Bartlett showed a way to measure how “complex” a sigmoid network is **without just counting parameters**.

The sentence has two pieces:

- **fat-shattering dimension** = a capacity measure for real-valued function classes, roughly the regression analogue of VC dimension;
- **ℓ1​-norm of the weights at each node** = for a neuron with incoming weights $w=(w_1​,…,w_m​)$,
$$
∥w∥1​=j=1∑m​∣wj​∣.
$$
So Bartlett’s result says, roughly:

>if the incoming weight norms are controlle -> the network’s effective capacity can be bounded

The important part of the sentence is that the bound depends on **weight magnitude**, not simply network size

D::
	result is not simply: effective capacity ∝ weight magnitude ;
	capacity can be bounded using norms of the weights

**Bartlett (1998):** network capacity need not be controlled primarily by parameter count; it can instead be controlled by the magnitude/norms of the weights.

## However, for RELU networks the 1-norm is no longer informative

For sigmoid networks, scaling the weights changes the function:

$$
\sigma(x)\neq \sigma(cx)  
$$

so weight magnitude meaningfully constrains function complexity.

$$
\mathrm{ReLU}(cz)=c,\mathrm{ReLU}(z),\qquad c>0.  
$$

Thus,

$$
v' \mathrm{ReLU}(w^\top x) = 

\frac{v}{c} \mathrm{ReLU}(cw^\top x).  
$$

The **function stays identical**, while the incoming weight norm changes:

$$
|cw|_1=c|w|_1.  
$$

So a per-node ($\ell_1$)-norm is not an intrinsic measure of ReLU function complexity: the same function can be represented with very different weight magnitudes.

~ Neyshabur et al. (2014), who argued through experi-ments that network size is not the main form of capacity control for neural network #interesting 


---

## EFFECTIVE CAPACITY OF NEURAL NETWORKS

Specifically, we take a candidate architecture and train it on :
	1. the true data 
	2. a copy of the data in which the true labels were replaced by random labels

In the second case, there is no longer any relationship between the instances and the class label
	Intuition suggests that this impossibility should manifest itself clearly during trainin
		e.g., by training not converging or slowing down substantially

To our surprise, several properties of the training process is largely unaffected 

experiment more from zero-noise to full-noise (interpolation)

~ *We also try out different randomizations of the inputs (rather than labels),arriving at the same general conclusion*

Experiments:
	• True labels
	• Partially corrupted labels : Independently with probability p
	• Random labels
	• Shuffled pixels:
	• Random pixels
	• Gaussian: A Gaussian distribution (with matching mean $\mu$ and variance $\sigma^2$ to the original image dataset) is used to generate random pixels for each image
<span style="color:d4af3f">Surprisingly, stochastic gradient descent with unchanged hyperparameter settings can optimize the
weights to fit to random labels perfectly</span>
We further break the structure of the images by shuffling
the image pixels:
	 But the networks we tested are still able to fit.


RESULTS:

We expect the objective function to <u>take longer</u> to start decreasing on random labels because <u>initially the label assignments for every training sample is uncorrelated</u>. Therefore, large predictions errors are back-propagated to make large gradients for parameter updates.
However, <u style='font-weight:bold;color:cyan'>since the random labels are fixed and consistent across epochs</u>**, the network starts fitting after going through the training set multiple time

a) we do not need to change the learning rate schedule;
b) once the fitting starts, it converges quickly;
c) it converges to (over)fit the training set perfectl

<span style="color:d4af3f;font-weight:bold">Also note that “random pixels” and “Gaussian” start converging faster than “random labels</span>
	This might be because with random pixels, the inputs are more separated from each other than natural images that originallybelong to the same category, therefore, easier to build a network for arbitrary label assignment #niche 

![[img2.png]]


they proceed to mention "Rademacher complexity and VC-dimension" and better "Bartlett (1998)" and even the newer "Neyshabur
et al. (2015)" as useless here  #interesting #big-idea 

#Foundation 
Uniform stability : A measures how sensitive the algorithm is to the replacement of a single example

### THE ROLE OF REGULARIZATION

Regularizers are the standard tool in theory and practice to mitigate overfitting in the regime when there are more parameters than data point #Foundation 


• Data augmentation:
	augment the training set via domain-specific transformations. For image data, commonly used transformations include random cropping, random perturbation of brightness, saturation, hue and contrast
• Weight decay:
	equivalent to a $\ell_2$ regularizer on the weights
• Dropout (Srivastava et al., 2014):
	mask out each element of a layer output randomly with a given dropout probability. 


---

Early stopping was shown to implicitly regularize on some convex learning problem 

#niche #Foundation 

batch normalization is usually found to improve the generalization performance

---

**Regularization is not the fundamental explanation**

> “Observations on both explicit and implicit regularizers are consistently suggesting that regularizers, when properly tuned, could help to improve the generalization performance. However, it is unlikely that the regularizers are the fundamental reason for generalization.”



---
## Population-level expressivity

When Zhang et al. say **population-level expressivity**, the object of study is a **function class over an entire input domain**, not merely the values taken on a finite training sample.

Suppose

$$
\mathcal X \subseteq \mathbb R^d  
$$

and a neural-network architecture with parameters ($\theta\in\Theta$) defines

$$
f_\theta:\mathcal X\to\mathbb R
$$

The architecture induces the function class

$$
\mathcal F={f_\theta:\theta\in\Theta}.  
$$

A population-level expressivity question asks:

$$
\boxed{  
\text{Which functions }g:\mathcal X\to\mathbb R  
\text{ belong to, or can be approximated by, }\mathcal F?  
}  
$$

Usually we do not require exact equality

$$
f_\theta(x)=g(x)\qquad \forall x,  
]

but instead ask whether

$$
\inf_{\theta\in\Theta}|f_\theta-g|<\varepsilon.  
$$

The choice of norm determines what “good approximation” means.

## Why depth matters at the population level

The paper states:

> “depth (k) is generically more powerful than depth (k-1) at the population level.”

A useful formal picture is

$$
\mathcal F_{k-1,p}\subsetneq \mathcal F_{k,p},  
$$





For a one-hidden-layer ReLU network,

$$
f(x)=

c+\sum_{j=1}^{m}  
a_j,\mathrm{ReLU}(w_jx+b_j).  
$$

Each ReLU introduces a possible **kink**, so (f) is a continuous piecewise-linear function.

Its derivative is

$$
f'(x)

\sum_j  
a_jw_j  
\mathbf 1{w_jx+b_j>0}.  
$$
Therefore, with width (m), the slope can change only at (O(m)) locations.

With additional depth, piecewise-linear transformations are **composed**:

$$
f=f_k\circ f_{k-1}\circ\cdots\circ f_1,  
$$

and composition can create far more linear regions/oscillations with the same or similar number of parameters. This is one reason deeper networks can represent some global functions much more efficiently than shallower ones.

---

## Finite-sample expressivity

Finite-sample expressivity asks a different question.

Given only

$$  
S={x_1,\dots,x_n},  
$$

can the network realize arbitrary assigned values

$$ 
f(x_i)=y_i  
\qquad i=1,\dots,n?  
$$

The network may behave arbitrarily between or outside those points.

Zhang et al.'s theorem shows that even a depth-2 ReLU network with

$$
p=2n+d  
$$

parameters can represent **any labeling of any finite sample of size (n) in (d) dimensions**. For depth k, they state:

$$ width =O(n/k)​ $$

and total weights
$$
O(n+d)​.
$$
Their corollary is essentially:

$∀k≥2$,$∃$ ReLU net of depth $k$, width $O(n/k)$, and $O(n+d)$ weights

So:

$$
\boxed{  
\text{population expressivity}  
\neq  
\text{finite-sample expressivity}  
}  
$$

A shallow network may be relatively limited in the complexity of functions it can represent efficiently over the **whole domain**, while still having enough finite-sample capacity to **memorize arbitrary labels on the training set**.




---


Specifically, as soon as the number of parameters p of a networks is greater than n, even simple two-layer neural networks can represent any function of the input sample. 

<span style="color:teal">Theorem 1. There exists a two-layer neural network with ReLU activations and 2n + d weights that can represent any function on a sample of size n in d dimensions.
</span>

## IMPLICIT REGULARIZATION: AN APPEAL TO LINEAR MODELS

Start with the model:
$$
\hat y = w^\top x,  
$$
where
$$ 
w\in\mathbb R^d,\qquad x_i\in\mathbb R^d.  
$$
With (n) training examples, ERM is
$$ 
\min_{w\in\mathbb R^d}  
\frac1n\sum_{i=1}^n  
\mathrm{loss}(w^\top x_i,y_i).  
$$
If the loss is zero whenever prediction equals target, then any (w) satisfying
$$ 
w^\top x_i=y_i  
\qquad \forall i  
$$

gets zero training loss.

Put all training examples into the matrix
$$ 
X=  
\begin{bmatrix}  
x_1^\top\  
x_2^\top\  
\vdots\  
x_n^\top  
\end{bmatrix}  
\in\mathbb R^{n\times d},  
$$
and labels into
$$ 
y=  
\begin{bmatrix}  
y_1\  
\vdots\  
y_n  
\end{bmatrix}.  
$$
Then fitting the training data exactly becomes simply
$$ 
\boxed{Xw=y}.  
$$

## Why does ($d\ge n$) matter?

You have:
- (n) equations 
- (d) unknown components of (w)

If $d>n$

you have more unknowns than constraints.
There are infinitely many solutions.

## What does “(X) has rank (n)” add?

rank(X)=n -> we need -> d≥n​

(d\ge n) alone is not enough.

$$ 
\operatorname{rank}(X)=n.  
$$

Since (X) has (n) rows, this means the rows are linearly independent.

Then the map

$$
w\mapsto Xw  
$$

can produce **every vector in ($\mathbb R^n$)**.

Therefore for any arbitrary target vector

$$
y\in\mathbb R^n,  
$$

there exists some (w) such that

$$
Xw=y.  
$$

That is what they mean by:

> “we can fit any labeling.”

It is the linear-model analogue of the random-label memorization story.


## Why infinitely many solutions?

For ($X\in\mathbb R^{n\times d}$) with rank $(n)$,
$$
\dim(\ker X)=d-n  
$$
by rank-nullity (kerX = null space of X)

Suppose (w_0) is one solution:

$Xw_0=y$ Then for any vector $v\in\ker X$ we have $Xv=0$

So the entire solution set is

$$
\boxed{  
w=w_0+v,\qquad v\in\ker X  
}  
$$

(d-n)-dimensional affine subspace.

This is the key geometry.
## And now the actual generalization mystery

Training only tells us:

$$
w\in {w:Xw=y}.  
$$

But that set contains infinitely many models.

So the important question becomes:
$$ 
\boxed{  
\text{Which interpolating solution does training choose?}  
}  
$$
because all of them have
$$ 
\text{training error}=0,  
$$
yet their predictions on unseen (x)'s can differ enormously.

That is why they ask:

> “But do all global minima generalize equally well?”

## Why do they bring up curvature?

A common idea in deep learning is:

> perhaps good minima are “flat” and bad minima are “sharp.”

Curvature is encoded by the Hessian:

$$  
H(w)=\nabla^2 L(w).  
$$

So they ask:

> Maybe among the infinitely many zero-training-loss solutions, curvature tells us which ones generalize?

For this linear setup, though, something striking happens: **all interpolating minima have the same curvature**.
$$  
\boxed{  
\text{same training loss}  
+  
\text{same curvature}  
+  
\text{potentially different generalization}  
}  
$$

So even in a linear model, **the geometry of the minimum itself may not explain why one interpolating solution generalizes and another does not**.

For the linear model, an SGD update is

$$  
w_{t+1}=w_t-\eta_t e_t x_{i_t}.  
$$

Each update is therefore a scalar multiple of a training vector. Starting from

$$  
w_0=0,  
$$

the final solution must lie in the span of the training data:

# $$  
w=\sum_{i=1}^n \alpha_i x_i

X^\top \alpha.  
$$

If SGD also perfectly fits the training labels,

$$  
Xw=y,  
$$

then substituting ($w=X^\top\alpha$) gives

$$  
XX^\top\alpha=y.  
$$

So although

$$  
Xw=y  
$$

may have infinitely many interpolating solutions, SGD from zero can only reach those satisfying

$$  
w\in \mathrm{span}{x_1,\dots,x_n}.  
$$


this reduces to the single equation
$$  
XX^\top\alpha=y.  
$$
which has a unique solution. Note that this equation only depends on the dot-products between the data points $x_i$. We have thus derived the “kernel trick” (Sch¨olkopf et al., 2001)—albeit in a
roundabout fashion.



KEY TAKE AWAY : 
<span style="color:#f88379;font-weight:bold;font-size:22px">SGD can act as an implicit regularizer​</span>

<div style="text-align:center">
Another insight resulting from our experiments is that optimization continues to be
empirically easy even if the resulting model does not generalize. This shows that the reasons for
why optimization is empirically easy must be different from the true cause of generalization.
</div>


## SUMMARY TAKE AWAY THAT LEFT BEHIND
1 Expressivity is representability.  
2 **domain/population-level(function) expressivity != finite-sample expressivity**.
3 regularization doesn’t stop "USUALLY" memorizing  
4 SGD always converges to a solution with small norm -> SGD favors converges to a solution with small norm ( specially when we have a linear model and initalizaiton at W_0=0)

5 IMPLICIT BIAS:SGD does not merely find a global minimum it selects a particular one

$$
Xw=y
$$
has infinitely many solutions, then all of them have zero training error. The minimum-$\ell_2$​-norm interpolant is the one solving
$$
w⋆=argwmin​∥w∥_2​ s.t. Xw=y
$$
C:: [[Permutation Invariance in LMC]] states that that is the more generalizing circiut to generalize better (SGD normally choses the more generalizing answer)

