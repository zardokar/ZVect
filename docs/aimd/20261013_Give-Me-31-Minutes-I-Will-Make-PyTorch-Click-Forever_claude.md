# Give me 31 minutes, I will make PyTorch click forever — Zachary Huang - Claude Context
> Source: YouTube, Zachary Huang, "Give me 31 minutes, I will make PyTorch click forever", 31:55, published 2026-10-13 · https://www.youtube.com/watch?v=K1ksiPHfgVs · Generated: 2026-10-19
> Companion: 20261013_Give-Me-31-Minutes-I-Will-Make-PyTorch-Click-Forever.html (Thai, iw mode `iwd`, 15 sections, 14 frames + 19 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license).
- Frames used: D01, D02, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, fares-grid.
- Own SVG diagrams: flow, cycle, heatmap, compare, bars, bars, bars, matrix, bars, flow, line, algo, flow, tree, matrix, bars, line, line, bars.
- Transcript SHA-256 (in-page = decoded): `7c78f2cc1b5940fbdbddf70bf9ebc505b2b8620c77ccfbaa244c148dd967044d`; kept in the session workspace only.

## TL;DR

- One running example from start to finish: predict the meter fare of 36 real NYC yellow-taxi rides (Jan 2024; Mon 8, Wed 10, Sat 13; the first ordinary ride in each 2-hour slot) from their miles, with a 2-parameter line `f_hat = w*m + b`.
- Everything is done by hand first (tensors, indexing, MSE, derivatives, gradient descent), then each hand step is swapped for its PyTorch piece, ending at the five-line loop: `pred = model(m)` / `loss = loss_fn(pred, f)` / `loss.backward()` / `opt.step()` / `opt.zero_grad()`.
- Key numbers (all reproduced exactly by the writer from the 36 on-screen data pairs): lazy start w=1, b=0 gives MSE 262.02 (sum of squares 9,432.56); gradient dL/dw = -126.21, dL/db = -27.56; one step at lr 0.01 gives w 2.262, b 0.276; 1,000 steps give w 3.7556, b 5.658, loss 10.15 (the NYC card says $3.50/mile and $3.00 to start).
- Pitfalls taught: the `dim` you pass is the axis that is aggregated away; `backward()` accumulates into `.grad` (second call doubles it to -252.42), so clear every step; in-place updates of recorded leaves must sit in `torch.no_grad()`; `nn.Linear` reads the LAST axis as features, so a (36,) vector must become (36, 1) with `m[:, None]`.
- Menus at the end: optimizers (steps to converge: SGD 551, momentum 100, Nesterov 62, Adagrad 50, RMSprop 158, Adam 88, AdamW 552, NAdam 31), activations (ReLU drops the worst miss of a speed-by-hour fit from 7.1 to 1.62 mph), losses (on misses -0.56 and -13.23: MSE 87.67, L1 6.90, Huber 6.44).
- Two auto-caption number errors are corrected in the report: dL/dw at 15:49 is -126.21 (not "-26.21"); the Monday-10am miss at 30:57 is -13.23 (not "-3.23").

## Key Concepts

1. **Tensor = grid of numbers with a shape.** `fares` is (3, 12): dim 0 = 3 days, dim 1 = 12 two-hour slots, counted from 0. Creation from a shape: `torch.zeros/ones(2, 3)`, `torch.full((2, 3), 7.0)` (shape as ONE tuple, then the value), `torch.eye(3)`, `torch.rand(2, 3)` (uniform 0..1), `torch.randn(2, 3)` (normal around 0), `torch.arange(12)` (0..11, end excluded). The speaker notes that random numbers like these are what a model starts from (initial weights; cf. `nn.Linear` later). The ops board (~3:40) also shows two cells not narrated: `fares * 1.1` ("with a 10% tip") and `fares - fares.mean(dim=1, keepdim=True)` (subtract each day's mean).
2. **Indexing.** An int drops its axis (`fares[0]` -> (12,)); a slice keeps it (`fares[:, :3]` -> (3, 3)); `:` alone = whole axis; a comma separates axes. Boolean mask `fares > 30` is (3, 12); `fares[mask]` returns the True cells as 1-D (5 rides over $30); `torch.where(mask, 30.0, fares)` keeps the shape.
3. **Aggregation rule (stressed as "important").** The dim you pass is aggregated away: `fares.mean(dim=0)` -> 12 slot means; `fares.mean(dim=1)` -> 3 day means [19.6250, 14.3167, 16.2417]. `max(dim)` returns (values, indices); `topk(k, dim)` shrinks the dim to k instead of removing it.
4. **Rearranging keeps numbers.** `.T`, `reshape(3, 4, 3)` (days x quarters x slots), `flatten()` (36 in a row, Mon then Wed then Sat). Cheat card on `x = torch.arange(6.0).reshape(2, 3)`: sum, argmax, `@` (matmul, x @ x.T = [[5, 14], [14, 50]]), `*` (elementwise), view, permute, unsqueeze/squeeze, gather, clamp.
5. **Model = linear regression.** `f_hat = w*m + b`; w = price per mile (slope), b = price to start (intercept). "Weights" = everything a model learns; PyTorch calls them parameters. Broadcasting reuses one w and one b for all 36 rides.
6. **Loss = MSE.** Plain mean of misses cancels (+5 and -5 -> 0); squares do not (25, 25 -> 25). Squaring makes one big miss dominate (one $6 miss -> 36 vs three $2 misses -> 12).
7. **Gradient = one derivative per weight.** Chain rule: d(x^2)/dx = 2x; moving w by 1 moves a prediction by m; moving b by 1 moves it by 1. So dL/dw = 2*mean(miss*m), dL/db = 2*mean(miss).
8. **Gradient descent.** Step AGAINST the gradient, scaled by a small learning rate (0.01); stepping by the whole derivative jumps w past 120. b "crawls" because its derivative is much smaller (each miss x 1 vs each miss x miles); w overshoots early to compensate.
9. **Autograd.** `requires_grad=True` makes PyTorch record every op as a graph node (MulBackward0, AddBackward0, SubBackward0, PowBackward0, MeanBackward0; each result's `grad_fn` remembers its node). `loss.backward()` walks the graph back, each node multiplying in its local derivative, and fills `.grad` - the chain rule done for you.
10. **Accumulation and recording rules.** `backward()` ADDS into `.grad` (PyTorch docs: "accumulates gradients in the leaves - you might need to zero .grad attributes or set them to None"). Updating a recorded leaf in place (`w -= lr * w.grad`) outside `torch.no_grad()` raises an error (the clip shows no message; author note: PyTorch raises `RuntimeError: a leaf Variable that requires grad is being used in an in-place operation.`).
11. **Professional loop.** Optimizer object (`torch.optim.SGD`) holds weights and does `step()` / `zero_grad()`; `nn.Module` subclass holds `nn.Parameter`s (tensors with requires_grad on), finds them all via `parameters()` even in nested layers, and runs `forward` when called; `nn.MSELoss()` is the same MSE.
12. **Batches.** `DataLoader(TensorDataset(...), batch_size=12, shuffle=True)`; one pass over all batches = one epoch; the random batches are the "stochastic" in SGD.
13. **Activations** make stacked linear layers non-linear (two linear layers without one are still a line). **Loss menu:** MSE / L1 / Huber for numbers, cross entropy for categories, binary cross entropy for yes/no.

## Implementation

### Data (read off the screen; every full-batch training number in the clip reproduces from it)

Fares ($, `fare_amount` = meter fare only, no tip/tolls), rows Mon / Wed / Sat, columns 12am, 2am, ..., 10pm:

```
Mon  14.20 38.00 43.60 15.60 19.80 45.70 11.40  7.90 10.70  8.60 10.70  9.30
Wed   5.80  9.30 44.30  8.60 12.10 20.50 13.50 21.90 10.00  8.60  6.50 10.70
Sat  29.60 18.40  6.50 33.80 20.50 11.40 11.40 12.80  5.80  9.30 14.20 21.20
```

Miles (`trip_distance`), same layout:

```
Mon   2.50  9.37 11.21  2.48  3.36  7.14  1.38  0.88  1.71  1.00  1.47  1.26
Wed   0.88  1.59 11.40  1.20  1.60  3.44  1.85  2.02  0.60  1.00  0.63  1.33
Sat   6.74  2.88  0.70  6.60  3.74  2.19  1.89  1.95  0.59  1.19  2.13  4.21
```

Selection rule shown on screen: from `yellow_tripdata_2024-01.parquet`, in each 2-hour slot the first ride with standard rate, paid by card, 0.5-15 miles, 2-60 minutes. The followed example is Monday noon: 1.38 mi, $11.40 (row 0, column 6; index 6 in the flattened vectors).

Derived moments (writer): mean m 2.9475, mean f 16.7278.

### Code exactly as on screen (in clip order)

```python
import torch

days = ["Mon", "Wed", "Sat"]           # Jan 8, 10 and 13, 2024
fares = torch.tensor([                 # a list of rows -> a (3, 12) grid
    [14.2, 38.0, 43.6, 15.6, 19.8, 45.7, 11.4, 7.9, 10.7, 8.6, 10.7, 9.3],
    [5.8, 9.3, 44.3, 8.6, 12.1, 20.5, 13.5, 21.9, 10.0, 8.6, 6.5, 10.7],
    [29.6, 18.4, 6.5, 33.8, 20.5, 11.4, 11.4, 12.8, 5.8, 9.3, 14.2, 21.2],
])
print(fares.shape)                     # the size along each axis   -> torch.Size([3, 12])

# x[rows, cols]: an int picks one and drops that axis; a slice a:b keeps it
print(fares[0])           # Monday's rides: row 0, shape (12,)
print(fares[:, 6])        # the noon ride every day: ':' is the whole axis
print(fares[:, :3])       # midnight to 6 am: slots 0, 1, 2, shape (3, 3)

pricey = fares > 30                          # a bool mask, shape (3, 12)
print(fares[pricey])                         # -> tensor([38.0, 43.6, 45.7, 44.3, 33.8])
print(torch.where(pricey, 30.0, fares))      # where(cond, a, b): a where True

print(fares.mean(dim=0).shape)   # -> torch.Size([12])
print(fares.mean(dim=1))         # -> tensor([19.6250, 14.3167, 16.2417])
priciest = fares.max(dim=1)                # max(dim) -> (values, indices)
print(priciest.values, priciest.indices)   # -> [45.7, 44.3, 33.8] [5, 2, 3]
top3 = fares.topk(3, dim=1)                # topk(k, dim): k largest, sorted
print(top3.indices)                        # -> [[5, 2, 1], [2, 7, 5], [3, 0, 11]]

print(fares.T.shape)                       # -> torch.Size([12, 3])
print(fares.reshape(3, 4, 3).mean(dim=2))  # -> [[31.9333, 27.0333, 10.0, 9.5333],
                                           #     [19.8, 13.7333, 15.1333, 8.6],
                                           #     [18.1667, 21.9, 10.0, 14.9]]
print(fares.flatten().shape)               # all in one row (36)

pairs = torch.stack([m, f], dim=1)   # stack(tensors, dim): a NEW axis
print(pairs.shape, pairs[18])        # -> torch.Size([36, 2]) tensor([1.85, 13.50])
print(torch.cat([m, f]).shape)       # cat(tensors, dim=0): end to end (72)

w = torch.tensor(1.0)
b = torch.tensor(0.0)
pred = w * m + b                    # all 36 predictions at once
print(pred.shape, pred[:3])         # -> torch.Size([36]) tensor([2.50, 9.37, 11.21])

err = pred - f                                   # the 36 misses
print(f"{err[6] ** 2:.2f} {(err ** 2).sum():.2f} {(err ** 2).mean():.2f}")   # -> 100.40 9432.56 262.02
loss = ((pred - f) ** 2).mean()                  # square, then average

print(f"{2 * err[6] * m[6]:.2f} {2 * err[6]:.2f}")   # one ride's terms -> -27.66 -20.04
dw = 2 * (err * m).mean()                            # -> -126.21
db = 2 * err.mean()                                  # -> -27.56
```

One gradient-descent step (screen "One step, every variable"):

```python
pred = w * m + b
err = pred - f
loss = (err ** 2).mean()          # 262.02
dw = 2 * (err * m).mean()         # -126.21  (mean err*m = -63.106)
db = 2 * err.mean()               # -27.56   (mean err = -13.780)
w, b = w - lr * dw, b - lr * db   # 2.262, 0.276
```

Hand loop (100 steps; prints `1 2.262 0.276`, `10 4.523 1.099`, `100 4.106 3.712`):

```python
w, b = torch.tensor(1.0), torch.tensor(0.0)
for step in range(1, 101):
    err = w * m + b - f
    dw = 2 * (err * m).mean()
    db = 2 * err.mean()
    w, b = w - lr * dw, b - lr * db    # step against the gradient
    if step in (1, 10, 100):
        print(step, f"{w:.3f}", f"{b:.3f}")
```

1,000 steps (prints `3.76 5.66`; loss 262.02 -> 10.15):

```python
w, b = torch.tensor(1.0), torch.tensor(0.0)
for step in range(1000):                 # our loop, run longer
    err = w * m + b - f
    w, b = w - lr * 2 * (err * m).mean(), b - lr * 2 * err.mean()
print(f"{w:.2f} {b:.2f}")
```

Autograd (prints `AddBackward0 MeanBackward0`, then w.grad -126.21, b.grad -27.56; a second backward gives -252.42):

```python
w = torch.tensor(1.0, requires_grad=True)
b = torch.tensor(0.0, requires_grad=True)
pred = w * m + b
loss = ((pred - f) ** 2).mean()
print(pred.grad_fn.name(), loss.grad_fn.name())
loss.backward()
print(f"{w.grad:.2f} {b.grad:.2f}")

w = torch.tensor(1.0, requires_grad=True)
b = torch.tensor(0.0, requires_grad=True)
for step in range(1, 1001):
    loss = ((w * m + b - f) ** 2).mean()
    loss.backward()                         # fills w.grad and b.grad
    with torch.no_grad():                   # don't record the update
        w -= lr * w.grad
        b -= lr * b.grad
    w.grad, b.grad = None, None             # clear for the next step
    if step in (1, 10, 100, 1000):
        print(step, f"{w:.3f}", f"{b:.3f}")
```

Optimizer, module, loss:

```python
opt = torch.optim.SGD([w, b], lr=lr)
# in the loop: loss.backward(); opt.step()  # w -= lr * w.grad, for every weight
#              opt.zero_grad()              # .grad = None, for every weight

from torch import nn

class FareModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.w = nn.Parameter(torch.tensor(1.0))   # price per mile
        self.b = nn.Parameter(torch.tensor(0.0))   # price to start

    def forward(self, m):
        return self.w * m + self.b

model = FareModel()
print([name for name, p in model.named_parameters()])   # -> ['w', 'b']

pred = 1.0 * m + 0.0                     # the lazy guess again
loss_fn = nn.MSELoss()                   # a loss function: call it on (pred, target)
print(f"{loss_fn(pred, f):.2f}")         # -> 262.02

# set up once: opt = torch.optim.SGD(model.parameters(), lr=0.01); loss_fn = nn.MSELoss()
for step in range(1000):
    pred = model(m)
    loss = loss_fn(pred, f)
    loss.backward()
    opt.step()
    opt.zero_grad()
```

Use, save, nn.Linear, DataLoader:

```python
with torch.no_grad():
    print(model(torch.tensor([1.0, 5.0, 10.0])))   # -> tensor([9.4136, 24.4359, 43.2138])

torch.save(model.state_dict(), "fare_model.pt")
copy = FareModel()
copy.load_state_dict(torch.load("fare_model.pt"))
print(copy.state_dict())                           # w 3.7556, b 5.6580

lin = nn.Linear(1, 1)
lin(m)            # -> fails: a (36,) tensor is read as ONE sample with 36 features

torch.manual_seed(0)
lin = nn.Linear(1, 1)                            # pred = x @ W.T + b
opt = torch.optim.SGD(lin.parameters(), lr=0.01)
for step in range(1000):
    pred = lin(m[:, None])                       # -> (36, 1); screen note: same as m.unsqueeze(1)
    loss = loss_fn(pred, f[:, None])
    loss.backward()
    opt.step()
    opt.zero_grad()
print(f"{lin.weight.item():.4f} {lin.bias.item():.3f}")   # initial weight -0.0075, step-0 loss 388.59; ends at 3.76 / 5.66

from torch.utils.data import TensorDataset, DataLoader

torch.manual_seed(0)
loader = DataLoader(TensorDataset(m[:, None], f[:, None]),
                    batch_size=12, shuffle=True)
lin = nn.Linear(1, 1)
opt = torch.optim.SGD(lin.parameters(), lr=0.01)
for epoch in range(300):
    for x, y in loader:
        pred = lin(x)
        loss = loss_fn(pred, y)
        loss.backward()
        opt.step()
        opt.zero_grad()
print(f"{lin.weight.item():.4f} {lin.bias.item():.3f}")   # -> 3.7494 5.691 (300 epochs x 3 batches = 900 steps)
```

Note: comments starting with `# ->`, `# in the loop:` or `# set up once:` are the writer's (outputs and context read from the screen); all other lines and comments are as on screen. In the report the screen code blocks are reproduced without the writer's output comments.

### Hyper-parameters and results

| item | value |
|---|---|
| lr (hand loop, SGD) | 0.01 |
| steps | 1,000 (hand / autograd / five lines / nn.Linear); 300 epochs x 3 batches = 900 (DataLoader) |
| start | w = 1, b = 0 (FareModel); nn.Linear: random, seed 0 (weight -0.0075; bias not shown on screen - author back-solve from the step-0 loss 388.59 gives about 0.54) |
| final (full batch) | w 3.7556, b 5.658, loss 10.15 (least-squares optimum 3.7555 / 5.6584 / 10.1531) |
| final (mini-batch) | 3.7494 / 5.691 |
| optimizer settings on screen | SGD(lr=0.01); SGD(lr=0.01, momentum=0.9); SGD(lr=0.01, momentum=0.9, nesterov=True); Adagrad(lr=3.0); RMSprop(lr=0.1); Adam(lr=0.5); AdamW(lr=0.5, weight_decay=0.01); NAdam(lr=1.0) |
| "steps to the star" criterion | first step with abs(w - 3.7555) < 0.005 and abs(b - 5.6584) < 0.05 |
| steps | SGD 551, momentum 100, Nesterov 62, Adagrad 50, RMSprop 158, Adam 88, AdamW 552, NAdam 31 (writer re-simulated all eight with PyTorch update rules: exact match) |
| activation demo | time of day -> 3 days' speeds; nn.Linear(1, 3) / nn.Linear(1, 16) -> nn.Linear(16, 3) (still straight) / nn.Linear(1, 16) -> nn.ReLU() -> nn.Linear(16, 3); worst miss 7.1 mph straight, 1.62 with ReLU (not reproducible: speed data not shown) |
| activation values at x = -2..2 | ReLU 0,0,0,1,2; GELU -0.05,-0.16,0,0.84,1.95; Sigmoid 0.12,0.27,0.5,0.73,0.88; Tanh -0.96,-0.76,0,0.76,0.96; Softmax(dim=-1) 0.01,0.03,0.09,0.23,0.64 |
| loss demo | pred [10.84, 32.47], target [11.40, 45.70]: MSELoss 87.6732, L1Loss 6.8950, HuberLoss 6.4434 (delta 1.0); CrossEntropyLoss on scores [2, 1, 0.1], class 0 (Mon): p 0.659 -> 0.4170; BCEWithLogitsLoss score 0.8, target 1 ("over $30?"): 0.69 -> 0.3711 |

### Pitfalls the clip states

- Passing `dim=0` to get per-day means returns 12 numbers (per slot), not 3.
- Calling `backward()` twice without clearing doubles `.grad` (w.grad -126.21 -> -252.42; b.grad -27.56 -> -55.12 on screen). Deleting `opt.zero_grad()` makes gradients pile up: w goes past 8 within five steps (writer simulation, lr 0.01, steps 1-6: accumulated w.grad -126.21, -208.27, -217.36, -150.06, -29.48, 102.72; w 2.262, 4.345, 6.518, 8.019, 8.314, 7.287; b 0.276, 0.747, 1.282, 1.741, 2.028, 2.118).
- In-place update of a recorded leaf outside `torch.no_grad()` raises an error.
- Stepping by the whole derivative (lr = 1) jumps w past 120 (1 + 126.21).
- `nn.Linear(1, 1)(m)` with m of shape (36,) fails; use `m[:, None]`.
- Plain SGD with one lr for two very differently scaled gradients: w overshoots, b crawls (b only 3.71 after 100 steps).

## Quick Reference

| item | value |
|---|---|
| dataset | 36 NYC yellow-taxi rides, Jan 8 / 10 / 13 2024, 12 two-hour slots per day |
| example ride | Monday noon, 1.38 mi, $11.40 |
| fares shape | (3, 12) |
| day means | 19.63 / 14.32 / 16.24 |
| daily max (slot) | 45.70 (10am) / 44.30 (4am) / 33.80 (6am) |
| rides over $30 | 5 |
| Monday quarter means | 31.93 / 27.03 / 10.00 / 9.53 |
| NYC rate card | $3.00 + $0.70 per 1/5 mile (above 12 mph) or per 60 s (slow/stopped) = $3.50 per mile |
| lazy start | w = 1, b = 0; Monday noon guess 1.38, miss -10.02, squared 100.40 |
| MSE at start | 9,432.56 / 36 = 262.02 |
| gradient at start | dL/dw = -126.21 (= -4,543.60 / 36), dL/db = -27.56 |
| step 1 (lr 0.01) | w 2.262, b 0.276 |
| step 10 / 100 | 4.523, 1.099 / 4.106, 3.712 |
| step 1,000 | w 3.76, b 5.66, loss 10.15 |
| predictions | 1 / 5 / 10 miles -> 9.41 / 24.44 / 43.21 |
| nn.Linear Monday noon | 1.38 x 3.7556 + 5.658 = 10.84 |
| TwoLayers | nn.Linear(1, 4) + nn.Linear(4, 1) = 13 parameters |

## Comparisons

| by hand | five lines | PyTorch does it |
|---|---|---|
| `w, b = torch.tensor(1.0), torch.tensor(0.0)` | `model = FareModel()` | w = 1, b = 0 |
| `for step in range(steps):` | `for step in range(1000):` | 1,000 steps |
| `pred = w * m + b` | `pred = model(m)` | runs forward |
| `err = pred - f` | `loss = loss_fn(pred, f)` | nn.MSELoss() |
| `dw = 2 * (err * m).mean()`; `db = 2 * err.mean()` | `loss.backward()` | autograd |
| `w, b = w - lr * dw, b - lr * db` | `opt.step()` | SGD, lr = 0.01 |
| `# nothing: dw, db are new each step` | `opt.zero_grad()` | every .grad -> None |

Loss choice (clip's criteria): MSE for numbers when big misses should count extra; L1 when they should not; Huber mixes the two; cross entropy to pick a category; binary cross entropy for yes/no. Optimizer choice: momentum keeps speed from recent steps so small pushes add up; Adam gives each weight its own step size so a small-gradient weight still gets a full-size step. Switching either is one line.

## Fact Check

20 claims checked: 18 confirmed, 2 partly, 0 not found, 0 contradicted.

- Partly (auto-caption errors, not speaker errors): "dL/dw = -26.21" at 15:49 must be -126.21 (screen shows -4,543.60 / 36 = -126.21; the next step 1 - 0.01 x (-126.21) = 2.262 only works with it; w.grad later reads -126.21 and doubles to -252.42). "Monday's 10:00 ride by -3.23" at 30:57 must be -13.23 (screen: 13.23^2 = 175.03, pred 32.47 vs 45.70).
- Every full-batch training number (claims 1-8, 10-11, 15, 17, 20) was re-computed by the writer in Python from the 36 on-screen (miles, fare) pairs and matches to the printed precision, including the eight optimizer step counts (claim 17; the separate fact-check pass had marked it "not found" because the convergence criterion was not in the transcript; it is printed on screen). Claim 16 (DataLoader, 3.7494 / 5.691) was compared with the screen only: it depends on the shuffle order (only 36 / 12 x 300 = 900 steps is re-computed). The ReLU demo (7.1 -> 1.62 mph) and the cross-entropy / BCE scores ([2, 1, 0.1], 0.8) are not from the 36 pairs; CE 0.417 and BCE 0.3711 were re-computed from the on-screen scores (natural log).
- NYC TLC standard metered fare ($3.00 initial + $0.70 per 1/5 mile above 12 mph or per 60 s slow/stopped) is in force since 19 Dec 2022 and still current (nyc.gov TLC fare page).
- PyTorch docs confirm: `Tensor.backward` accumulates gradients in the leaves; `torch.max(input, dim)` returns (values, indices) and removes the dim; `nn.Linear` expects (*, in_features); `nn.HuberLoss` default delta = 1.0; `optimizer.zero_grad()` defaults to `set_to_none=True` since 2.0.
- Not checkable: the activation demo's 7.1 -> 1.62 mph (speed data not shown); the "tools card" content beyond its first line (`named_parameters`).

## Open Questions & Extension Ideas

- Author note (not in clip): the rate card covers only the time-and-distance meter. Riders also pay MTA State Surcharge $0.50, Improvement Surcharge $1.00, overnight $1.00 (8 pm-6 am), weekday rush $2.50 (4-8 pm), NYS Congestion Surcharge $2.50 (Manhattan south of 96th St), since 5 Jan 2025 a $0.75 congestion-pricing charge, plus tolls and tips. The dataset's `fare_amount` excludes all of these, so the comparison with the card is fair. The fitted intercept ($5.66 vs $3.00) and slope ($3.76 vs $3.50) are higher, and part of the reason (the clip's words, 18:21) is that below 12 mph the meter charges per minute.
- Author note: why b crawls, in numbers. The MSE Hessian 2*[[E m^2, E m], [E m, 1]] (E = mean over the 36 rides; E m = 2.9475, E m^2 = 16.849) has eigenvalues about 34.8 and 0.94 (condition number about 37). Plain GD is stable only for lr < 2/34.8 = 0.057; at lr 0.01 the flat direction (mostly b) contracts by about 1% per step. A good one-paragraph lesson on "lr too big vs too slow" and why momentum/Adam help, with these exact numbers.
- Author note: the clip's "13 parameters" two-layer model is shown on screen as `net = TwoLayers()` with `first = nn.Linear(1, 4)` (4 weights + 4 biases) and `second = nn.Linear(4, 1)` (4 + 1).
- ZVect link (author note) - Chapter 1 (vectors / matrices): `fares` as a 3 x 12 matrix is a ready "first matrix" with real numbers; the dim rule (aggregate away the axis you pass), `.T`, `reshape`, `flatten`, `stack` vs `cat`, and the cheat card (`x @ x.T = [[5, 14], [14, 50]]`, elementwise `x * x`) map onto chapter 1's vector/matrix operations; the dot product inside `x @ x.T` (0*0 + 1*1 + 2*2 = 5) is the same operation chapter 2 uses for similarity. A zero-dependency JS lesson can reuse the exact 3 x 12 grid and the mask / mean(dim) / topk examples.
- ZVect link (author note) - training appendix / LLM manual WIP202610050 (loss, gradient descent): the whole hand-computed sequence is reproducible in plain JS with the 36 pairs above: MSE 262.02 -> gradient (-126.21, -27.56) -> one step (2.262, 0.276) -> 100 steps (4.106, 3.712) -> 1,000 steps (3.7556, 5.658, loss 10.15). Suggested interactive: a loss-map canvas (w across 0-6, b up -2 to 10, star at 3.7555 / 5.6584) with an lr slider and step button, showing w overshoot and b crawl; plus an optimizer race reproducing the eight step counts with the on-screen lrs and criterion.
- ZVect link (author note) - chapter 8-10 (LLM input, attention, Transformer): the clip's loss menu gives the bridge to next-token training: cross entropy on scores [2, 1, 0.1] (softmax 0.659 / 0.242 / 0.099, loss -log 0.659 = 0.417) is exactly the per-token LLM loss; `nn.Linear` as `x @ W.T + b` is the projection used for Q/K/V and the output head; `backward` / `zero_grad` / `no_grad` are the same in LLM training and inference.
- Open: the clip's "tools card" (list weights by name, count them, save them) was only partly visible; the count line is presumably `sum(p.numel() for p in net.parameters())` but this is not verified.
- Open: momentum/Adam counts depend on the tuned lrs and on the convergence criterion; with a different criterion the ranking changes (author inference, not stated in the clip: AdamW's weight decay likely pulls its resting point slightly away from (3.7555, 5.6584), which would explain its 552 steps; the screen says only "Adam plus a small pull toward zero").

## Tags & Triggers

Tags: PyTorch, tensor, shape, dim, indexing, boolean mask, broadcasting, linear regression, MSE, gradient, chain rule, gradient descent, learning rate, autograd, backward, grad accumulation, zero_grad, no_grad, torch.optim, SGD, momentum, Adam, nn.Module, nn.Parameter, nn.Linear, nn.MSELoss, state_dict, DataLoader, epoch, activation, ReLU, Huber, cross entropy, NYC taxi.

Triggers:
- "What does each line of the PyTorch training loop do?"
- "Why do I need optimizer.zero_grad()?"
- "dim=0 vs dim=1 in mean / max"
- "Gradient descent by hand on real data"
- "Why does nn.Linear fail on a 1-D tensor?"
- "Which optimizer fixes a slowly moving bias?"
- "A worked example dataset for a linear-regression lesson"

## References

- Zachary Huang, "Give me 31 minutes, I will make PyTorch click forever", YouTube, 31:55, published 2026-10-13: https://www.youtube.com/watch?v=K1ksiPHfgVs
- NYC TLC, Taxi Fare: https://www.nyc.gov/site/tlc/passengers/taxi-fare.page
- NYC TLC, Industry Notice 22-02: https://www.nyc.gov/assets/tlc/downloads/pdf/industry-notices/industry_notice_22_02_english.pdf
- NYC TLC, Industry Notice 24-10: https://nyc.gov/assets/tlc/downloads/pdf/industry-notices/industry_notice_24_10_english.pdf
- NYC TLC, Yellow Taxi Trip Records data dictionary: https://www.nyc.gov/assets/tlc/downloads/pdf/data_dictionary_trip_records_yellow.pdf
- PyTorch docs: Tensor.backward https://docs.pytorch.org/docs/main/generated/torch.Tensor.backward.html ; Optimizer.zero_grad https://docs.pytorch.org/docs/2.14/generated/torch.optim.Optimizer.zero_grad.html ; torch.max https://docs.pytorch.org/docs/2.7/generated/torch.max.html ; torch.where https://docs.pytorch.org/docs/2.3/generated/torch.where.html ; nn.Linear https://docs.pytorch.org/docs/2.3/generated/torch.nn.Linear.html ; nn.HuberLoss https://docs.pytorch.org/docs/2.1/generated/torch.nn.HuberLoss.html

## Equations (LaTeX)
1. $$ \text{guess} = w \times m + b $$
2. $$ L=\frac{1}{36}\sum_{i=1}^{36}(\hat{F}_i-F_i)^2 $$
3. $$ \frac{\partial L}{\partial w}=\frac{2}{36}\sum_{i=1}^{36}(\hat{F}_i-F_i)\,m_i $$
4. $$ \frac{\partial L}{\partial b}=\frac{2}{36}\sum_{i=1}^{36}(\hat{F}_i-F_i) $$
5. $$ w = 1-0.01\times(-126.21)=2.262 \\ b = 0-0.01\times(-27.56)=0.276 $$
