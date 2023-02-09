package ww_db

import (
	"github.com/go-redis/redis/v8"
	"os"
	"fmt"
)

type RDB struct {
	Redis *redis.Client
}

var r *RDB = nil 

func InitRedis() *RDB {

	var _RDB *redis.Client

	if (r == nil) {
		r = new(RDB)
		// Local Redis Server
		_RDB = redis.NewClient(&redis.Options{
			Addr:     "127.0.0.1:" + os.Getenv("REDIS_PORT"),
			Password: os.Getenv("REDIS_PASS"),
			DB:       0,  // use default db
		})

		r.Redis = _RDB
	}

	fmt.Println("Connected to Redis!")

	return r

}