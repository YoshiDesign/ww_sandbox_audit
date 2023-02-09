import json
import random

# This does more than we need it to do. All we really need is the word_index from the next program
# Build the intermediate

def main():

    fp = open('../occupations2022_no_duplicates.json', 'r')
    data = json.loads(fp.read())
    fp.close()

    end = {}

    # V2
    for item in data:

        words = item['name'].split(' ')
        
        letters = []
        for word in words:
            letters.append([letter for letter in word])

        end[item['_id']] = {
            "letters" : letters,
            "words" : words,
            "title" : item['name']
        }

    fw = open('./output/typeahead_occupations.json', "w")
    fw.write(json.dumps(end))
    fw.close()

    print("Data Length: " + str(len(data)))
    print("New Length: " + str(len(end)))

if __name__ == "__main__":
    main()
