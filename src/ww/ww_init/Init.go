package ww_init

import (
	"dubdub.com/dubdub/ww/ww_db"
	// "fmt"
)

type single struct {
	MDB *ww_db.MongoDB
	RDB *ww_db.RDB
}

var WW_app *single = nil

func WW() *single {
	if WW_app == nil {
		WW_app = new(single)
		WW_app.MDB = ww_db.InitDB()
		WW_app.RDB = ww_db.InitRedis()
	}
	return WW_app
}
