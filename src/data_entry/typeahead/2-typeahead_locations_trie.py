import json

# 2 of 2
# Build the data structure (Trie)

def main():

    fp = open('./output/loc_word_index.json', 'r')
    word_index = json.loads(fp.read())
    fp.close()

    main_datas = { "n": {} }
    layer = None

    for word in word_index:
         # Top layer, node with all letters
        layer = main_datas
        # The query result
        cur_values = word_index[word]

        for letter in word.lower():
            try:
                layer = layer["n"][letter]
            except KeyError:
                layer["n"][letter] = {
                    "v": 0,
                    "im" : 0,
                    "n" : {},
                    "wt" : 1,
                    "x" : None
                }

                layer = layer['n'][letter]

        layer['im'] = 1
        layer['x'] = cur_values

    fw = open('./output/loc_typeahead_dataStruct.json', 'w')
    fw.write(json.dumps(main_datas, indent=4))
    fw.close()


if __name__ == "__main__":
    main()