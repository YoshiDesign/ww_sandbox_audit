package ww_db

import (
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
	"context"
)

type MongoDB struct {
	County_collection *mongo.Collection
	School_collection *mongo.Collection
	Occupations_collection *mongo.Collection
	Workforce_collection *mongo.Collection
	Company_collection *mongo.Collection
	State_collection *mongo.Collection
	City_collection *mongo.Collection
	Nation_stats_collection *mongo.Collection
	User_collection *mongo.Collection
}

var m *MongoDB = nil

func InitDB() *MongoDB {

	uri := os.Getenv("ATLAS_URI")

	if (m == nil) {
		m = new(MongoDB)

		mongo_client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
		if err != nil {
			// Please keep in mind that panic() will crash the server, thank you
			panic(err)
		}

		CountyCollection 	:= mongo_client.Database("ww_data").Collection("counties")
		SchoolCollection 	:= mongo_client.Database("ww_data").Collection("schools")
		OccupationsCollection := mongo_client.Database("ww_data").Collection("occupations")
		WorkforceCollection := mongo_client.Database("ww_data").Collection("occupationstats")
		CompanyCollection 	:= mongo_client.Database("ww_data").Collection("workplaces")
		StateCollection 	:= mongo_client.Database("ww_data").Collection("states")
		CityCollection 		:= mongo_client.Database("ww_data").Collection("cities")
		NationStatsCollection := mongo_client.Database("ww_data").Collection("nation_stats")
		UserCollection 		:= mongo_client.Database("ww_data").Collection("users")
	
		m.County_collection = CountyCollection 
		m.School_collection = SchoolCollection
		m.Workforce_collection = WorkforceCollection 
		m.Company_collection = CompanyCollection 
		m.State_collection = StateCollection
		m.City_collection = CityCollection
		m.Occupations_collection = OccupationsCollection
		m.Nation_stats_collection = NationStatsCollection
		m.User_collection = UserCollection
	
		// Kill the mongo client if main exits or returns. TODO- Get a pointer to mongo_client and defer disconnection from main()
		// defer mongo_client.Disconnect(context.TODO())

		fmt.Println("MongoDB: Successfully connected")
	}

	return m

}