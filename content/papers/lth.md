---
authors: Jonathan Frankle, Michael Carbin
---

# THE LOTTERY TICKET HYPOTHESIS: FINDING SPARSE, TRAINABLE NEURAL NETWORKS

ICLR 2019 (best paper) · arXiv 1803.03635 · Tier 3 (note + impl + video)
#lens/structure #lens/geometry

Frankle is the PhD student who bet his dissertation on "big networks contain small trainable ones". Carbin is his advisor. BOTH MIT.

---
PRE::
		1. Why am I reading this?
		2. What do I expect it to claim?
		3. Which trench/lens question does it attack?

PRE::

1 Why am I reading this?
first paper of the trench. i came in with an "inference" mentality (smaller,cheaper,faster; break the efficient-compute frontier) and shifted to WHAT PART OF A NEURAL NETWORK ACTUALLY WORKS. i want to use compression as a dissection method to see where the "KNOWLEDGE" lives in a NN.

2 What do I expect it to claim?
that a sparse subnetwork is sufficient, and that pruning tells us which part was doing the work.

3 Which trench/lens question does it attack?
#lens/structure — where is the computation? does useful computation reside in a sparse subnetwork?
secondary (and this is the part i didn't expect going in): #lens/geometry

---

## The hypothesis and the conjecture

~ ***The Lottery Ticket Hypothesis.** A randomly-initialized, dense neural network contains a subnetwork that is initialized such that—when trained in isolation—it can match the test accuracy of the original network after training for at most the same number of iterations.*

formally: dense net $f(x;\theta_0)$, $\theta_0 \sim D_\theta$. reaches min val loss $l$ at iter $j$ with test acc $a$. now train $f(x; m \odot \theta)$ with mask $m \in \{0,1\}^{|\theta|}$, init $m \odot \theta_0$. the hypothesis predicts $\exists m$ with:
	$j' \le j$ (commensurate training time)
	$a' \ge a$ (commensurate accuracy)
	$\|m\|_0 \ll |\theta|$ (fewer parameters)

$$
P_m = \frac{\|m\|_0}{|\theta|} \quad \text{(sparsity of the mask; } P_m=25\% \text{ means 75\% pruned)}
$$

~ ***The Lottery Ticket Conjecture.** ...we extend our hypothesis into an untested conjecture that SGD seeks out and trains a subset of well-initialized weights. Dense, randomly-initialized networks are easier to train than the sparse networks that result from pruning because there are more possible subnetworks from which training might recover a winning ticket.* #big-idea

NOTE the word **untested**. the hypothesis is the empirical part; the conjecture is the thing i actually care about and they do NOT show it.

## Core mechanics

the central experiment:
	1. randomly init $f(x;\theta_0)$
	2. train $j$ iterations -> $\theta_j$
	3. prune $p\%$ of $\theta_j$ by lowest magnitude -> mask $m$
	4. reset survivors to their values in $\theta_0$ -> winning ticket $f(x; m \odot \theta_0)$

**IMP** (Iterative Magnitude Pruning) = repeat that over $n$ rounds, each round pruning $p^{1/n}\%$ of the weights that survived the previous round. #terminology

- Winning ticket = **(structure, $\theta_0$) pair**, not structure alone. random reinit with the right structure fails at the same sparsity.
- iterative beats one-shot. one-shot uses a blurry photo to cut; IMP sharpens it iteratively — each round gives a cleaner signal about which weights actually matter.
	~ *iterative pruning finds winning tickets that match the accuracy of the original network at smaller sizes than does one-shot pruning*
	(one-shot DOES still find winning tickets — Fig 4c. just bigger ones.)
- the mask isn't sampled — it's **discovered** via magnitude pruning after training, then applied retroactively to pre-training weights.

D:: pruning is a **retrospective filter**: the selection criterion (magnitude) only exists after training, but the thing being selected ($\theta_0$ values) existed before it.

## Why rewind to $\theta_0$ specifically

- random reinit gets the right structure but the wrong starting point in the loss landscape -> fails.
- $\theta_0$ rewind gets you back to the specific point that produced a good gradient trajectory.

D:: rewinding to the end of a previous round (instead of $\theta_0$ every time) breaks the experiment — you'd be testing partially-trained weights, not init. you can no longer separate "good init" from "good early training."
	C:: [[LMC]] — this exact distinction is what the 2020 follow-up goes after, and it turns out the thing i called a confound IS the mechanism. rewinding to $W_k$ is not a broken experiment, it's the correct one at scale.

## The "lucky init" frame

- **Lucky** = the init sits inside a basin of attraction of a good sparse solution before training starts. basin of attraction: a region in weight space where gradient descent converges to the same minimum regardless of small perturbations. #terminology
- bad init -> early gradients go the wrong direction -> wrong weights grow large -> pruning kills the right ones -> rewind from that $\theta_0$ fails.
- good init -> early gradients flow through the right subgraph -> those weights grow -> pruning finds them -> rewind works.

D:: **this makes LTH implicitly a loss landscape geometry claim**, even though the paper never states it that way. the (structure, init) pair matters because it determines where you start in the landscape and whether SGD finds a good basin. #big-idea
	[note to self: the paper genuinely never says "basin" — 0 occurrences. the closest it gets is the Discussion: ~ *the winning ticket initialization might land in a region of the loss landscape that is particularly amenable to optimization by the chosen optimization algorithm.* so the geometry reading is MINE, built on that one sentence.]

D:: training is the **detector**, not the **creator**. the goodness of a winning ticket was already present at $\theta_0$ — SGD reveals it, doesn't build it.
	A:: (later, after [[LMC]]) this is the sentence that doesn't survive. the first $k$ iterations do real work. "detects not creates" only holds where basin selection is trivial, i.e. small scale.

## Overparameterization

- dense networks are easier to train than sparse-from-scratch networks because they contain **more candidate subnetworks** — more tickets in the pool, higher probability at least one has a lucky init.
- D:: overparameterization is a **search strategy**, not a modeling choice. bigger networks aren't bigger because the task needs the capacity — they're bigger to guarantee enough random overlapping subnetworks that one gets a good draw. #big-idea
	C:: [[Measuring Intrinsic Dimension]] — same conclusion arrived at from the geometry side: "parameters needed for the solution != parameters needed to get to the solution". Li et al. show you cannot just directly train at $d$ DoF; LTH says the reason is you'd only have one ticket.
	C:: [[Understanding DL requires rethinking Generalization]] — Zhang says the capacity is there to memorize; LTH says the capacity is there to search. these are not the same story about why we go big.

## Option A vs Option B (unresolved in the paper)

- **Option A:** the right subgraph is a unique truth about the task — discovered, not invented.
- **Option B:** no unique right subgraph — many different sparse subnetworks could solve the task equally well; the winning ticket is *one that worked*, not *the* one.
- my evidence for B: different random seeds find different tickets but of similar quality. if there were one right answer you'd expect high variance in quality across seeds when the specific subgraph differs. instead: different subgraph, similar quality -> many good basins exist.
	[flag — the paper reports means and min/max over five trials, but it does NOT report ticket-overlap across seeds anywhere. so "different seeds find different subgraphs" is an assumption i imported, not a measured result in this paper. the low variance in *quality* is real and is in the error bars. verify the overlap claim elsewhere.]
	C:: [[Permutation Invariance in LMC]] resolves this in a direction i did not anticipate: the many "different" solutions may be permutations of one. that is a third option (Option C) sitting between A and B.
	C:: [[Random Tickets can win]] pushes hard on B — random tickets with the right layerwise ratios win too, which drains the specialness out of the specific mask.

## Where it breaks: VGG-19 / ResNet-18 on CIFAR-10

this is the part i under-weighted on first read and it's the seam [[LMC]] pries open.

- for deeper nets they switch to **global** pruning (lowest-magnitude across all conv layers collectively) instead of per-layer, because layers differ enormously in size (VGG-19 first two conv layers: 1728 and 36864 params; last: 2.35M) and small layers become bottlenecks.
- ~ *At the higher learning rate, iterative pruning does not find winning tickets, and performance is no better than when the pruned networks are randomly reinitialized.*
- at lr 0.01 the usual pattern reappears but the subnetworks ~ *are not winning tickets, since they do not match the original accuracy.*
- warmup (linear 0 -> lr over $k$ iters) is what rescues it. VGG-19 with warmup $k$=10000 at lr 0.1 finds winning tickets at $P_m \ge 1.5\%$. ResNet with warmup lr 0.03, $k$=20000 reaches 90.5% at $P_m$=27.1%.
- ~ *Even with warmup, however, we could not find hyperparameters for which we could identify winning tickets at the original learning rate, 0.1.*

D:: so already inside the original paper the method is fragile to scale + learning rate, and the fix (warmup = suppress early large steps) is a fix applied to **early training**. that is a hint sitting in plain sight.
	Q:: is warmup working because it delays/softens basin selection until gradients are informative? #lens/geometry
	C:: [[LMC]] answers this with instability analysis; and it turns out low-lr and warmup are exactly the two variants whose IMP subnetworks are *stable at init*.

[correction, external — from [[LMC]] Table 1 footnote: *"Frankle & Carbin mistakenly refer to ResNet-20 as 'ResNet-18,' which is a separate network."* so the "Resnet-18" in this paper is ResNet-20 (274K params, CIFAR-10).]

## Appendix findings (E–H)

- **E — random sparse vs random reinit.** for the fully-connected Lenet/MNIST, randomly *reinitialized* winning tickets **outperform** random sparsity. for all the convolutional nets there is **no significant difference** between the two.
	[correcting my earlier phrasing "they perform similarly" — that's true for the conv nets only, not Lenet.]
	their hypothesis: only certain parts of MNIST images carry information, so *position* in an FC layer matters; convolutions aren't tied to a location in the image so position matters less.
	D:: still a genuine surprise to me — structure + right init values should matter more than this implies. for conv nets, the *structure* found by IMP is worth ~nothing on its own; it's carrying almost all its value through the init values.
- **F.3 — sampling from $D_m$ instead of $D$ barely helps.** the winning-ticket init distribution is very different from the Gaussian (bimodal), but drawing fresh values from $D_m$ doesn't recover the performance. the *specific (position, value) pair* is what matters — not the shape of the distribution the values came from.
- **F.4 — "Pruning at Iteration 0" (prune by init magnitude, before any training) is worse than IMP.** weights that start small are not simply "unimportant from the start"; you can't shortcut IMP by pre-filtering on init magnitude.
	[precision: the paper says it performs worse than iterative pruning **and randomly reinitialized** — i.e. worse than the reinit baseline too, not just worse than IMP. stronger than i had it.]
- **F.5 — winning ticket weights change MORE during training than pruned weights, not less.** this kills the hypothesis that tickets are "already close to the optimum" at init.
	~ *One possible rationale for the success of winning tickets is that they already happen to be close to the optimum... Another possible rationale is that winning tickets are well placed in the optimization landscape for gradient descent to optimize productively... Figure 19 shows that winning ticket weights tend to change by a larger amount then weights in the rest of the network.*
	D:: tickets are go-getters, not head starts. well-positioned for gradient descent to move them productively.
	A:: their own caveat is load-bearing and i shouldn't skip it — ~ *magnitude-pruning biases the winning tickets we find toward those containing weights that change in the direction of higher magnitude.* so the effect could partly be an artifact of the selection criterion. magnitude pruning selects for large final weights; large final weight from a small init IS a large delta. this is close to circular and i don't think they escape it.
	they flag it as ~ *hope that winning tickets may be discernible earlier in the training process (or after a single training run)*.
- **F.6 — pruning spreads evenly across units, not concentrated in a few neurons.** every unit retains incoming connections roughly in proportion to how much the layer was pruned. no neuron goes fully dark, none is spared.
	D:: the ticket is a property of network-wide connectivity, not a subset of surviving neurons.
	C:: this is an early crack in `neuron -> feature` before i ever got to TMS. if the surviving computation were "some neurons matter", pruning should concentrate. it doesn't.
- **F.7 — tickets are robust to Gaussian noise on the init.** noise of $0.5\sigma$ barely changes accuracy; even at $3\sigma$ they still beat random reinit.
	D:: so "the exact $\theta_0$ values" is too strong. it's a neighborhood, not a point. that is a *region* claim = a geometry claim again.
- **F.1/F.2 — init magnitude predicts survival more strongly in deeper layers than in the input layer, for Adam.** the second hidden layer and output layer become increasingly **bimodal** (peaks either side of 0, and asymmetric: layer 2 keeps more positive, output keeps more negative). the first hidden layer keeps its distribution — ~ *meaning a connection's initialization has less relation to its final weight.*
	SGD (lr 0.8) shows the bimodal pattern across **all** layers including input, with its own asymmetry (layer 1 favours negative; layer 2 and output favour positive).
	not explained in the paper. open.

## Their own framing in the Discussion

~ *Test accuracy increases and then decreases as we prune, forming an Occam's Hill where the original, overparameterized model has too much complexity (perhaps overfitting) and the extremely pruned model has too little.* #terminology
~ *The lottery ticket hypothesis offers a complementary perspective on this relationship—that larger networks might explicitly contain simpler representations.*

D:: "explicitly contain simpler representations" is the single sentence closest to my trench. containment, not construction.
	Q:: contain in what sense — parameter subset, or function? because parameter sparsity != representational sparsity != computational sparsity. LTH only ever demonstrates the parameter version.

limitations they state themselves: only MNIST/CIFAR-10, no ImageNet (IMP costs 15+ consecutive trainings), unstructured sparse pruning only, and the warmup dependence on deeper nets.

---

## Surprise list (for video / recall)

1. LTH is a loss landscape claim in disguise — never stated as such, but implied.
2. Overparameterization is a search strategy, not a modeling choice.
3. Training is the detector, not the creator.
4. Pruning is a retrospective filter — the selection criterion only exists after training.
5. Winning ticket weights are go-getters, not already-there — they move *more*, not less.
6. Init magnitude predicts survival in deep layers but not the input layer (Adam); SGD shows it everywhere, bimodally.
7. Sampling from the winning ticket distribution doesn't help — position matters, not shape.
8. Pruning spreads evenly across units, not neurons — no unit goes dark.
9. The ticket isn't the weights. It's the (structure, starting point) pair.
10. Option B: many equivalent sparse solutions likely exist; overparameterization just raises the odds you contain one.

## Open questions carried into synthesis

- is the winning subgraph unique to the task, or one of many equivalent solutions? (leaning Option B — needs [[LMC]] to sharpen.)
- why does the input layer behave differently from deeper layers under Adam?
- can a winning ticket be identified *before* full training — after a single epoch, or via some other early signal? (F.5 hints at this: ticket weights already show larger training deltas, which they flag as "offering hope" for cheaper ticket-finding.)
	-> [[LMC]] turns out to be the answer to this one, and the answer is "yes, but not before training — early *in* training."
- Q:: is the presence of a winning ticket necessary or sufficient for SGD to reach a given test accuracy? (they raise this and don't answer it.)

---

POST::
#lens/structure #lens/geometry

1. What did they actually establish?
	existence, empirically, on MNIST + CIFAR-10 (Lenet, Conv-2/4/6, VGG-19, ResNet-20): magnitude pruning after training, with weights rewound to $\theta_0$, yields sparse subnetworks at 10–20% (often far less) that match or beat the dense net's test accuracy in at most the same iterations. and that the init is load-bearing — random reinit of the same mask fails, and fails harder the sparser you go. that's it. everything about *why* is conjecture and they say so.

2. What do I think it means?
	the computation lives in a subgraph, and the subgraph's identity is not a property of the architecture alone — it's architecture + where in weight space you started. which means "which parts carry the computation" is not answerable by looking at the trained network alone; it's a fact about a trajectory. that reframed the whole trench for me. compression stopped being an inference-time concern and became a probe.

3. What remains unproven / questionable?
	- the Conjecture is untested. "SGD seeks out and trains a subset of well-initialized weights" is asserted, not shown.
	- the go-getter result may be partly an artifact of magnitude pruning selecting for large deltas (their own caveat, and i think it's serious).
	- scale. no ImageNet. and the deeper CIFAR nets already need warmup / lower lr, which is not a small asterisk — it's the whole crack.
	- "$\theta_0$ specifically" is softer than it sounds given F.7 (robust to $3\sigma$ noise). so it's a region.
	- unstructured sparsity only — nothing here is a claim about hardware-realizable structure.

4. What changed in my world model?
	i came in thinking pruning tells you what was redundant. i left thinking pruning tells you what was *lucky*. and the luck is geometric — it's about where you start, not what you are. this is where the geometry lens entered the trench for me, even though the paper doesn't own that framing.
	also: "we overparameterize to find, not to represent" got its first hard evidence here.
