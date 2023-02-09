import json
import random

# 1 of 2
# Build the intermediate

def main():

    states = {
        "alabama" : ["01","AL", "alabama"],
        "alaska" : ["02","AK", "alaska"],
        "arizona" : ["04","AZ", "arizona"],
        "arkansas" : ["05","AR", "arkansas"],
        "california" : ["06","CA", "california"],
        "colorado" : ["08","CO", "colorado"],
        "connecticut" : ["09","CT", "connecticut"],
        "delaware" : ["10","DE", "delaware"],
        "district_of_columbia" : ["11","DC", "district_of_columbia"],
        "florida" : ["12","FL", "florida"],
        "georgia" : ["13","GA", "georgia"],
        "hawaii" : ["15","HI", "hawaii"],
        "idaho" : ["16","ID", "idaho"],
        "illinois" : ["17","IL", "illinois"],
        "indiana" : ["18","IN", "indiana"],
        "iowa" : ["19","IA", "iowa"],
        "kansas" : ["20","KS", "kansas"],
        "kentucky" : ["21","KY", "kentucky"],
        "louisiana" : ["22","LA", "louisiana"],
        "maine" : ["23","ME", "maine"],
        "maryland" : ["24","MD", "maryland"],
        "massachusetts" : ["25","MA", "massachusetts"],
        "michigan" : ["26","MI", "michigan"],
        "minnesota" : ["27","MN", "minnesota"],
        "mississippi" : ["28","MS", "mississippi"],
        "missouri" : ["29","MO", "missouri"],
        "montana" : ["30","MT", "montana"],
        "nebraska" : ["31","NE", "nebraska"],
        "nevada" : ["32","NV", "nevada"],
        "new_hampshire" : ["33","NH", "new_hampshire"],
        "new_jersey" : ["34","NJ", "new_jersey"],
        "new_mexico" : ["35","NM", "new_mexico"],
        "new_york" : ["36","NY", "new_york"],
        "north_carolina" : ["37","NC", "north_carolina"],
        "north_dakota" : ["38","ND", "north_dakota"],
        "ohio" : ["39","OH", "ohio"],
        "oklahoma" : ["40","OK", "oklahoma"],
        "oregon" : ["41","OR", "oregon"],
        "pennsylvania" : ["42","PA", "pennsylvania"],
        "puerto_rico" : ["72","PR", "puerto_rico"],
        "rhode_island" : ["44","RI", "rhode_island"],
        "south_carolina" : ["45","SC", "south_carolina"],
        "south_dakota" : ["46","SD", "south_dakota"],
        "tennessee" : ["47","TN", "tennessee"],
        "texas" : ["48","TX", "texas"],
        "utah" : ["49","UT", "utah"],
        "vermont" : ["50","VT", "vermont"],
        "virginia" : ["51","VA", "virginia"],
        "washington" : ["53","WA", "washington"],
        "west_virginia" : ["54","WV", "west_virginia"],
        "wisconsin" : ["55","WI", "wisconsin"],
        "wyoming" : ["56","WY", "wyoming"],
        "virgin_islands" : ["78","VI", "virgin_islands"],

    }

    fp = open('../_data/locations.json', 'r')
    data = json.loads(fp.read())
    fp.close()

    end = {}

    for item in data:

        name = [letter.lower() for letter in item['name'] if letter != ","]
        end[item['_id']] = {}
        end[item['_id']]['name'] = name
        n = 0
        for k, v in states.items():
            if item['state_id'] == v[0]:
                n = 0
                end[item['_id']]['state'] = v[2]
                break
            n += 1

        if n > 0:
            print(f"Missing State: {item['name']}")

    fw = open('./output/typeahead_locations.json', "w")
    fw.write(json.dumps(end))
    fw.close()

if __name__ == "__main__":
    main()
