package ww_utils

import (
	"fmt"
	// "log"
)

// Search is completed after acquiring 10 matches
var MAX_MATCHES int = 10
// Search is exhausted after visiting 900 nodes. Return what was found
var MAX_ITERATIONS int = 900

// The search recommendation objects [Redis]
type KeyObject struct {
	N map[string] *KeyObject `json:"n,omitempty"`	// A group of keys - Next available letters
	Im int			`json:"im,omitempty"`		// 0 || 1 -- is match
	Wt int			`json:"wt,omitempty"`		// weight
	V int			`json:"v,omitempty"`		// visited, yep or no
	X []map[string]string				`json:"x,omitempty"`		// The information we're interested in or nil
	// St string		`json:"s,omitempty"`		// The ID of this search term's record in MongoDB
}

// Returns true if the desired index does not exist in the cursor's nodes
func nullKey(cursor *KeyObject) bool {
	// fmt.Println(cursor == nil)
	return cursor == nil
}

/**
	query - the query
	data - The redis key's (q[0]) value
	s - q[0]
	b - "occ" or "loc"  
*/
func Typeahead (query string, data *KeyObject , s string, b string) []map[string] string {

	cursor := data			// Shallow copy used to navigate the data structure
	var count int = 0		// Number of successful matches
	var _str string = s		// Current successful string

	var matches []map[string]string
	
	if cursor == nil {
		fmt.Println("1 Hard Fail /api/datas/instant")
		// log.Print("Unable to get data from KeyObject")
		// Return an error
		err := map[string]string{"Error" : "Unable to get data from KeyObject"}
		return append(matches, err)
	}

	/*
	 * Begin the search strictly with the letters we've been provided by the query.
	 * Note that this loop is ignored when len(query) == 1
	 */ 
	for i := 1; i < len(query); i++ {

		// Check for the next search key's existance
		
		if next := cursor.N[string(query[i])]; nullKey(next) {
			// Exit the loop and  begin generating suggestions
			break
		} else {

			// Move the cursor to its next location
			cursor = next

			_str = _str + string(query[i])

			if (*cursor).Im == 1 {

				// Create the match object
				// var m = make(map[string] string)
				// if (b == "occ"){
				// 	m = map[string]string{(*cursor).Id : _str}
				// }
				// if (b == "loc") {
				// 	m = map[string]string{(*cursor).Id : _str, "state" : (*cursor).St}
				// }
				for i := 0; i < len(cursor.X); i++ {
					// Add it to the matches slice
					matches = append(matches, cursor.X[i])
					// Increment no. matches
					count = count + 1
				}
			}

		}

	}

	/*
	 * Randomly search for suggestions until we've retrieved MAX of them. Depth/Breadth limited by MAX_ITERATIONS
	 * They will be organized by the frontend in order of most identical to the query string.
	 */
	for quit := 0 ; count <= MAX_MATCHES ; quit++ {
		// fmt.Println("--- --- --- --- --- --- --- ---")
		// fmt.Println("String:\t", _str)
		// fmt.Println("Avail Nodes: \t", len((*cursor).N))

		// Done!
		if quit > MAX_ITERATIONS || count >= 10 {
			return matches
		}

		next_letter := ""

		// Obvious choice
		if len((*cursor).N) == 1 {

			// Get the only key to traverse next
			k := getKeys((*cursor).N)[0]

			// make sure it hasn't been visited
			if (*cursor).N[k].V == 0 {
				next_letter = k
			}

		// Next best choice
		} else if len((*cursor).N) > 0 {
			next_letter = getNextLetter((*cursor).N)
		}

		// Begin backtracking
		if next_letter == "" {
			
			// fmt.Println("Str != Query?")
			// fmt.Println("Str:", _str)
			// fmt.Println("Query:", query)
			// fmt.Println(_str == query)

			// Where the query left off
			if _str != query {

				cursor = data
				var tmp *KeyObject

				// Reduce the _str by 1 character
				if (len(_str) >= 1){
					_str = _str[:len(_str) - 1]
				}

				for i := 1; i < len(_str); i++ {

					tmp = cursor
					cursor = tmp.N[string(_str[i])]
					
				}

				// fmt.Println("Post Traversal:\t", cursor)

			} else {
				// Return matches - Seach has been heavily exhausted
				break
			}

		} else {

			// fmt.Println("Cursor moving")

			// Append to our string, the next best letter we're about to traverse to
			_str = _str + next_letter

			// Store the next location in `next`, we know it exists, dont check for nil
			next := (*cursor).N[next_letter]
			// Visit
			cursor = next
			// Visited == true
			(*cursor).V = 1	
			

			if len(cursor.X) > 0 {
				
				for i := 0; i < len(cursor.X); i++ {
					// Add it to the matches slice
					matches = append(matches, cursor.X[i])
					// Increment no. matches
					count = count + 1
				}
				
			}
			
		}
		
	}
	
	
	return matches

}

// Get the keys from a KeyObjects map of nodes
func getKeys(m map[string] *KeyObject ) []string {
	keys := make([]string, 0, len(m))
    for k := range m {
        keys = append(keys, k)
	}
	return keys
}


/*
 * Determine the next best path through the data struct
 */
func getNextLetter(nodes map[string] *KeyObject) string {

	best_option := ""

	for k1 := range nodes {

		// Already visited, skip
		if nodes[k1].V == 1 {continue}

		for k2 := range nodes {

			// Same key or not as popular
			if k2 == k1 || nodes[k2].Wt <= nodes[k1].Wt {continue}

			// k1 is more popular and also unvisited
			if nodes[k1].Wt > nodes[k2].Wt && nodes[k1].V == 0 {
				best_option = k1

			// Still searching...
			} else if best_option == "" {
				// Save some time by considering our first potential match, or use the current key if unvisited
				if nodes[k2].Wt > nodes[k1].Wt && nodes[k2].V == 0 {
					best_option = k2
				} else if nodes[k1].V == 1 {
					best_option = k1
				}
			}

		}
	}

	// Any unvisited key will do from here
	if best_option == "" {
		for k := range nodes {
			if nodes[k].V == 0 {
				best_option = k
			}
		}
	}

	return best_option
}