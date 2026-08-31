                       CURRENT WORLD MODEL
                              │
              ┌───────────────┴───────────────┐
              │                               │
       WHAT I THINK I KNOW              WHAT I DON'T KNOW
              │                               │
         DEDUCTIONS                       QUESTIONS
              │                               │
              └───────────────┬───────────────┘
                              │
                         HYPOTHESES
                              │
                    competing explanations
                              │
                         ┌────┴────┐
                         │         │
                      SUPPORT    ATTACKS
                         │         │
                         └────┬────┘
                              │
                     CROSS-PAPER CONNECTIONS
                              │
                              ▼
                     CURRENT TRENCH MODEL

# Current World Model

# Deductions

# Hypotheses

# Open Questions

# Attacks / Tensions

# Cross-Paper Connections

# Current Trench Model



---
### D:: Deductions

- **Search Scaffold:** capacity needed to **find** a solution may be much larger than capacity needed to **represent** it.
- Parameter sparsity ≠ representational sparsity ≠ computational sparsity.
- Parameter efficiency ≠ representational efficiency ≠ computational efficiency ≠ functional simplicity.
- Parameter space ≠ representation space ≠ function/behavior space.
- Same dataset/test performance ≠ same function ≠ same generalizing algorithm.
- **LMC:** early optimization may move a subnetwork into a region where its dynamics become stable/robust enough to recover the solution.
- **Zhang:** function representability ≠ finite-sample expressivity.
- **Li:** ambient parameter count ≠ effective search dimension.
- Extra parameters can increase the dimensionality of the solution manifold without necessarily implying new basins.
- **He:** sufficiently wide networks may provide enough feature diversity for optimization to select and align useful Fourier components.
- Generalizing computation may **emerge during training**, rather than existing as a clean circuit at initialization.

### H:: Hypotheses

- **Search Scaffold Hypothesis:** overparameterization supplies optimization degrees of freedom that are useful during learning but unnecessary for the final computation.
- **Emergent Circuit Hypothesis:** early training may contain partial/memorizing/dumb circuits that eventually yield to or compose into a generalizing circuit.
- **Efficiency–Generalization Hypothesis:** generalizing computation tends to have lower _effective_ complexity / greater efficiency than memorizing computation—but the correct notion of efficiency is unresolved.
- **He initialization hypothesis:** initialization may largely determine which Fourier feature becomes dominant; SGD amplifies it; weight decay may mainly clean residual components.
- Better initialization might shorten/eliminate grokking.
- Winning Fourier components might be identifiable near initialization and pruneable early.
- Your He→Random Tickets hypothesis: random tickets may work when sufficient width/layerwise allocation preserves enough useful feature diversity for optimization to recover the solution. - biggest hypothesis worht persuing

### Q:: Open questions

- What notion of **efficiency** actually correlates with generalization?
- Does compressibility distinguish memorization from generalization?
- Is fewer effective degrees of freedom associated with more generalization?
- Moving capacity from 0→∞, what happens to the accessibility of generalizing vs memorizing solutions?
- Does extra width create new basins, or mostly enlarge/connect existing solution manifolds?
- When does useful sparse structure actually emerge?
- Is weight decay necessary for grokking/generalization, or mainly accelerating/cleaning the transition?
- Can initialization eliminate/reduce grokking delay?
- Can useful Fourier components/circuits be detected and pruned near initialization?
- What happened in the AlexNet + data augmentation exception in Zhang?
- What is actually preserved by successful compression: parameters, computation, representation, function, or only performance?

### A:: Attacks

- Why should existence of many memorizing solutions imply we need **explicit** regularization?
- LTH's strong “special ticket” interpretation is weakened by Random Tickets.
- Parameter count by itself is a poor candidate for “true computational complexity.”
- Weight sparsity may be a bad microscope if useful features are distributed/superposed.
- Weight decay should not automatically be credited as _the_ causal mechanism for generalization merely because it participates in a toy grokking setup.
- dintd_{\text{int}} should not be interpreted as “minimum number of neural-network parameters required for the task.”

### C:: Major connections

- **LTH ↔ LMC:** structure ↔ optimization geometry/stability.
- **LMC ↔ Permutation Invariance:** local mode-connectivity story ↔ global symmetry/single-basin picture.
- **LTH ↔ Random Tickets:** privileged sparse structure challenged by random masks/layerwise sparsity.
- **LTH ↔ Rewinding:** initialization story refined toward early-training dynamics.
- **Zhang ↔ Grokking:** mere capacity to memorize doesn't explain which solution training selects.
- **Zhang ↔ Li:** massive ambient capacity vs potentially much smaller effective solution/search dimension.
- **Grokking ↔ He:** coarse memorizing→generalizing circuit transition becomes fine-grained feature-selection/alignment dynamics.
- **LTH ↔ He:** winning-ticket-style selection viewed through Fourier-feature specialization.
- **Random Tickets ↔ He:** your hypothesis that sufficient feature diversity may explain why randomized tickets remain trainable.

### O:: Observations worth separating from deductions

- Generalizing and memorizing circuits in the grokking setup have different efficiency and learning-speed properties.
- There is a dataset-size crossover DcritD_{\mathrm{crit}} in that setup.
- Li: once sufficiently overparameterized, extra dimensions can enlarge the solution manifold.
- He: dominant-frequency amplification, suppression of other frequencies, phase alignment, diversification with sufficient width
---

# Current World Model

## 1. What I currently believe
3–5 strongest deductions.

## 2. Strongest hypotheses
2–4 hypotheses you actually want to test/track.

## 3. Biggest unresolved tensions
3–5 questions where the literature currently pulls in different directions.

## 4. Cross-paper connections
Only the connections that genuinely changed your model.

## 5. Current trench model
A short paragraph: “Right now, I think overparameterization may…”