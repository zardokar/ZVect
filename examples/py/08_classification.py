# 08 Classification: average each class into a centroid,
# then a new point gets the label of the most similar centroid
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import mean, classify, fmt

train = {
    "food": [[0.9, 0.1, 0.0], [0.8, 0.0, 0.1], [1.0, 0.2, 0.0]],
    "animal": [[0.1, 0.9, 0.0], [0.0, 1.0, 0.1], [0.2, 0.8, 0.1]],
    "tech": [[0.0, 0.1, 0.9], [0.1, 0.0, 1.0], [0.0, 0.2, 0.8]],
}

centroids = {label: mean(pts) for label, pts in train.items()}
for label, c in centroids.items():
    print(label + " centroid " + fmt(c))

for x in ([0.7, 0.2, 0.1], [0.1, 0.3, 0.9], [0.4, 0.5, 0.0]):
    label, score = classify(x, centroids)
    print(fmt(x) + " -> " + label + " " + fmt(score))
