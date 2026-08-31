#!/usr/bin/env bash
# Copy the Obsidian vault into content/ and public/notes/.
#
# The vault is the source of truth; this repo holds a committed snapshot of it.
# Run it, look at `git diff`, commit, push. Nothing else needs to change.
#
#   ./scripts/sync-vault.sh              # uses the default vault path
#   VAULT=~/some/other/vault ./scripts/sync-vault.sh
set -euo pipefail

VAULT="${VAULT:-$HOME/Obsidian Vault}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RESEARCH="$VAULT/AI resarch"

if [[ ! -d "$RESEARCH" ]]; then
  echo "no vault at '$RESEARCH' — set VAULT=/path/to/vault" >&2
  exit 1
fi

# vault file (relative to the vault) -> path in the repo
copy() {
  local src="$VAULT/$1" dst="$ROOT/$2"
  if [[ -f "$src" ]]; then
    mkdir -p "$(dirname "$dst")"
    cp "$src" "$dst"
    echo "  $2"
  else
    echo "  ! missing in vault: $1" >&2
  fi
}

echo "papers:"
copy "AI resarch/papers/LTH.md"                                          content/papers/lth.md
copy "AI resarch/papers/LMC.md"                                          content/papers/lmc.md
copy "AI resarch/papers/Permutation Invariance in LMC.md"                content/papers/permutation-invariance.md
copy "AI resarch/papers/Explain Grokking circuit efficiency.md"          content/papers/grokking-circuit-efficiency.md
copy "AI resarch/papers/Random Tickets can win.md"                       content/papers/random-tickets.md
copy "AI resarch/papers/Understanding DL requires rethinking Generalization.md" content/papers/rethinking-generalization.md
copy "AI resarch/papers/Measuring Intrinsic Dimension.md"                content/papers/intrinsic-dimension.md
copy "AI resarch/papers/On the Mechanism and Dynamics of Modular Addition.md"   content/papers/modular-addition.md
copy "AI resarch/papers/NTK.md"                                          content/papers/ntk.md
copy "AI resarch/papers/Progress measures grokking.md"                   content/papers/progress-measures-grokking.md
# Written in the vault? add the line and delete the stub in content/papers/.
[[ -f "$VAULT/AI resarch/papers/Toy Models of Superposition.md" ]] && \
  copy "AI resarch/papers/Toy Models of Superposition.md"                content/papers/superposition.md
[[ -f "$VAULT/AI resarch/papers/Rewinding in Pruning.md" ]] && \
  copy "AI resarch/papers/Rewinding in Pruning.md"                       content/papers/rewinding-vs-finetuning.md

echo "research:"
copy "AI resarch/TRENCH.md"                content/research/trench.md
copy "AI resarch/SYNTHESIS.md"             content/research/synthesis.md
copy "AI resarch/WORLD-MODEL-HISTORY.md.md" content/research/history.md
copy "AI resarch/NOTATION.md"              content/research/notation.md
copy "AI resarch/Paper Queue.md"           content/research/queue.md

echo "foundations:"
copy "Foundations/TERMINOLOGY.md"            content/foundations/terminology.md
copy "Foundations/Weight Decay.md"           content/foundations/weight-decay.md
copy "Foundations/P-norms (Lebesgue norms).md" content/foundations/p-norms.md

echo "attachments:"
mkdir -p "$ROOT/public/notes"
shopt -s nullglob
for f in "$VAULT/assets/"*.png "$VAULT/assets/"*.jpg "$VAULT/assets/"*.jpeg "$VAULT"/*.png; do
  cp "$f" "$ROOT/public/notes/"
  echo "  public/notes/$(basename "$f")"
done

echo
echo "done. review with: git diff --stat"
