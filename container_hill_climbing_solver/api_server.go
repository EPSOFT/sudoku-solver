package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/ansel1/merry"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {

	e := echo.New()
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format:           "[${time_rfc3339}]:: - ${error}\n",
		CustomTimeFormat: "2006-01-02 15:04:05",
	}))

	/*
		This function is incharge of response all the health check petitions that the middle proxy makes for checking if the requested
		solver is active before making a solver request.
	*/
	e.GET("/health_test", func(context echo.Context) error {

		return context.NoContent(http.StatusOK)

	})

	/*
		This function is in charge to expose the solver functionality, this function receives the board solve parameters and initial
		board in the body of a json http request and returns response with the board best solution that this solver could find using
		the hill climbing algorithm in the response body also using json format.
	*/
	e.GET("/solver", func(context echo.Context) error {

		var totalCollisions, columnCollisions, rowCollisions, zoneCollisions uint16
		var authorization string = context.Request().Header.Get("Authorization")
		var middleProxyResponseBody MiddleProxyResponse
		var middleProxyRequestBody MiddleProxyRequest
		var solutionBoard [][]uint8
		var body []byte
		var err error

		if authorization == "" {
			return merry.New("authorization not found").
				WithValue("middleProxyAuthorization", authorization).
				WithUserMessage("authorization not found").
				WithHTTPCode(http.StatusBadRequest)
		}

		if authorization != os.Getenv("ACCESS_KEY") {
			return merry.New("authorization not valid").
				WithValue("middleProxyAuthorization", authorization).
				WithUserMessage("authorization not valid").
				WithHTTPCode(http.StatusUnauthorized)
		}

		body, err = ioutil.ReadAll(context.Request().Body)
		if err != nil {
			fmt.Println(err)
			return merry.Wrap(err).Append("error while loading the middle proxy request body").
				WithValue("middleProxyRequestBody", string(body)).
				WithHTTPCode(http.StatusInternalServerError)
		}

		err = json.Unmarshal(body, &middleProxyRequestBody)
		if err != nil {
			fmt.Println(err)
			return merry.Wrap(err).Append("error while unmarshalling the middle proxy request body").
				WithValue("middleProxyRequestBody", string(body)).
				WithHTTPCode(http.StatusInternalServerError)
		}

		if middleProxyRequestBody.Restarts == 0 {
			middleProxyRequestBody.Restarts = 10
		}

		if middleProxyRequestBody.Searchs == 0 {
			middleProxyRequestBody.Searchs = 10
		}

		solutionBoard, err = SolveUsingHillClimbingAlgorithm(
			middleProxyRequestBody.Restarts,
			middleProxyRequestBody.Searchs,
			middleProxyRequestBody.ZoneHeight,
			middleProxyRequestBody.ZoneLength,
			middleProxyRequestBody.InitialBoard,
		)
		if err != nil {
			fmt.Println(err)
			return merry.Wrap(err).WithValue("initialBoard", middleProxyRequestBody.InitialBoard).
				WithHTTPCode(http.StatusInternalServerError)
		}

		middleProxyResponseBody.SolutionBoard = solutionBoard

		totalCollisions, columnCollisions, rowCollisions, zoneCollisions, err = CalculateBoardFitnessReport(
			solutionBoard,
			middleProxyRequestBody.ZoneHeight,
			middleProxyRequestBody.ZoneLength,
		)
		if err != nil {
			fmt.Println(err)
			return merry.Wrap(err).WithValue("solutionBoard", solutionBoard).
				WithHTTPCode(http.StatusInternalServerError)
		}

		middleProxyResponseBody.ColumnCollisions = columnCollisions
		middleProxyResponseBody.TotalCollisions = totalCollisions
		middleProxyResponseBody.ZoneCollisions = zoneCollisions
		middleProxyResponseBody.RowCollisions = rowCollisions

		return context.JSON(http.StatusOK, middleProxyResponseBody)

	})

	e.Start(fmt.Sprintf(":%s", os.Getenv("ACCESS_PORT")))

}
