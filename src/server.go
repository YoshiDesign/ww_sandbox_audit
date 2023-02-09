package main

import (

	// "context"
	// "log"
	// "time"
	// "strings"
	// "regexp"
	// "encoding/json"
	// "strconv"
	// "io"
	// "bufio"
	// "io/ioutil"
	// "os"

	// "go.mongodb.org/mongo-driver/mongo/options"
	// "go.mongodb.org/mongo-driver/mongo"
	// "github.com/gofiber/fiber/v2/middleware/cors"
	// "github.com/gorilla/mux"
	// "github.com/fatih/structs"

	// "go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"
	// "go.mongodb.org/mongo-driver/mongo/readpref"
	// "go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/bson/primitive"

	"fmt"
	"os"

	"dubdub.com/dubdub/ww/ww_api"
	"dubdub.com/dubdub/ww/ww_init"
	"github.com/gofiber/fiber/v2"
	// "dubdub.com/dubdub/models"
	// "dubdub.com/dubdub/ww_utils"
)

func main() {

	app := fiber.New()
	// app.Use(cors.New())

	app.Use(func(c *fiber.Ctx) error {
		fmt.Println("Middleware...")

		return c.Next()
	})

	// Initialize all connections
	ww_init.WW()

	app.Static("/map/*", "./build")
	app.Static("/", "./build")

	/**
	 * Deliver a map mesh or a globe projection to the frontend.
	 * 1 Redis fetch
	 * 1 MDB fetch
	 * TODO: Future optimization. Just store the whole thing in Redis. Add the paths layer_1 and layer_2's to the nation_stats collections
	 * and commit the whole thing to Redis.
	 */
	app.Get("/api/datas/mapData", ww_api.MapData)

	/* *
	 *	Query Cost of Living data on every county.
	 */
	app.Get("/api/datas/col", ww_api.CostOfLivingData)

	/**
	 * User selected an occupation.
	 * This simply returns the occupation as it exists in the `occupations` collection
	 */
	app.Get("/api/datas/census", ww_api.CensusData)

	/**
	 * User selected an occupation.
	 * This simply returns the occupation as it exists in the `occupations` collection
	 *
	 * Data is from Mongo. OCCUPATION CODES SHOULD BE STRICTLY NUMERIC- For the sake of easy validation
	 */
	app.Get("/api/datas/occ", ww_api.OccupationData)

	/**
	 * WFC Request
	 * After a user selects an occupation they can select
	 * stats to render on each map. This endpoint receives
	 * an occupation code and the stats to query within that occupation's statistics
	 */
	app.Get("/api/datas/wfc", ww_api.WorkforceData)

	/*
	 * Gather location information - The user clicked on an interactive map region.
	 * This request executes 3 queries (TODO: Concurrently)
	 *
	 * One holdup is that we can only get 2/3 results concurrently because the state_id is retrieved from any of the cities we've fetched.
	 ! [TODO] -- WHEN THERE ARE NO CITIES, THE SERVER FUCKING CRASHES
	 * We should instead build a way to include the state ID with the inbound query params!!
	 *
	 * ToDo Optimization : You'll notice that we build the return object directly from their corresponding models.
	 * This returns every value in the struct (model), which is more data than we need to be sending to the f/e.
	 * Duplicate the strategy used in the other requests, we use a temp item{} and populated it with what we're interested in.
	 *
	 * Note: The fact that we're calling every region's ID "fip" is a consequence of myself thinking I'd only build this app to service the USA.
	 * Updating this little detail means renaming the fip field in the MDB collections. Not worried about it atm
	*/
	app.Get("/api/datas/loc", ww_api.LocationData)

	/**
	 *	Get the data used to generate the line graphs for the Country Notebook's Graph System
	 */
	app.Get("/api/datas/nationStatsCategory", ww_api.NationStatisticData)

	/**
	 *	Ye olde typeahead for query suggestions
	 */
	app.Get("/api/datas/instant", ww_api.TypeaheadSearch)

	/**
	 *	Auth stuff
	 */
	app.Post("auth/login", ww_api.Login)
	app.Post("auth/logout", ww_api.Logout)
	app.Post("auth/signup", ww_api.Signup)

	// app.Post("/tests", func(c *fiber.Ctx) error {
	// 	return c.SendString("From Tests")
	// })

	if os.Getenv("APP_LIVE") == "1" {
		app.Listen(":80")
	} else {
		app.Listen(":4000")
	}

}
