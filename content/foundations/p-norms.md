---

---


---
There are infinitely many, generalized by the $L_p$ norm formula:

$$ |\mathbf{w}|_p = \left( \sum_i |w_i|^p \right)^{1/p} \quad \text{for } p \ge 1 $$

The four most common in machine learning are:

1. **$L_0$ (Pseudo-norm):** The count of non-zero elements.
2. **$L_1$ (Manhattan):** The sum of absolute values, $\sum_i |w_i|$. Used for Lasso regularization to create sparse networks.
3. **$L_2$ (Euclidean):** The square root of the sum of squares. Used for Ridge regularization (weight decay).
4. **$L_\infty$ (Max):** The single largest absolute value, $\max_i |w_i|$.

---

## $L_1$ Norm (Manhattan Norm)

### Definition

Measures the sum of the absolute values of a vector. For $\mathbf{w} = [w_1, w_2, \dots, w_n]$:

$$ |\mathbf{w}|_1 = \sum_{i=1}^{n} |w_i| $$

### Intuition

The "city block" or Manhattan distance. The distance traveled from the origin if you can only move along the grid axes, never diagonally.

### In Machine Learning (Lasso Regularization)

Used to penalize the absolute size of the weights. The regularized objective is:

$$ J(\mathbf{w}) = L(\mathbf{w}) + \lambda |\mathbf{w}|_1 $$

- $L(\mathbf{w})$: Original loss (e.g. cross-entropy).
- $\lambda$: Regularization strength.
- $|\mathbf{w}|_1$: The absolute value penalty.

### Key Property (Sparsity vs. Dense)

Unlike $L_2$ regularization (which shrinks all weights proportionally but rarely zeroes them out), $L_1$ regularization forces the optimizer to drive less important weights exactly to zero. This mathematically prunes the network during training, acting as an automated feature selection mechanism and producing highly sparse models.

---

## $L_2$ Norm

### Definition

The $L_2$ norm measures the Euclidean length (magnitude) of a vector. For a vector $\mathbf{w} = [w_1, w_2, \dots, w_n]$, the $L_2$ norm is defined as:

$$ \boxed{\ |\mathbf{w}|_2 = \sqrt{\sum_{i=1}^{n} w_i^2}\ } $$

For example, for $\mathbf{w} = [w_1, w_2, w_3]$ we have:

$$ |\mathbf{w}|_2 = \sqrt{w_1^2 + w_2^2 + w_3^2} $$

### Intuition

Think of the $L_2$ norm as the **straight-line distance from the origin to the vector**.

### In Machine Learning

The $L_2$ norm is commonly used in **regularization** to discourage model weights from becoming too large. A typical $L_2$ penalty is based on the **squared $L_2$ norm**:

$$ |\mathbf{w}|_2^2 = \sum_i w_i^2 $$

The regularized objective can be written as:

$$ J(\mathbf{w}) = L(\mathbf{w}) + \lambda |\mathbf{w}|_2^2 $$

where:

- $L(\mathbf{w})$ — original loss
- $\lambda$ — regularization strength
- $|\mathbf{w}|_2^2$ — penalty on large weights
