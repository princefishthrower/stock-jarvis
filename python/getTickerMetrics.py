#!/usr/bin/python

import os
import sys
import json
from FinvizTicker import FinvizTicker

dirpath = os.getcwd()

stockData = FinvizTicker(sys.argv[1])
with open(dirpath + '/data/metrics.json', 'w') as f:
    json.dump(stockData.metrics, f)
print('Done');
