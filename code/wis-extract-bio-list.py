# -*- coding: utf-8 -*-
"""
Created on Wed Jun  1 14:38:29 2022

@author: dnelson
"""

import csv
import random

path = 'wis-edge-list-2022-06-01.csv'

with open(path, 'r') as f:
    reader = csv.reader(f)
    data = [row for row in reader][1:]
    women_a = [row[0] for row in data]
    women_b = [row[2] for row in data]

all_women = women_a + women_b
uniques = set(all_women)
id_num = random.sample(range(1, 9999), len(uniques))

with open('wis-bio-list-2022-06-01.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['person', 'id'])
    n = 0
    for i in uniques:
        line = []
        line.append(i)
        name_list = i.split()
        person_id = name_list[-1][0] + str(id_num[n]).zfill(4)
        line.append(person_id)
        writer.writerow(line)
        n = n + 1
