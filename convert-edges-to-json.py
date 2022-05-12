# -*- coding: utf-8 -*-
"""
Created on Tue May 10 14:12:37 2022

@author: dnelson
"""

# 0. create master list of all names
# 1. generate unique IDs from names
# 2. generate children lists for each person
# find some way to associate relationship lol
# magic goes here
# steps: take each item in each key from dict
# as
# profit! Write to JSON

import csv
import json

with open('wis-edge-list.csv', 'r') as f:
    women_csv = csv.DictReader(f)
    all_names = []
    parents = []
    for row in women_csv:
        all_names.append(row['correspondent_a'])
        all_names.append(row['correspondent_b'])
        if row['correspondent_a'] not in parents:
            parents.append(row['correspondent_a'])

    # generate unique ids
    uniques = set(all_names)
    ids = {}
    for i in uniques:
        if i not in ids:
            name_list = i.split(' ')
            name_id = name_list[-1]
            if name_id in ids.values():
                print(i)
                name_id = input('Select an id: ')
            ids.update({i: name_id})

    # generate dictionary of relationships

with open('wis-edge-list.csv', 'r') as f:
    women_csv = csv.DictReader(f)
    children = {}
    for row in women_csv:
        corresp_a = row['correspondent_a']
        parent_id = ids[corresp_a]
        child_id = ids[row['correspondent_b']]
        child = {'id': child_id,
                 'name': row['correspondent_b'],
                 'relation': row['relation']}
        if parent_id in children:
            children[parent_id]['children'].append(child)
        else:
            children.update({parent_id:
                             {'id': parent_id,
                              'name': corresp_a,
                              'children': [child]
                              }})

wis = {'id': 'APS',
       'name': 'Women in Science Collections at the APS',
       'children': []
       }

for i in children.values():
    wis['children'].append(i)

with open('wis.json', 'w') as f:
    json.dump(wis, f, ensure_ascii=False, indent=4)
