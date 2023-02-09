package ww_api

import (
	"fmt"
	"strings"

	// "time"
	"encoding/json"
	// "log"
	"dubdub.com/dubdub/ww/ww_init"
	"dubdub.com/dubdub/ww/ww_utils"
	"github.com/gofiber/fiber/v2"
)

func TypeaheadSearch(c *fiber.Ctx) error {

	// Perfmon
	// t1 := time.Now()

	k := ""

	// Occ or Loc
	b := strings.ToLower(c.Query("b"))[:3]

	// Assert b
	if b != "occ" && b != "loc" {
		return c.JSON(ww_utils.RequestError(1, "Invalid query."))
	}

	// The search key
	q := strings.ToLower(c.Query("query"))
	// fmt.Println("/instant query string: ", q)

	// Every instant query is prefixed with a "/usa_n" or "/usa-n" nation prefix. Hyphens indicate LOCATION and underscores indicate JOB TITLES
	nation := strings.ToLower(c.Query("n"))
	// fmt.Println("Nation Query: ", nation)
	if !strings.HasPrefix(nation, "/") {
		fmt.Println("[Error] /instant - Invalid nation slug in parameter list.")
		return c.JSON(ww_utils.RequestError(2, "Invalid query."))
	}

	// Validation
	if !ww_utils.ValidQuery.MatchString(q) || !ww_utils.ValidQuery.MatchString(b) {
		return c.JSON(ww_utils.RequestError(3, "Invalid query."))
	}
	if len(q) == 0 || len(b) == 0 {
		return c.JSON(ww_utils.RequestError(4, "Invalid query."))
	}

	// Add the location search prefix
	if b == "loc" {
		k = string(nation) + string("_") + string(q[0])
	} else {
		k = string(nation) + string("-") + string(q[0])
	}

	// Get the redis keystore
	val, err := ww_init.WW_app.RDB.Redis.Get(ww_utils.Redis_ctx, string(k)).Result()
	if err != nil {
		fmt.Println("1 Hard Fail /api/datas/instant")
		// log.Print(err)
		return c.JSON(ww_utils.RequestError(7, "/api/datas/instant Unable to retrieve key from memory."))
	}

	// The unmarshalled Redis keyStore
	var keyMap ww_utils.KeyObject

	// Dump the redis keystore into KeyMap
	if err := json.Unmarshal([]byte(val), &keyMap); err != nil {
		fmt.Println("2 Hard Fail /api/datas/instant")
		// log.Print(err)
		return c.JSON(ww_utils.RequestError(8, "/api/datas/instant Unable to retrieve object from memory"))
	}

	// Find the typeahead results
	results, _ := json.Marshal(ww_utils.Typeahead(string(q), &keyMap, string(q[0]), b))

	// Perfmon
	// t2 := time.Now()
	// diff := t2.Sub(t1)

	// Send it
	return c.JSON(ww_utils.TypeaheadResponse{ /*diff,*/ Results: string(results)})

}
