# -*- coding: utf-8 -*-
"""
Created on Fri May 13 11:45:35 2022

@author: dnelson
"""

import csv
import pandas as pd

node_path = 'U:\\women-in-science\data\wis-bio-list-2022-06-01.csv'
edge_path = 'U:\\women-in-science\data\edge-list-brown-bag.csv'

with open(node_path, 'r') as f:
    node_reader = csv.reader(f)
    nodes = [n for n in node_reader][1:]
    node_ids = {}
    for node in nodes:
        node_ids[node[0]] = node[1]

edges = pd.read_csv(edge_path)
edges['id A'] = edges['person A'].map(node_ids)
edges['id B'] = edges['person B'].map(node_ids)

edges.to_csv('wis-edge-list-ids.csv', index=False)
