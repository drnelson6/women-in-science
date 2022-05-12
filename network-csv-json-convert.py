# -*- coding: utf-8 -*-
"""
Created on Tue May 10 16:40:36 2022

@author: dnelson
"""

import csv
import networkx as nx
import json

# add edges as tuple of relations, plus dictionary of attribute
# e.g. (Miller, Nelson, {'relation': 'Supervisor'})

with open('wis-edge-list.csv', 'r') as f:
    edge_reader = csv.DictReader(f)
    all_names = []
    edges = []
    for row in edge_reader:
        all_names.append(row['correspondent_a'])
        all_names.append(row['correspondent_b'])
        edge = (row['correspondent_a'], row['correspondent_b'],
                {'relation': row['relation']})
        edges.append(edge)

    uniques = set(all_names)
    ids = {}
    for i in uniques:
        for i in uniques:
            if i not in ids:
                name_list = i.split(' ')
                name_id = name_list[-1]
                if name_id in ids.values():
                    print(i)
                    name_id = input('Select an id: ')
                ids.update({i: name_id})

G = nx.Graph()
G.add_edges_from(edges)
G.add_node('Women in Science Collections at the APS')
G.add_nodes_from(ids)
G.add_edges_from([('Women in Science Collections at the APS',
                   'Barbara McClintock'),
                  ('Women in Science Collections at the APS',
                   'Florence Rena Sabin'),
                  ('Women in Science Collections at the APS',
                   'Florence Barbara Seibert')])
wis = nx.json_graph.node_link_data(G)
with open('wis.json', 'w') as f:
    json.dump(wis, f, ensure_ascii=False, indent=4)
