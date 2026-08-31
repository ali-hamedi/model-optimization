# V0 — Initial Model

Neural-network optimization/compression was mostly a methods taxonomy to me: pruning, quantization, distillation, NAS. I implicitly thought useful computation could be localized fairly directly in parameters/neurons/subnetworks.

I suspected we over-parameterize to reach a solution and afterwards we prune or distill, but didn't believe in the trench. I also had a guess that a superior architecture is available, which we can reach through NAS, or a better representation criterion where we encode the knowledge into the model in a better way: latent-space models or models like {  
**HRM**: Hierarchical Reasoning Model} paper; but didn't regard it as WHY WE OVERPARAMETERIZE or why we even prune. I tackled the whole criteria with an "inference" mentality: where I want the model to be smaller, cheaper, faster, etc...; my childish words were I want to break the efficient compute frontier; if we are doing ImageNet at acc X with Y frames/sec speed, I wanted X acc for Y + a lot of frames/sec.

BUT when I started this journey or this research, I shifted my focus to the question:  
WHAT PART OF A NEURAL NETWORK ACTUALLY WORKS  
AND I thought of compression as a dissection method to see where the "KNOWLEDGE" is in a NN.

So the first paper that caught my attention was LTH by Frankle 2018,

---
## Δ1 — LTH: The Lottery Ticket Hypothesis — Frankle & Carbin, 2018

And it was fascinating because it basically said the "THING" that works, "THE MAGIC", "THE BIG GUY", "THE KNOWLEDGE", as my conception, or basically the "computation of a NN", lies within subgraphs in the entire structure; there are winning ones and losing ones.

The important correction here is: the winning tickets are **determined at initialization**, but they are **identified later through training + iterative magnitude pruning**.

The big insight for me was that it's not only architecture: it's architecture + initialization of the weights.

---
## Δ2 — LMC: Linear Mode Connectivity and the Lottery Ticket Hypothesis — Frankle et al., 2020

LTH already drilled a notion of a "basin" into me, but LMC made it deeper. It opened my eyes to the loss-landscape/geometry lens (not fully on that lens, more of a bridge between structure and geometry), but it was my first time really reaching this lens.

I got introduced to the whole concept of mode connectivity; linear and non-linear + the error definition and all....

But the extension on LTH was super good: we don't need W0 because that might fail at scale; we actually need Wk where k is small (some steps of learning, the rewind point is there).

The idea of optimizing for a few iterations was for the sake of becoming "prune to SGD noise".

In other words, LTH said some lottery-winning subgraphs (architecture + weights) get good weights, aka weights in a good direction / corresponding loss-landscape location.

LMC then showed that after a small amount of optimization, successful subnetworks become stable to SGD noise / linearly connected under their stability criterion.

D:: Early optimization may move the subnetwork into a region where its training dynamics become stable/robust enough to recover the solution. My "right basin" picture is an interpretation of this, not something directly proven by the paper.

---
## Δ3 — Permutation Invariance in Linear Mode Connectivity — Entezari et al., 2021

This paper was an excellent read after the LMC one because this one was one of the foundation papers for my loss-landscape lens.

It used the same notation of the loss landscape and mode connectivity as LMC.

Then basically their conjecture was that many apparently distinct valleys/minima may actually be permutation-equivalent versions of one another.

So their follow-up picture was the single-basin conjecture: if many of these minima/valleys/basins are related through permutations of the weights, then under a permutation-invariant notion of the landscape they may collapse toward a single-basin picture.

Important: this is a conjectured picture, not something they proved universally for all minima.

---
## Δ4 — Explaining Grokking through Circuit Efficiency — Nanda et al., 2023

A shifting point in my view.

Where the notion of memorizing-to-generalizing for the grokking explanation made a spark with my earlier "I suspected we over-parameterize to reach a solution and afterwards we prune...."

So my trench shifted in a way from:

WHAT PART OF A NEURAL NETWORK ACTUALLY WORKS

to:

WHY DO WE INITIALIZE BIGGER THAN WE NEED; WHAT MEANING DOES THE BIG NETWORK HAVE AND WHAT MEANING DO WE DERIVE BY MAKING IT SMALLER

(not a good choice of words but I think you see what I mean)

{How does an overparameterized neural network discover and represent the efficient computation that generalizes?}

or at best:

{*Compression as a Probe of Computation: How Overparameterized Neural Networks Discover Efficient Generalizing Solutions*}

as a title for my paper (not decided yet)

But for their paper, they tried to explain grokking with a super toy (I mean very simple and enforced environment) model/setup.

They introduced the notion of:

1. circuits: subgraphs in the network
2. efficiency: yielding bigger logits for the same parameter norm, or in their experiments, same logits for smaller norm (**EXPLICIT REGULARIZATION WITH WEIGHT DECAY****)

Then they set up circuits and stated that the reason behind grokking is:

the generalizing circuits are more efficient, but the memorizing circuits are easier to learn, so weight decay leads to switching from memorizing to generalizing in the long run.

In their setup they introduced two new phenomena:

- ungrokking: if we consider the generalizing circuit more costly than the memorizing one and easier to learn, we will first generalize then memorize
- semi-grokking: when both are same-cost / efficient at the same level, we will have a mixture of grokking

---
## Δ5 — Sanity-Checking Pruning Methods: Random Tickets Can Win the Jackpot — Su et al., 2020

They introduced some sanity-check measures:

1. DATA dependency:
   2. Random labels (also used in Zhang et al., 2017)
   3. Random pixels:
      1. shuffling them
      2. completely random pixels: Gaussian noise
   4. half dataset

2.
   1. Layerwise rearrange
   2. Layerwise weights shuffling

This paper was basically in the same trench (structure) as LTH and it was its counterpart.

It changed the holiness of LTH: random tickets can win, and we can derive factors (smart ratios) for each layer to do super-random setups (layerwise rearrange or layerwise weight shuffling) and still get good accuracy.

So I was kinda left in the dust on LTH and didn't go deep on this paper so....

They also provided a new convention called hybrid tickets, which is a mixture of their random tickets and partially trained tickets with the rewinding technique in Renda, Frankle 2020 work.

---
## Δ6 — Comparing Rewinding and Fine-Tuning in Neural Network Pruning — Renda, Frankle & Carbin, 2020

This paper was also a counterpart/refinement on LTH by the same author group.

They mainly tested 3 setups:

1. Fine-tuning  
   $TRAIN_t(W_T, m, T)$

2. Weight rewinding (used in LTH)  
   $TRAIN_t(W_{T-t}, m, T-t)$

3. Learning-rate rewinding  
   $TRAIN_t(W_T, m, T-t)$

They showed:

learning-rate rewinding >= weight rewinding (the second author's original work / LTH lineage) >= fine-tuning

---
## Δ7 — Understanding Deep Learning Requires Rethinking Generalization — Zhang et al., 2017

This was a generalization-foundation / challenge paper for me.

They introduced a whole criteria showing:

1. a much tighter / more surprising upper bound on how easily modern networks can memorize finite datasets
2. the random-label test

And their main point was that explicit regularization techniques are not alone responsible for generalization (USUALLY; AlexNet + data augmentation being an exception in their experiments).

Open question: what happened with AlexNet + data augmentation?

The huge shift for me was:

the network can memorize even with explicit regularization when it doesn't have another choice.

So the question becomes less:

"can this architecture memorize?"

and more:

"given that it absolutely can memorize, why does optimization often select a generalizing solution instead?"

That pushed the trench toward selection among interpolating solutions / implicit bias.

---
## Δ8 — Measuring the Intrinsic Dimension of Objective Landscapes — Li et al., 2018

An excellent paper on the geometry lens and partially the representation/effective-complexity side.

They attacked one of my other trench questions: "how many parameters / degrees of freedom do we really need to solve a task/problem?"

They introduced the notion of the objective landscape, a more general term than just loss landscape, and showed that optimization can succeed while being restricted to a way lower-dimensional random subspace of the full parameter space.

They introduced $d_{int}$ / intrinsic dimension.

IMPORTANT correction to my initial interpretation:

$d_{int}$ is **NOT** "the minimum number of parameters required to solve the task."

It is the dimensionality of a random subspace inside the chosen overparameterized parameterization that is sufficient to reach a target performance.

BUT it still validated my trench in a different and maybe cleaner way:

**AMBIENT PARAMETER COUNT != EFFECTIVE SEARCH DIMENSION**

D:: This suggests the capacity needed to parameterize/train a model may greatly exceed the effective degrees of freedom actually used to solve the task.

So the deeper version of my old sentence becomes something like:

**CAPACITY / PARAMETERIZATION NEEDED TO SEARCH != EFFECTIVE DIMENSION NEEDED TO REACH THE SOLUTION**

---
## Δ9 — On the Mechanism and Dynamics of Modular Addition: Fourier Features, Lottery Ticket, and Grokking — He et al., 2026

MY LATEST PAPER: so technically rich.

They further explained the recent work and they bridged Fourier Features, Lottery Ticket, and Grokking together; mind-blowing.

They take the "modular addition task" with a 2-layer NN toy model to show that we get a single dominant Fourier frequency for each neuron (LTH-ish picture), and they showed that during training:

1. the dominant frequency gets bigger and the rest get silenced
2. phase alignment: neurons may do different frequencies but layers work together
3. for sufficiently large M (layer width), we can have diversification (they also modeled the diversification)

So it's an extension on my "make the network big to solve the task" idea, and they explained LTH from a very different perspective.

The whole saying is that we get a full range of Fourier frequencies in each neuron but one is dominant, and if M is large enough we get all; then training silences the rest and makes one stronger; phase alignment makes layers work together; and network alignment lets the network reach a global solution from neuron-specific representations.

Deduction on this paper:

I think this paper can explain the LTH-random-ticket dilemma where, when we retrain a random ticket with sufficiently large M (smart ratios allow that), we take neurons that have all the needed Fourier frequencies, and with training them we reach neuron-specific features, layers align, and eventually the network reaches a global solution for it.