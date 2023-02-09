import json

# 2 of 2
# Build the data structure (Trie)

def main():

    fp = open('../_data/locations.json', 'r')
    data = json.loads(fp.read())
    fp.close()

    word_index = {}

    for location in data:

        for word in location['name'].split('_'):
             
            try: 
                check = word_index[word]

            except KeyError:
                word_index[word] = []

            new_obj = {}
            new_obj['fips'] = location["_id"]
            new_obj['name'] = location["name"]
            new_obj['state'] = location["state_id"]

            word_index[word].append(new_obj)

    fw = open('./output/loc_word_index.json', 'w')
    fw.write(json.dumps(word_index, indent=4))
    fw.close()


if __name__ == "__main__":
    main()