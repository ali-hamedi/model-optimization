# *Compression as a Probe of Computation: How Overparameterized Neural Networks Discover Efficient Generalizing Solutions*





## Does generalization actually correspond to more efficient computation—and if so, efficient in what sense?
###### How does an overparameterized neural network discover and represent the efficient computation that generalizes?

#### 



              THE CENTRAL PROBLEM

     How does an overparameterized neural network
       discover an efficient computation that
                  generalizes?
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   OPTIMIZATION       STRUCTURE      REPRESENTATION
    / GEOMETRY        / CIRCUITS
        │                │                │
  How is it found?   What does the    How is useful
                     actual work?     information /
                                      computation encoded?
        │                │                │
        └────────────────┼────────────────┘
                         │
	        VIA TRAINING DYANMICS AND EMERGANCE
					    |
                    COMPRESSION
                         │
                         ▼
                  GENERALIZATION
                 / EFFECTIVE COMPLEXITY






## Optimization geometry / loss landscape

How does overparameterization change the geometry through which optimization discovers solutions :
	1. Many parameters -> more degrees of freedom -> connected -> easier optimization geometry -> solution
	2. Why might we need 100M parameters to _find_ something that ultimately requires far less?
	

## Structure / circuits / parameter necessity

Where is the computation?

Does useful computation reside in a sparse subnetwork?

> Perhaps a sparse structure is sufficient to **represent** the solution, while the dense landscape is necessary to **discover** it.


## Representation

How efficiently is computation represented internally?
before TMS:
	neuron → feature
	weight → importance
	subnetwork → computation



## 🚫 GENERALIZATION

                    GENERALIZATION
                         ▲
                         │
             Why does this emerge?
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
   GEOMETRY          STRUCTURE       REPRESENTATION
       │                 │                 │
   How found?       What computes?     How encoded?

## Training Dynamics & Emergence

How does the eventual generalizing computation emerge during training: 
	- Geometry: How does the optimization trajectory/landscape relationship evolve
	- Structure:  When do useful circuits/subnetworks emerge?
	- Representation: When and how do useful features emerge/reorganize
	- Generalization: When does learned computation transition from fitting/memorization to rule-like behavior​




Therefore:

parameter sparsity != representational sparsity != computational sparsity



capacity needed to FIND a solution != capacity needed to REPRESENT the solution​

​
Therefore:

same dataset performance⇒same function​

and even:

same test accuracy⇒same generalizing algorithm

                     OVERPARAMETERIZATION
                            │
                Why does excess capacity help?
                            │
            ┌───────────────┴────────────────┐
            │                                │
      LEARNING COMPLEXITY              SOLUTION COMPLEXITY
    "What helps us find it?"         "What is actually needed?"
            │                                │
      optimization geometry              compression
      SGD dynamics                        pruning
      connectivity                        rank
      symmetries                          distillation
            │                                │
            └───────────────┬────────────────┘
                            │
                       GENERALIZATION
                            │
           What must be preserved for a
              "solution" to remain?
                            │
            ┌───────────────┼───────────────┐
        parameters     representations    function


parameter efficiency!=representational efficiency!=computational efficiency‌!=functional simplicity​


PARAMETERS

↓

COMPUTATION / CIRCUITS

↓

REPRESENTATIONS / FEATURES

↓

FUNCTION / BEHAVIOR

