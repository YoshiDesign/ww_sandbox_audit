import json


def main():

    fp = open("./output/typeahead_occupations.json", "r")
    data = json.loads(fp.read())
    fp.close()

    word_index = {}

    for _id in data:

        for word in data[_id]['words']:
            if len(word) > 1:

                try: 
                    check = word_index[word]

                except KeyError:
                    word_index[word] = []

                new_obj = {}
                new_obj['occupation_id'] = _id
                new_obj['title'] = data[_id]['title']

                word_index[word].append(new_obj)

    fw = open("./output/occ_word_index.json", "w")
    fw.write(json.dumps(word_index, indent = 4))
    fw.close()


if __name__ == "__main__":
    main()
