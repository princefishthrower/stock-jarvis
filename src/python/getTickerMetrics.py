#!/usr/bin/python

import os
import sys
import json
from FinvizTicker import FinvizTicker

dirpath = os.getcwd()

stockData = FinvizTicker(sys.argv[2])
with open(dirpath + '/data/' + sys.argv[1] + '/' + sys.argv[2] + '.json', 'w') as f:
    json.dump(stockData.metrics, f)

# This print is important to proper handling of finish process in node
print('Done')
