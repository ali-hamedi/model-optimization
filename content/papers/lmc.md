---
authors: Jonathan Frankle, Gintare Karolina Dziugaite, Daniel M. Roy, Michael Carbin
---
![[Pasted image 20260831090310.png]]
# Linear Mode Connectivity and the Lottery Ticket Hypothesis

ICML 2020 · arXiv 1912.05671 · Tier 2 read · session ~2026-06-07
#lens/geometry #lens/structure

---
PRE::
		1. Why am I reading this?
		2. What do I expect it to claim?
		3. Which trench/lens question does it attack?

PRE::

1 Why am I reading this?
[[LTH]] left me with "the ticket is fixed at init" and an open question about whether that survives scale. also LTH never says "landscape" out loud and i already decided it's secretly a geometry claim — i want the paper that says it out loud.

2 What do I expect it to claim?
that the LTH story extends/breaks at scale, and that the fix is about *when* you look, not *where*.

3 Which trench/lens question does it attack?
bridge between #lens/structure and #lens/geometry. this was my first real entry into the loss-landscape lens — not fully on that lens yet, more of a bridge.

---

## 1. The measuring instrument: instability

this is the actual contribution. everything else is downstream of having a ruler.

let $E(W)$ be the (train or test) error of a network with weights $W$. for two weight vectors:

$$
E_\alpha(W_1,W_2) = E(\alpha W_1 + (1-\alpha)W_2), \qquad \alpha \in [0,1]
$$
$$
E_{sup}(W_1,W_2) = \sup_\alpha E_\alpha(W_1,W_2)
$$
$$
\bar{E}(W_1,W_2) = \text{mean}(E(W_1), E(W_2))
$$

**error barrier height** on the linear path = $E_{sup} - \bar{E}$. when used for instability analysis they call it the **linear interpolation instability**. #terminology

~ *We consider a network N stable to SGD noise when the networks that result from instability analysis are linearly mode connected; that is, when the linear interpolation instability of N ≈ 0.*

practical thresholds:
	stable: instability $< 2\%$ (chosen to match barrier heights reported by Draxler et al. and Garipov et al.)
	matching: accuracy drop $< 0.2\%$ vs the full network
	30 evenly-spaced $\alpha$; 3 inits × 3 data orders = 9 samples per point

**the control that makes this mean "instability to SGD noise" and not just "these two nets differ":** $W_1$ and $W_2$ must come from the *same starting checkpoint* ($W_0$, or $W_k$), same architecture, same data, same loss. the ONLY thing allowed to vary is the SGD noise source — data order and augmentation.

	Algorithm 1:
		$W_T^1 = A_{k\to T}(W_k, u_1)$, $u_1 \sim U$
		$W_T^2 = A_{k\to T}(W_k, u_2)$, $u_2 \sim U$
		return $f(W_T^1, W_T^2)$

D:: $E_{sup} - \bar{E} \approx 0$ is a **strict** geometric claim. it is not "same general low-loss region" — it's that the *straight chord* between the two endpoints stays low the whole way. two networks can both reach good accuracy and still be linearly disconnected. linear connectivity through low error is a tight, rare condition — that's exactly why it's useful as a probe. #big-idea
	the paper backs this up itself: ~ *the modes found by Draxler et al. and Garipov et al. are not connected by linear paths.* nonlinear mode connectivity is generic; linear is not. ~ *The only extant example of linear mode connectivity is by Nagarajan & Kolter (2019)*.
	C:: [[Permutation Invariance in LMC]] — Entezari builds directly on this ruler and then argues the barriers are permutation artifacts. read LMC first, then that; the order matters.

**appendix G is worth remembering:** they try other comparison functions and they're worse.
	$L_2$ distance — no clean relationship. ~ *there is no clear interpretation of L2 distance*, and it stays far from 0 even when the network is stable.
	classification differences (how many examples the two nets label differently) — no relationship for the unpruned nets, but it DOES track instability for the IMP subnetworks (50% of max possible differences at $k$=0 -> 21% at $k$=1000 for ResNet-20).
	per-example loss vector distance — mirrors the classification-difference behaviour.
	D:: so the choice of linear interpolation isn't cosmetic. two nets can be functionally similar and still barrier-separated, and far apart in $L_2$ and still linearly connected. the chord is measuring something the other rulers don't see.

## 2. Basins — MY picture, not theirs

flagging this hard because it matters for the "what did they show vs what did i think" test:
**the word "basin" does not appear in this paper. not once.** they say "linearly connected minimum" throughout. the basin vocabulary is mine, imported and then reinforced by [[Permutation Invariance in LMC]].

my picture:
- the loss landscape $L(W)$ is a fixed function of architecture + data + loss. training does not reshape it — it only moves weights *through* it. (i tested this against the alternative "training carves the landscape" framing and rejected it: $L(W)$ has the same value regardless of how you arrived at $W$.)
- a **basin** = a connected low-loss region. different basins = separated by a barrier.
- $E_{sup} - \bar{E} \approx 0$ between two endpoints means: same basin, and specifically a basin shaped so the straight chord between the endpoints stays on the floor.

D:: the landscape being fixed is the thing that makes basin-*selection* the right word instead of basin-*construction*. the basin was always there; which one gets committed to is what's decided during $0 \to k$. #big-idea

## 3. What they actually measured (unpruned nets)

~ *Except for LeNet (MNIST), none of the networks are stable at initialization. In fact, train and test error rise to the point of random guessing when linearly interpolating.*

when they become stable (test error):

| network | becomes stable | fraction of training |
|---|---|---|
| LeNet (MNIST) | at init | 0% |
| ResNet-20 (CIFAR-10) | iter 2000 | 3% |
| VGG-16 (CIFAR-10) | iter 1000 | 1.5% |
| ResNet-50 (ImageNet) | epoch 18 | 20% |
| Inception-v3 (ImageNet) | epoch 28 | 16% |

**the confound they kill (and i should remember they killed it):** running instability from step $k$ changes two things at once — the starting state AND the number of remaining steps $T-k$. maybe instability just drops because the copies have less time to diverge. so they redo it training both copies for the full $T$ steps with the LR schedule reset. ~ *Instability is indistinguishable in both cases.* good. it's the state, not the clock.

D:: **basin selection is a phase, not a quantity.** it has a start, an end, and the boundary is empirically measurable. that's what instability analysis buys you. #big-idea
their own version of this, more cautious than mine:
~ *Our full network results divide training into two phases: an unstable phase where the network finds linearly unconnected minima due to SGD noise and a stable phase where the linearly connected minimum is determined.*
and they connect it to Gur-Ari et al. (Hessian eigenspectrum settling into a few large values + a bulk) and to why large-batch/high-lr training needs warmup (Goyal et al.).
	C:: warmup again. [[LTH]] needed warmup to find tickets in VGG-19/ResNet at high lr and couldn't explain why. here warmup shows up as a known intervention on exactly the unstable phase. that's the same seam from two directions.

**appendix B — the detail that keeps me honest about "committed":** at the point where the networks become stable they are still FAR from their final weights, with substantial distance left to travel. and even after stability, the $L_2$ distance between the two copies is still 25% / 45% / 27% / 28% of the total distance the network travels over training (ResNet-20 / VGG-16 / ResNet-50 / Inception-v3).
	D:: so "stable" does NOT mean "converged" and does not mean "the two runs end up at the same point". they end up far apart and linearly connected. the commitment is to a *region*, and the region is big.
	Q:: how big is a linearly connected region, really? if two points 25–45% of the whole trajectory apart are chord-connected, "basin" might be doing too much work as a mental image — that's less a valley than a plain. #lens/geometry

## 4. Instability applied to lottery tickets

IMP generalized (Algorithm 2): train $W_0 \to W_k$, then loop { train $m \odot W_k \to W_T$, prune lowest-magnitude globally, rewind survivors to $W_k$ }. $k=0$ recovers [[LTH]] exactly.

~ *When we rewind to iteration k > 0, subnetworks are no longer randomly initialized, so the term winning ticket is no longer appropriate. Instead, we refer to such subnetworks simply as **matching**.* #terminology

**the central result:**
~ *IMP subnetworks are only matching when they are stable to SGD noise.*

at $k=0$ (Table 2): LeNet matching. ResNet-20 low/warmup and VGG-16 low/warmup matching. standard ResNet-20, standard VGG-16, ResNet-50, Inception-v3 **not** matching — and ~ *they are no more accurate than subnetworks generated by randomly pruning or reinitializing the IMP subnetworks, suggesting that neither the structure nor the initialization uncovered by IMP provides a performance advantage.*

D:: that last clause is brutal for the strong reading of LTH. at scale, at $k$=0, the ticket has *no* content — not the mask, not the values.

the low/warmup detail is the good one: Frankle & Carbin picked those hyperparameters purely to make IMP work. it turns out those are exactly the variants that are *stable at init*. they were unknowingly tuning for stability.

**rewinding fixes it.** IMP subnetworks that were unstable at $k$=0 become stable when rewound later: ResNet-20 at iter 500, VGG-16 at iter 1000, ResNet-50 at epoch 5, Inception-v3 at epoch 6. and matching appears at closely coinciding rewind points.

~ *In all cases, the IMP subnetworks become stable sooner than the unpruned networks, substantially so for ResNet-50 (epoch 5 vs. 18) and Inception-v3 (epoch 6 vs. 28).*

	D:: the **subnetwork stabilizes before the dense network does**. i keep wanting to read this as "pruning helps you commit faster" but i should be careful — the mask was generated by a full IMP run that saw the whole trajectory. the subnetwork isn't ahead of the dense net; it's built with information from the dense net's future. #lens/geometry
	Q:: is early stability of the subnetwork a *property* of the sparse landscape, or an artifact of the mask being computed with hindsight? no clean way to separate these here.

also: random pruning and random reinit are unstable and non-matching at **all** rewind points (LeNet excepted). so stability isn't something any sparse net gets by training a bit — it tracks IMP specifically.

## 5. Sparsity ranges I / II / III

**[CORRECTION — this is where my earlier notes were wrong, and wrong in a way that generated a whole fake mechanism. writing it out so i don't re-derive the error.]**

my earlier notes had Range I/II/III as *rewinding-point* ranges (Range I = very early/$W_0$, Range II = early $W_k$, Range III = late $W_k$, "pruned too late"). **that is not what the paper says.** the ranges are **levels of sparsity**, measured at the best rewinding iteration, from Figure 9 / §4.4:

- **Range I — trivial sparsity.** so overparameterized that even *randomly pruned* subnetworks are matching.
	ResNet-20: $>80.0\%$ weights remaining. VGG-16: $>16.8\%$.
- **Range II — the interesting band.** only IMP subnetworks are matching.
	ResNet-20: $80.0\%$–$13.4\%$. VGG-16: $16.8\%$–$1.2\%$.
	and in part of this band, matching and stable arrive at approximately the *same* rewinding iteration — ResNet-20 $51.2\%$–$13.4\%$, VGG-16 $6.9\%$–$1.5\%$.
- **Range III — too sparse.** even IMP is not matching at *any* rewinding iteration they consider.
	ResNet-20: $<13.4\%$. VGG-16: $<1.2\%$.
	~ *the error of IMP subnetworks still decreases when they become stable (although not to the point that they are matching), potentially suggesting a broader relationship between instability and accuracy.*

so **Range III IS the over-pruned / too-sparse phenomenon.** my "correction" that it was a pruned-too-late / landscape-mismatch phenomenon reversed the truth — i corrected a right label into a wrong mechanism. the "teleport into a landscape tuned for $L_{dense}$" story was built on top of the misreading.

what survives the correction:
	- the **stability vs matchability decomposition** is still real and still mine, and it's still the right way to read Range III: the subnetwork *is* stable there (basin selection still works) but the minimum it commits to has a higher floor. the paper's sentence above says exactly this in its own vocabulary.
	- the **teleport framing** (pruning is a transition between $L_{dense}$ and $L_{sparse}$, two different functions over different-dimensional spaces, not a move within one landscape) is still a frame i like and still not something the paper says. keep it, keep it labelled as mine.
	- **"pruning late hurts" does not survive as a claim about this paper.** Figure 7: networks matching at $k$=0 ~ *generally remain matching at later iterations (except for ResNet-20 low and VGG-16 low at the latest rewinding points).* that parenthetical is the ONLY late-rewind degradation in the paper, it's an aside, and it's only for the low-lr variants. so the intuition isn't dead but it has essentially no support here.
		C:: [[Rewinding in Pruning]] (Renda, Frankle & Carbin 2020) is where late-vs-early actually gets tested properly, and LR rewinding $\ge$ weight rewinding $\ge$ fine-tuning. that's the paper that owns this question, not this one.

**the stability-vs-sparsity curve answers my old open question.** i had asked: *"can we prune more aggressively at later $W_k$, given the network is more committed?"* Figure 9 speaks to it directly:
~ *As sparsity increases, the iteration at which the IMP subnetworks become stable decreases, plateaus, and eventually increases. In contrast, the iteration at which randomly pruned subnetworks become stable only increases until the subnetworks are no longer stable at any rewinding iteration.*
	D:: so the relationship isn't monotone. going sparser doesn't simply demand a later rewind — it demands an earlier one, then flattens, then demands a later one. and Range III is where "later" stops buying you anything at all. partial answer: yes up to a point, then no.
	Q:: what is the non-monotonicity? the decreasing arm is strange to me and i don't have a story for it.

## 6. What this does to my LTH entry

original [[LTH]] entry claimed the winning ticket is (structure, $\theta_0$), fixed at init, SGD "detects, doesn't create."

corrections:
- "fixed at initialization" does not survive at scale. IMP rewound to $W_0$ fails on ResNet-50/ImageNet.
- the unit of a winning ticket is **(structure, $W_k$)**, not (structure, $W_0$). #big-idea
- "SGD detects it, not creates it" needs revision: the first $k$ iterations do essential work. what gets detected is detected *after* that phase, not before it.
- at small scale, LTH works "by accident" — basin selection is trivial for LeNet, so $W_0$ and $W_k$ are in the same catchment and rewinding to either works. **LTH's apparent init-time claim only held because small networks make basin selection invisible.** scale is what exposes the dependence on $W_k$.

what survives:
- sparse subgraphs do carry the computation.
- overparameterization is still a search strategy — more candidate minima to select among.

their own framing of the practical upshot, which is less dramatic than mine:
~ *Recent proposals attempt to prune networks at initialization, but our results suggest that the best time to do so may be after some training.* ...*The existence of matching subnetworks early in training suggests that there is an unexploited opportunity to prune networks much earlier than current methods.*

## 7. Open mechanism question: what selects the basin?

LMC tells you *when* selection happens ($0 \to k$) and *that* it happens. it does not say *what*, mechanistically, determines which one gets chosen. three candidates i built and argued against each other — **none of these are in the paper**, this whole section is mine:

**H1 — Feature lottery.** different SGD noise -> different order/composition of gradient signal -> the network commits early to whichever features dominate first -> different minimum.
	weakness i surfaced: standard SGD has no strong curriculum effect (all features are seen across the full training set). H1's strong form (specific-features-first) is unsupported. its weak form (gradient composition varies) collapses into H2.

**H2 — Symmetry breaking.** $W_0$ is a high-symmetry state (interchangeable neurons/directions). the first $k$ iterations break symmetries; which minimum gets selected depends on which symmetries break which way, driven by noise.
	*best supported* by the data as i read it: explains high instability at $W_0$ (many possible symmetry-breaking outcomes) transitioning to stability at $W_k$ (one resolved configuration).
	C:: [[Permutation Invariance in LMC]] is the paper that makes this concrete — if the barriers between minima ARE permutation symmetry, then H2 isn't just a mechanism for basin selection, it's a claim that the "different basins" were never different. read in that order this is the strongest thread.

**H3 — Curvature settling / flat minima.** noisy SGD can't settle in sharp regions (noise -> large loss swings -> large corrective gradients -> ejected). it settles in flat regions. predicts: the selected minimum = flattest reachable from $W_0$.
	tension with the data: if there were one dominant flat minimum near $W_0$, all noise variants should funnel into it -> low instability at $W_0$. but instability at $W_0$ is empirically **high** for the large networks. partial evidence against H3's strong form — either many equally-flat minima exist (weakens its predictive power) or flatness isn't the selecting factor.
	[note: LMC does not discuss flatness or curvature at all. Keskar et al. appears only in the reference list. this is the Keskar / Hochreiter & Schmidhuber / Smith & Le line and it is a real research program, but importing it here is me, not them.]

**distinguishing experiments — none of these have been run as a clean three-way test:**
	- freeze a random subset of weights at $W_0$ (forces specific symmetries) -> tests H2
	- bias batch composition during $0 \to k$ toward specific feature classes -> tests H1
	- add anisotropic (direction-dependent) noise during $0 \to k$ -> tests H3

flagged as a real open problem and a candidate direction for the empirical contribution.
	A:: on my own H1 dismissal — i rejected it using an *outcome* ("noise gets pruned out after $k$") to refute a *process* claim ("noise determines the minimum during $0\to k$"). those describe different phases and the outcome doesn't refute the process; the process is what produces the outcome. keep this as a general epistemic check, it's not a one-off. #big-idea

---

## Surprise list (session)

1. Linear connectivity is a *strict* probe — the straight-line chord staying low is a much stronger claim than "same general low-loss region."
2. The loss landscape is fixed; training moves weights through it, doesn't carve it. (rejects the intuitive "training constructs the basin" framing — and i was one step from believing the opposite.)
3. Basin selection is a *phase*, not a quantity — it has a start, an end, and the boundary is empirically measurable via instability.
4. Pruning is a transition between landscapes, not a move within one — the "teleport" framing. (mine, not theirs, and it survived the Range correction.)
5. ~~Range III is landscape-mismatch / pruned-too-late~~ -> **WRONG, see §5.** Range III is exactly the over-pruned/too-sparse regime. what survives is the stability/matchability split: stable there, but the minimum has a higher floor.
6. The winning-ticket unit changes from (structure, $W_0$) to (structure, $W_k$) — LTH's init-time claim only holds trivially at small scale.
7. Flat minima (H3) is a real research line but LMC's own $W_0$-instability data partially weakens its strong form. (and LMC itself says nothing about flatness — that's me.)
8. Process vs outcome confusion is a recurring general error, not a one-time slip.
9. "Stable" does not mean "converged" — at the stability point the nets still have 25–45% of their total travel left, and the two copies end up that far apart while still chord-connected.
10. Linear interpolation beats $L_2$ and functional-difference rulers (appendix G). the instrument choice is doing real work.
11. The unit of good interrogation is the *menu of mutually exclusive, falsifiable positions*, not the question itself.

---

POST::
#lens/geometry #lens/structure

1. What did they actually establish?
	an instrument (instability analysis + linear interpolation as the comparison function) and two empirical facts with it. (a) standard vision networks are unstable to SGD noise at init but become stable early in training — 3% for ResNet-20, 1.5% for VGG-16, 20% for ResNet-50, 16% for Inception-v3 — after which the outcome of optimization is determined to a linearly connected minimum. (b) extremely sparse IMP subnetworks are matching *only when they are stable*, which is at init for MNIST-scale and only after some training at ImageNet scale. plus the generalization of IMP to rewind to any $W_k$, which is what makes lottery tickets work at ImageNet scale at all.
	NOT established: any mechanism. they don't say what happens during $0 \to k$, and they don't use basin/flatness/symmetry language anywhere.

2. What do I think it means?
	"which parts carry the computation" gets a temporal answer. the lucky pair isn't (structure, $W_0$), it's (structure, $W_k$) — $W_k$ being the point at which the network has become stable to SGD noise. the identity of the ticket is not a fact about initialization, it's a fact about a short early window of the trajectory. and the thing that decides it is noise, which means the ticket is not a property of the network at all until the noise has been resolved.
	that pushed my trench sideways: from "where is the computation" toward "when does it become determined", which is the dynamics axis, and it's the first time the geometry lens became load-bearing for me instead of decorative.

3. What remains unproven / questionable?
	- the mechanism of $0 \to k$. wide open. H1/H2/H3 are mine and undistinguished.
	- the basin vocabulary i'm using is not the paper's and might be smuggling in more structure than "linearly connected minimum" licenses — especially given appendix B (two chord-connected points 25–45% of a trajectory apart).
	- whether the IMP subnetwork's *earlier* stability is a real property or hindsight leakage from the mask-generation procedure.
	- the non-monotone stability-vs-sparsity curve in Fig 9. no story.
	- and my own reading discipline: i mis-transcribed the ranges and built a mechanism on top of it. the mechanism *sounded* better than the paper. that's the failure mode to watch — a coherent story is not evidence.

4. What changed in my world model?
	"fixed at initialization" died. i now think the interesting object is the early window, not the init and not the trained net.
	also, and this is the durable one: **instability analysis is a template.** pick two runs that differ in exactly one controlled way, interpolate, measure the barrier. that's a reusable instrument for "when does X become determined", and X doesn't have to be SGD noise.
	Q:: could i run instability analysis with the controlled variable being something other than data order — e.g. two runs differing only in a single feature's presence early on? that would be a direct test of H1 and it's the same apparatus. #probe
