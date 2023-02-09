package ww_api

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"

	// "time"
	// "encoding/json"
	// "io"
	// "bufio"
	// "io/ioutil"
	// "os"

	// "github.com/gofiber/fiber/v2/middleware/cors"
	// "github.com/go-redis/redis/v8"
	// "github.com/fatih/structs"

	"dubdub.com/dubdub/ww/models"
	"dubdub.com/dubdub/ww/ww_init"
	"dubdub.com/dubdub/ww/ww_utils"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/**
 *
 */
func MapData(c *fiber.Ctx) error {

	map_key := c.Query("map_key")

	fmt.Println("Map Key:", map_key)
	// At the moment all map keys start with a '/' or it's the 'map_globe' key
	if !strings.HasPrefix(map_key, "/") && map_key != "map_globe" {
		return c.JSON(ww_utils.RequestError(6, "/api/datas/mapData Invalid map_key."))
	}

	// Get the map path information from Redis
	val, err := ww_init.WW_app.RDB.Redis.Get(ww_utils.Redis_ctx, string(map_key)).Result()
	if err != nil {
		fmt.Println("1 Hard Fail /api/datas/mapData")
		log.Print(err)
		return c.JSON(ww_utils.RequestError(7, "/api/datas/mapData Unable to retrieve key from memory."))
	}

	// The request was for the globe's map data
	if map_key == "map_globe" {

		if err != nil {
			fmt.Println("1 Hard Fail /api/datas/mapData")
			log.Print(err)
			return c.JSON(ww_utils.RequestError(7, "/api/datas/mapData Unable to retrieve key from memory."))
		}
		return c.JSON(ww_utils.MapDataResponse{Geo: string(val), NationStats: "NoStats"})

		// The request was for a specific nation's map data
	} else {

		p := bson.M{"country_code": 1, "cat_1": 1, "cat_2": 1, "cat_3": 1, "cat_4": 1, "cat_5": 1, "cat_6": 1, "cat_7": 1}

		// Get this nation's stats from MDB
		findOptions := options.FindOne()
		findOptions.SetProjection(p)
		findConditions := bson.M{"link": map_key}

		nationStats := bson.M{}
		err0 := ww_init.WW_app.MDB.Nation_stats_collection.FindOne(context.TODO(), findConditions, findOptions).Decode(&nationStats)
		if err0 != nil {
			fmt.Println("1 Hard Fail /api/datas/mapData: Failed to find nation stats for map key: [" + map_key + "]")
			log.Print(err0)
			return c.JSON(ww_utils.RequestError(5, "No documents in result."))
		}

		return c.JSON(ww_utils.MapDataResponse{Geo: string(val), NationStats: nationStats})
	}

}

/**
 *
 */
func CostOfLivingData(c *fiber.Ctx) error {

	V_1 := strings.ToLower(c.Query("v_1"))
	V_2 := strings.ToLower(c.Query("v_2"))

	// fmt.Println("V_1:",V_1)
	// fmt.Println("V_2:",V_2)

	// Validation
	if !ww_utils.ValidQuery.MatchString(V_1) || !ww_utils.ValidQuery.MatchString(V_2) {
		return c.SendString("/wfc - Invalid Query...")
	}

	var met1 bool = len(V_1) > 0 && V_1 != "null"
	var met2 bool = len(V_2) > 0 && V_2 != "null"

	// Checks for proper reequest params
	allowed := []string{"col", "mhc", "rav", "r0", "r1", "r2", "r3", "r4"}

	// Validate the request
	if met1 && !ww_utils.StrInArray(V_1, allowed) {
		return c.JSON(ww_utils.RequestError(2, "/api/datas/col Invalid Request"))
	}
	if met2 && !ww_utils.StrInArray(V_2, allowed) {
		return c.JSON(ww_utils.RequestError(3, "/api/datas/col Invalid Request"))
	}

	/**
	Find documents from Mongo
	*/
	p := bson.M{}
	if met1 && met2 {
		p = bson.M{V_2: 1, V_1: 1, "name": 1}
	} else if met1 {
		p = bson.M{V_1: 1, "name": 1}
	} else {
		return c.JSON(ww_utils.RequestError(5, "/api/datas/col Received unknown parameter"))
	}

	// Set the selection options
	findOptions := options.Find()
	findOptions.SetProjection(p) // Specify columns to be returned - p denotes which stats to select
	findConditions := bson.M{}   // A "where" clause - empty for this query - we imply all counties w an empty bson.M

	cur, err := ww_init.WW_app.MDB.County_collection.Find(context.TODO(), findConditions, findOptions)
	if err != nil {
		fmt.Println("1 Hard Fail /api/datas/col")
		log.Print(err)
		return c.JSON(ww_utils.RequestError(1, "Something went wrong..."))
	}

	// Our return object
	var m = make(map[string]map[string]int)

	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for cur.Next(context.TODO()) {

		// create a value into which the single document can be decoded
		var elem models.County

		// Temporary insertion buffer
		var item = make(map[string]int)

		// Map the inbound data to our County model
		err := cur.Decode(&elem)
		if err != nil {
			fmt.Println("2 Hard Fail /api/datas/col:", err)
			log.Fatal(err)
		}

		// Get the data inserted into our item buffer
		if met1 {
			item[V_1] = ww_utils.ColAccessor(V_1, elem)
		}
		if met2 {
			item[V_2] = ww_utils.ColAccessor(V_2, elem)
		}

		m[string(elem.ID)] = item

	}

	if err := cur.Err(); err != nil {
		fmt.Println("3 Hard Fail /api/datas/col")
		log.Fatal(err)
	}

	// Close the cursor once finished
	cur.Close(context.TODO())

	return c.JSON(m)

}

/**
 *
 */
func CensusData(c *fiber.Ctx) error {

	fips_code := string(c.Query("fips"))

	fmt.Println("Census Query:", fips_code)

	// Census keys will not exceed 12 chars
	if !strings.HasPrefix(fips_code, "/") {
		fmt.Println("[Error] /census - Invalid census query key.")
		return c.JSON(ww_utils.RequestError(5, "Invalid query."))
	}

	// Get the redis keystore
	val, err := ww_init.WW_app.RDB.Redis.Get(ww_utils.Redis_ctx, string(fips_code)).Result()
	if err != nil {
		fmt.Println("1 Hard Fail /api/datas/census")
		log.Print(err)
		return c.JSON(ww_utils.RequestError(7, "/api/datas/census Unable to retrieve key from memory"))
	}

	// The unmarshalled Redis keyStore
	var keyMap models.Census

	// Turn the redis string into its marshalled JSON equivalent
	if err := json.Unmarshal([]byte(val), &keyMap); err != nil {
		fmt.Println("2 Hard Fail /api/datas/census")
		log.Print(err)
		return c.JSON(ww_utils.RequestError(8, "/api/datas/census Unable to retrieve object from memory"))
	}

	return c.JSON(keyMap)

}

func OccupationData(c *fiber.Ctx) error {

	// V_1 and V_2 are also accessible but currently unused
	// V_1 := strings.ToLower(c.Query("v_1"))
	// V_2 := strings.ToLower(c.Query("v_2"))
	// fmt.Println(c.Query("occ_code"))

	// This is what we're here for
	Occ_code := string(c.Query("occ_code"))
	var met_occ bool = ww_utils.IsNumeric(Occ_code) || len(Occ_code) < 12
	if !met_occ {
		return c.JSON(ww_utils.RequestError(5, "Invalid query."))
	}

	p := bson.M{}
	p = bson.M{"avg_hr": 1, "median_hr": 1, "name": 1, "avg_an": 1, "median_an": 1, "max_hr": 1, "max_an": 1, "min_hr": 1, "min_an": 1, "tf0": 1, "tf1": 1, "tf2": 1, "tfav": 1}

	findOptions := options.FindOne()
	findOptions.SetProjection(p) // Specify columns to be returned - p denotes which stats to select
	findConditions := bson.M{"_id": Occ_code}

	occupation := bson.M{}
	err0 := ww_init.WW_app.MDB.Occupations_collection.FindOne(context.TODO(), findConditions, findOptions).Decode(&occupation)
	if err0 != nil {
		fmt.Println("1 Hard Fail /api/datas/occ: Failed to find occupation: [" + Occ_code + "]")
		log.Print(err0)
		return c.JSON(ww_utils.RequestError(5, "No documents in result."))
	}

	// fmt.Println(occupation)
	return c.JSON(occupation)

}

/**
 *
 */
func WorkforceData(c *fiber.Ctx) error {

	// Occupation statistic keys
	allowed := []string{"null", "ex0", "ex1", "ex2", "pk", "em", "lq"}

	fmt.Println("/api/datas/wfc")
	V_1 := strings.TrimSpace(strings.ToLower(c.Query("v_1")))
	V_2 := strings.TrimSpace(strings.ToLower(c.Query("v_2")))
	Occ_code := strings.ToLower(c.Query("occ_code"))

	// "null" is explicitly set by the frontend for sanity.
	// These variables dictate what is extracted from the MDB document
	var met_occ bool = (len(Occ_code) < 12 && len(Occ_code) > 0) && ww_utils.IsNumeric(Occ_code)
	var met_v1 bool = len(V_1) < 1 || V_1 != "null"
	var met_v2 bool = len(V_2) < 1 || V_2 != "null"

	fmt.Println("V_1:", V_1, strconv.FormatBool(met_v1), "\nV_2:", V_2, strconv.FormatBool(met_v2))
	fmt.Println("Occ_code:", Occ_code, strconv.FormatBool(met_occ))

	// Check the request
	if !ww_utils.StrInArray(V_1, allowed) {
		return c.JSON(ww_utils.RequestError(2, "/api/datas/wfc Invalid Request"))
	}
	if !ww_utils.StrInArray(V_2, allowed) {
		return c.JSON(ww_utils.RequestError(3, "/api/datas/wfc Invalid Request"))
	}
	if !ww_utils.IsNumeric(Occ_code) || len(Occ_code) > 12 {
		return c.JSON(ww_utils.RequestError(4, "/api/datas/wfc Invalid Request"))
	}
	// Validation
	if !ww_utils.ValidQuery.MatchString(V_1) || !ww_utils.ValidQuery.MatchString(V_2) {
		return c.SendString("/wfc - Invalid Query...")
	}

	/**
	Prepare the Find().
	Find documents from Mongo.
	*/
	p := bson.M{}
	if met_v1 && met_v2 {
		// fmt.Println("V1 V2 and County ID")
		p = bson.M{V_2: 1, V_1: 1, "county_id": 1}
	} else if met_v1 {
		// fmt.Println("V1 and County ID")
		p = bson.M{V_1: 1, "county_id": 1}
	} else if met_occ {
		// fmt.Println("Occ Code and County ID")
		p = bson.M{Occ_code: 1, "county_id": 1}
	} else {
		return c.JSON(ww_utils.RequestError(5, "/api/dats/wfc Received Unknown Parameter"))
	}

	// Set the selection options
	findOptions := options.Find()
	findOptions.SetProjection(p) // Specify columns to be returned - p denotes which stats to select

	// Note that we're only finding a document by V_1 and not V_1 && V_2.
	// If the mdb document has a V_1, it has a V_2. The inverse is also true; no V_1 no V_2
	findConditions := bson.M{"$and": []bson.M{bson.M{"occupation_id": Occ_code}, bson.M{V_1: bson.M{"$gt": float64(0.0)}}}}

	// Execute the query
	cur, err := ww_init.WW_app.MDB.Workforce_collection.Find(context.TODO(), findConditions, findOptions)
	if err != nil {
		fmt.Println("1 Hard Fail /api/datas/wfc")
		log.Fatal(err)
	}

	// Our return object
	var m = make(map[string]map[string]float64)

	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for cur.Next(context.TODO()) {

		// create a value into which the single document can be decoded
		var elem models.WFC

		// Temporary insertion buffer
		var item = make(map[string]float64)

		// Map the inbound data to our County model
		err := cur.Decode(&elem)
		if err != nil {
			fmt.Println("2 Hard Fail /api/datas/wfc")
			log.Fatal(err)
		}

		// Get the data inserted into our item buffer
		if met_v1 {
			item[V_1] = ww_utils.WFCAccessor(V_1, elem)
		}
		if met_v2 {
			item[V_2] = ww_utils.WFCAccessor(V_2, elem)
		}

		m[string(elem.County_id)] = item

	}

	if err := cur.Err(); err != nil {
		fmt.Println("3 Hard Fail /api/datas/wfc")
		log.Fatal(err)
	}

	// Close the cursor once finished
	cur.Close(context.TODO())

	return c.JSON(m)

}

/**
 *
 */
func LocationData(c *fiber.Ctx) error {
	// fmt.Println("Location...", c.Query("fips"))

	/**
	*	How this goes...
	*	1. Get all the cities with a county_id of c.Query("fips")
	* 	2. Fetch the list of companies within this targeted region.
	* 	3. If the requested location lies within a state, canton, province, etc. then fetch the state's record from "states" MDB collection.
	*  	4.
	 */

	// Reference for POST
	// qParameter := new(WLInfoRequest)
	// if err := c.BodyParser(qParameter); err != nil {
	// 	log.Print(err)
	//     return c.JSON(ww_utils.RequestError(1, "/api/datas/loc Invalid Request"))
	// }
	q := c.Query("fips")
	tmp := strings.Split(q, "_.")
	region, fips := tmp[0], tmp[1]

	fmt.Println("Region:", region)
	//fmt.Println("Location Fip:", fips)

	// Check the request
	var met_fip bool = len(fips) < 10
	if !met_fip {
		log.Print("Request Failure @ /api/datas/loc")
		return c.JSON(ww_utils.RequestError(2, "Invalid Request"))
	}

	/**	** **  **
	**         **
		  1 - Cities
	**         **
	**         **/
	// city_selection := bson.M{}
	city_selection := bson.M{
		"gro": 1, "hea": 1, "hou": 1,
		"uti": 1, "tra": 1, "ent": 1,
		"col": 1, "state_id": 1, "_id": 1,
		"name": 1, "county_name": 1,
	}

	// Set the selection options
	city_findOptions := options.Find()
	city_findOptions.SetProjection(city_selection) // Specify columns to be returned - p denotes which stats to select
	city_findConditions := bson.M{"county_id": fips}

	// Execute the query -- TODO turn into GoRoutine
	city_cur, err := ww_init.WW_app.MDB.City_collection.Find(context.TODO(), city_findConditions, city_findOptions)
	if err != nil {
		fmt.Println("1 Hard Fail /api/datas/loc")
		log.Print(err)
		return c.JSON(ww_utils.RequestError(2, "Something went wrong..."))
	}

	// Our return object
	cities := []models.City{}

	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for city_cur.Next(context.TODO()) {

		// create a value into which the single document can be decoded
		var elem models.City

		// Map the inbound data to our County model
		err := city_cur.Decode(&elem)
		if err != nil {
			fmt.Println("2 Hard Fail /api/datas/loc")
			log.Print(err)
			return c.JSON(ww_utils.RequestError(3, "Something went wrong..."))
		}
		// fmt.Println("INSPECT ELEM")
		// fmt.Println(elem)

		cities = append(cities, elem)

	}

	if err := city_cur.Err(); err != nil {
		fmt.Println("3  - NULL City Cursor /api/datas/loc: Attempted to query FIPS[" + fips + "]")
		log.Print(err)
		return c.JSON(ww_utils.RequestError(4, "Something went wrong..."))
	}

	// Close the cursor once finished
	city_cur.Close(context.TODO())

	if len(cities) == 0 {
		return c.JSON(ww_utils.RequestError(4, "No Cities..."))
	}

	// Acquire the state ID from any city
	var state_id string = cities[0].State_id

	// Add cities to the return object
	var finalObj = make(map[string]interface{})

	/**	** **  **
	**         **
		  2 - Companies
	**         **
	**         **/
	// company_selection := bson.M{}
	company_selection := bson.M{"places": 1} // Select

	// Set the selection options
	company_findOptions := options.FindOne()
	company_findOptions.SetProjection(company_selection) // Specify columns to be returned - p denotes which stats to select
	company_findConditions := bson.M{"fip": fips}        // Where

	// Execute the query
	// Our return object
	companies := bson.M{}
	err0 := ww_init.WW_app.MDB.Company_collection.FindOne(context.TODO(), company_findConditions, company_findOptions).Decode(&companies)
	if err0 != nil {
		fmt.Println("4 Hard Fail /api/datas/loc: Attempted to query FIPS[" + fips + "]")
		log.Print(err0)
		return c.JSON(ww_utils.RequestError(5, "Something went wrong..."))
	}

	// Add companies to our return object

	/**	** **  **
	**         **
		  3 - State or canton - if the region belongs to one. Only 1 map offers this so far (/usa)
	**         **
	**         **/
	/**
	* State Query - Warning: The only reason we know what state we're looking at is because each city has a state_id.
	* Caveat : Since we're waiting on the cities query to determine the state_id, this cannot run concurrently w the other 2 queries
	 */
	// state_selection := bson.M{}
	state_selection := bson.M{"abrv": 1, "name": 1, "gro": 1, "hea": 1, "hou": 1, "uti": 1, "tra": 1, "ent": 1} // Select

	// Set the selection options
	state_findOptions := options.FindOne()
	state_findOptions.SetProjection(state_selection) // Specify columns to be returned - p denotes which stats to select
	state_findConditions := bson.M{"_id": state_id}

	// Our return object
	state := bson.M{}

	// Execute the query -- TODO turn into GoRoutine
	err2 := ww_init.WW_app.MDB.State_collection.FindOne(context.TODO(), state_findConditions, state_findOptions).Decode(&state)
	if err2 != nil {
		fmt.Println("5 Hard Fail /api/datas/loc: Attempted to query FIPS[" + fips + "]")
		log.Print(err)
		return c.JSON(ww_utils.RequestError(6, "Something went wrong..."))
	}

	/**	** **  **
	**         **
		  4 - schools within this region
	**         **
	**         **/
	// schoolselection := bson.M{}
	schoolselection := bson.M{"_id": 1, "fip": 1, "dis": 1, "city": 1, "co": 1, "no_s": 1, "grade": 1, "no_school": 1} // Select

	// Set the selection options
	schoolfindOptions := options.Find()
	schoolfindOptions.SetProjection(schoolselection) // Specify columns to be returned - p denotes which stats to select
	schoolfindConditions := bson.M{"fip": fips}      // Where

	// Our return object
	schools := []models.School{}

	// Execute the query
	// Our return object
	schools_cur, err0 := ww_init.WW_app.MDB.School_collection.Find(context.TODO(), schoolfindConditions, schoolfindOptions)
	if err0 != nil {
		fmt.Println("4 Hard Fail /api/datas/loc: Attempted to query FIPS[" + fips + "]")
		log.Print(err0)
		return c.JSON(ww_utils.RequestError(5, "Something went wrong..."))
	}
	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for schools_cur.Next(context.TODO()) {

		// create a value into which the single document can be decoded
		var elem models.School

		// Map the inbound data to our County model
		err := schools_cur.Decode(&elem)
		if err != nil {
			fmt.Println("4 Hard Fail /api/datas/loc")
			log.Print(err)
			return c.JSON(ww_utils.RequestError(4, "Something went wrong..."))
		}

		schools = append(schools, elem)

	}

	// Add data to our return object
	finalObj["w"] = companies
	finalObj["sc"] = schools
	finalObj["s"] = state
	finalObj["c"] = cities

	// Add companies to our return object
	// fmt.Println(finalObj)
	return c.JSON(finalObj)

}

/**
 *
 */
func NationStatisticData(c *fiber.Ctx) error {

	cat_code := string(c.Query("cat_code"))
	if len(cat_code) > 5 {
		return c.JSON(ww_utils.RequestError(1, "/api/datas/nationStatsCategory Invalid Request"))
	}

	country_link := string(c.Query("cc"))
	if !ww_utils.ValidPathLink.MatchString(country_link) {
		return c.JSON(ww_utils.RequestError(1, "/api/datas/nationStatsCategory Invalid Request"))
	}

	// fmt.Println(cat_code)

	data := bson.M{}
	category_data := bson.M{}
	category_data[cat_code] = 1

	// Selection options
	category_options := options.FindOne()
	category_options.SetProjection(category_data)
	category_conditions := bson.M{"link": country_link} // The WHERE clause

	// Execute the query
	err := ww_init.WW_app.MDB.Nation_stats_collection.FindOne(context.TODO(), category_conditions, category_options).Decode(&data)
	if err != nil {
		fmt.Println("1 Hard Fail /api/datas/loc")
		log.Print(err)
		return c.JSON(ww_utils.RequestError(2, "Something went wrong..."))
	}

	return c.JSON(data)

}
