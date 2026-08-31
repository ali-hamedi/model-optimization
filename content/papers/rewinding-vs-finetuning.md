---
authors: Alex Renda, Jonathan Frankle, Michael Carbin
---

# Comparing Rewinding and Fine-tuning in Neural Network Pruning

ICLR 2020 · arXiv 2003.02389
#lens/structure #lens/emergance

---

*Reading note not written yet. What is below is the entry from my
world-model history, kept here so the map is not lying about what I know.*

They tested three setups:

1. Fine-tuning — $TRAIN_t(W_T, m, T)$
2. Weight rewinding (the [[LTH]] move) — $TRAIN_t(W_{T-t}, m, T-t)$
3. Learning-rate rewinding — $TRAIN_t(W_T, m, T-t)$

And showed:

learning-rate rewinding $\ge$ weight rewinding $\ge$ fine-tuning

D:: If keeping the *trained* weights and rewinding only the schedule matches or
beats rewinding the weights, then the original initialization was never the
load-bearing part. This is a counter to LTH from inside the same author group.
