# -*- coding: utf-8 -*-
"""
Created on Fri May  6 14:11:15 2022

@author: dnelson
"""

import re
import pandas as pd

# /^[a-z ,.'-]+$/i
# r'^[a-zA-Z ]+$'

# .group() method returns string matched by regex

# characteristics to match:
# titles like Dr., Miss, Mrs., etc.
# abbreviated first initials and middle initials
# suffixes like Jr. (preceded by comma)
# need to distinguish from institution names
# may have leading extraneous information (writes to, reccomends, etc)
# may be truncated by a comma or dash, or by nothing

# max length of name: 4 words
# what to do about stuff like: 'Laura Florence PhD Cornell'

# construct multiple regexes to match different parts of name
# title, initials, full names, suffixes, etc
# limit search to first x number of words

# is it easier to extract the names into a list, take all before a comma or
# dash unless comma or dash conforms to rules of name (suffix or hyphenated)
# and then extract the ones that look like names?
# that may not even require regex - just check for capitalization

# relevant columns:
# 'Correspondents of Note: '
# 'Writes a letter of recommendation for: '
# 'Women who appear in the letters: '


def name_guesser(name_list):
    name_guess = []
    if len(name_list) > 6:
        name_list = name_list[0:6]
    for i in name_list:
        if i == '-':
            break
        elif i.endswith(','):
            name_guess.append(i.strip(','))
            break
        elif i[0].isupper() is True:
            name_guess.append(i)
    guessed_name = (' ').join(name_guess)
    return guessed_name


df = pd.read_csv('wis-main-table.csv')
df = df.fillna('')
cols = {'correspondent_a': [''], 'correspondent_b': [''], 'relation': ['']}
edges = pd.DataFrame(cols)
for row in df.index:
    name = df.loc[row, 'Name']
    corresp = df.loc[row, 'Correspondents of Note: ']
    name_list = corresp.split(' ')
    if len(name_list) > 1:
        guess = name_guesser(name_list)
        edge = {'correspondent_a': name,
                'correspondent_b': guess,
                'relation': 'Correspondence'}
        edges = edges.append(edge, ignore_index=True)
    lor = df.loc[row, 'Writes a letter of recommendation for: ']
    name_list = lor.split(' ')
    if len(name_list) > 1:
        guess = name_guesser(name_list)
        edge = {'correspondent_a': name,
                'correspondent_b': guess,
                'relation': 'Letter of Reccomendation'}
        edges = edges.append(edge, ignore_index=True)
    woman = df.loc[row, 'Women who appear in the letters: ']
    name_list = woman.split(' ')
    if len(name_list) > 1:
        guess = name_guesser(name_list)
        edge = {'correspondent_a': name,
                'correspondent_b': guess,
                'relation': 'Women appearing in letters'}
        edges = edges.append(edge, ignore_index=True)

edges.to_csv('wis-edge-list.csv', index=False)


# TITLE = r"(?:[A-Z][a-z]*\.\s*)?"
# NAME1 = r"[A-Z][a-z]+,?\s+"
# MIDDLE_I = r"(?:[A-Z][a-z]*\.?\s*)?"
# NAME2 = r"[A-Z][a-z]+"
