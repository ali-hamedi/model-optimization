

## Definition

Weight decay is what $L_2$ regularization _does_ to the weights during training. The regularized objective is:

$$ J(\mathbf{w}) = L(\mathbf{w}) + \lambda |\mathbf{w}|_2^2 $$

- $L(\mathbf{w})$ — original loss
- $\lambda$ — regularization strength
- $|\mathbf{w}|_2^2 = \sum_i w_i^2$ — penalty on large weights

---

## Where the name comes from

Take the gradient of the objective with respect to one weight:

$$ \frac{\partial J}{\partial w} = \frac{\partial L}{\partial w} + 2\lambda w $$

So a gradient descent step with learning rate $\eta$ becomes:

$$ w \leftarrow w - \eta \frac{\partial L}{\partial w} - 2\eta\lambda w = (1 - 2\eta\lambda),w - \eta \frac{\partial L}{\partial w} $$

The weight gets multiplied by a factor slightly below 1 at every step — this is why it is called **weight decay**. Adding a penalty to the loss and shrinking the weights every step are the same operation.

---

## Example

With $\eta = 0.1$, $\lambda = 0.01$, and a weight $w = 2.0$ that the loss doesn't care about ($\partial L / \partial w \approx 0$), the shrink factor is $1 - 2(0.1)(0.01) = 0.996$:

- step 1: $w = 1.992$
- step 10: $w = 1.921$
- step 100: $w = 1.340$
- step 500: $w = 0.270$

It keeps shrinking but never actually reaches zero — the $L_1$ penalty would, since its pull $\eta\lambda,\text{sign}(w)$ is constant instead of proportional to $w$.

---

## Equilibrium

Weights don't decay to zero when the loss actually needs them. Each weight settles where the two forces cancel:

$$ \frac{\partial L}{\partial w} = -2\lambda w \quad \Longrightarrow \quad w^* = -\frac{1}{2\lambda}\frac{\partial L}{\partial w} $$

- Useful weight (steep loss gradient) → survives at a large value.
- Useless weight (flat loss) → decays toward zero.

So $\lambda$ sets the "price" a weight has to pay for its magnitude: it only keeps size if it earns it by reducing the loss.

---

## Conventions ($\lambda$ vs $\lambda/2$)

Many frameworks and papers write the penalty as $\frac{\lambda}{2}|\mathbf{w}|_2^2$ so that the 2 cancels in the derivative:

$$ w \leftarrow (1 - \eta\lambda),w - \eta \frac{\partial L}{\partial w} $$

Same idea, different bookkeeping. Only matters when comparing $\lambda$ values across sources — always check which convention is being used.

---

## The coupling problem (SGD vs AdamW)

In plain SGD the effective decay per step is $2\eta\lambda$ — it **depends on the learning rate**. Change $\eta$ and you silently change the regularization strength. With a learning rate schedule, the regularization decays along with $\eta$.

Worse with Adam: the $2\lambda w$ term is added to the gradient, so it passes through Adam's adaptive per-parameter normalization. Weights with large gradient magnitudes end up decaying _less_ than weights with small ones — the opposite of what's wanted.

**AdamW** fixes this by decoupling: the penalty is removed from the gradient and the shrink is applied directly to the weight, outside the adaptive step:

$$ w \leftarrow w - \eta \cdot \text{AdamStep}!\left(\frac{\partial L}{\partial w}\right) - \eta \lambda w $$

Every weight now decays at the same rate. This is why `AdamW` is the default choice for transformers, and why `Adam(weight_decay=...)` and `AdamW(weight_decay=...)` are **not** the same thing.

---

## Practical notes

- **Don't decay everything.** Apply it to weight matrices only. Biases and normalization parameters (LayerNorm / BatchNorm gains and shifts) are usually excluded — shrinking them just biases the network without helping generalization.
- **Typical values:** $\lambda \approx 10^{-4}$ for SGD on vision models; $\lambda \approx 0.01 - 0.1$ for AdamW on transformers.
- **Interaction with BatchNorm:** for layers followed by normalization, the weight scale is cancelled out by the normalizer, so weight decay affects the _effective learning rate_ rather than the function computed.
- **$L_2$ shrinks, $L_1$ prunes.** If sparsity is the goal, weight decay is the wrong tool — it gives small dense weights, not zeros.