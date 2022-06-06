# -*- coding: utf-8 -*-
"""
Created on Fri May 13 15:22:37 2022

@author: dnelson
"""

import networkx as nx
import csv
from networkx.algorithms import community
import json

node_path = 'wis-node-list-test.csv'
edge_path = 'wis-edge-list-ids.csv'

with open(node_path, 'r') as nodecsv:
    nodereader = csv.reader(nodecsv)  # read the csv
    # get data as list of lists
    nodes = [n for n in nodereader][1:]

node_ids = [n[1] for n in nodes]  # just get IDs

with open(edge_path, 'r') as edgecsv:
    edgereader = csv.reader(edgecsv)
    edge_list = [e for e in edgereader][1:]

edges = []  # construct list of tuples from the IDs
for edge in edge_list:
    id_a = edge[1]
    id_b = edge[3]
    relation = {'relation': edge[4]}
    id_tuple = (id_a, id_b, relation)
    edges.append(id_tuple)

# configure graph
G = nx.Graph()
G.add_nodes_from(node_ids)
G.add_edges_from(edges)

name_dict = {}
bio_dict = {}
for node in nodes:
    name_dict[node[1]] = node[0]
    bio_dict[node[1]] = node[2]

nx.set_node_attributes(G, name_dict, 'name')
nx.set_node_attributes(G, bio_dict, 'bio')

# get basic graph metrics

degree_dict = dict(G.degree(G.nodes()))
nx.set_node_attributes(G, degree_dict, 'degree')

communities = community.greedy_modularity_communities(G)

modularity_dict = {}
for i, c in enumerate(communities):
    for name in c:
        modularity_dict[name] = i

nx.set_node_attributes(G, modularity_dict, 'modularity')

# export to JSON
wis = nx.json_graph.node_link_data(G)
with open('wis.json', 'w') as f:
    json.dump(wis, f, ensure_ascii=False, indent=4)
