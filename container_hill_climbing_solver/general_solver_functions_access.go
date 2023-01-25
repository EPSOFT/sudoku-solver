package main

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/ansel1/merry"
	"github.com/go-resty/resty/v2"
)

var apiKey string = os.Getenv("SOLVER_FUNCTIONS_KEY")

/*
   This function uses the general solver functions api to calculate and return all the different collisions on a given board array
   representation.
*/
func CalculateBoardFitnessReport(board [][]uint8, zoneHeight, zoneLength uint16) (totalCollisions, columnCollisions, rowCollisions, zoneCollisions uint16, err error) {

	var boardFitnessReportApiUrl string = os.Getenv("FITNESS_REPORT_SCORE_LINK")
	var boardFitnessReportResponse *resty.Response

	boardFitnessReportRequest := &BoardFitnessReportRequest{
		ZoneHeight: zoneHeight,
		ZoneLength: zoneLength,
		BoardArray: board,
	}

	boardFitnessReportResponse, err = resty.New().R().
		SetHeader("Content-Type", "application/json").
		SetHeader("Authorization", apiKey).
		SetBody(boardFitnessReportRequest).
		Get(boardFitnessReportApiUrl)

	if err != nil {
		return 0, 0, 0, 0, merry.Wrap(err).Append("unable to get the board fitness report").
			WithValue("responseCode", boardFitnessReportResponse.Status()).
			WithValue("requestBody", boardFitnessReportRequest).
			WithHTTPCode(http.StatusInternalServerError)
	}

	if !boardFitnessReportResponse.IsSuccess() {
		return 0, 0, 0, 0, merry.New("error while getting the board fitness report").
			WithValue("responseCode", boardFitnessReportResponse.Status()).
			WithValue("requestBody", boardFitnessReportRequest).
			WithHTTPCode(http.StatusInternalServerError)
	}

	var boardFitnessReportResponseRawBody []byte = boardFitnessReportResponse.Body()
	var boardFitnessReportResponseBody BoardFitnessReportResponse

	err = json.Unmarshal(boardFitnessReportResponseRawBody, &boardFitnessReportResponseBody)
	if err != nil {
		return 0, 0, 0, 0, merry.New("error while unmarshalling the board fitness response body").
			WithValue("responseBody", string(boardFitnessReportResponseRawBody)).
			WithHTTPCode(http.StatusInternalServerError)
	}

	return boardFitnessReportResponseBody.TotalCollisions,
		boardFitnessReportResponseBody.ColumnCollisions,
		boardFitnessReportResponseBody.RowCollisions,
		boardFitnessReportResponseBody.ZoneCollisions,
		nil

}

/*
   This function uses the general solver functions api to calculate and return the total of all the collisions on a given board
   array representation.
*/
func CalculateBoardFitnessSingle(board [][]uint8, zoneHeight, zoneLength uint16) (fitnessScore uint16, err error) {

	var boardFitnessSingleApiUrl string = os.Getenv("FITNESS_SINGLE_SCORE_LINK")
	var boardFitnessSingleResponse *resty.Response

	boardFitnessReportRequest := &BoardFitnessSingleRequest{
		ZoneHeight: zoneHeight,
		ZoneLength: zoneLength,
		BoardArray: board,
	}

	boardFitnessSingleResponse, err = resty.New().R().
		SetHeader("Content-Type", "application/json").
		SetHeader("Authorization", apiKey).
		SetBody(boardFitnessReportRequest).
		Get(boardFitnessSingleApiUrl)

	if err != nil {
		return 0, merry.Wrap(err).Append("unable to get the board fitness score").
			WithValue("responseCode", boardFitnessSingleResponse.Status()).
			WithValue("requestBody", boardFitnessReportRequest).
			WithHTTPCode(http.StatusInternalServerError)
	}

	if !boardFitnessSingleResponse.IsSuccess() {
		return 0, merry.New("error while getting the board fitness score").
			WithValue("responseCode", boardFitnessSingleResponse.Status()).
			WithValue("requestBody", boardFitnessReportRequest).
			WithHTTPCode(http.StatusInternalServerError)
	}

	var boardFitnessSingleResponseRawBody []byte = boardFitnessSingleResponse.Body()
	var boardFitnessSingleResponseBody BoardFitnessSingleResponse

	err = json.Unmarshal(boardFitnessSingleResponseRawBody, &boardFitnessSingleResponseBody)
	if err != nil {
		return 0, merry.New("error while unmarshalling the board fitness response body").
			WithValue("responseBody", string(boardFitnessSingleResponseRawBody)).
			WithHTTPCode(http.StatusInternalServerError)
	}

	return boardFitnessSingleResponseBody.FitnessScore, nil

}

/*
   This function uses the general solver functions api to fill randomly a board based on its initial state, where just the fixed
   numbers are on the board, the white spaces need to be represented with a 0 and just the spaces with zero are changed for random
   numbers that are not in the board untill the board is filled.
*/
func BoardRandomInitialization(fixedNumbersBoard [][]uint8, zoneHeight, zoneLength uint16) (initializedBoard [][]uint8, err error) {

	var boardRandomInitializationApiUrl string = os.Getenv("RANDOM_INITIALIZATION_LINK")
	var boardRandomInitializationResponse *resty.Response

	boardRandomInitializationRequest := &BoardRandomInitializationRequest{
		FixedNumbersBoard: fixedNumbersBoard,
		ZoneHeight:        zoneHeight,
		ZoneLength:        zoneLength,
	}

	boardRandomInitializationResponse, err = resty.New().R().
		SetHeader("Content-Type", "application/json").
		SetHeader("Authorization", apiKey).
		SetBody(boardRandomInitializationRequest).
		Get(boardRandomInitializationApiUrl)

	if err != nil {
		return nil, merry.Wrap(err).Append("unable to initialize the board").
			WithValue("responseCode", boardRandomInitializationResponse.Status()).
			WithValue("requestBody", boardRandomInitializationRequest).
			WithHTTPCode(http.StatusInternalServerError)
	}

	if !boardRandomInitializationResponse.IsSuccess() {
		return nil, merry.New("error while initializing the board").
			WithValue("responseCode", boardRandomInitializationResponse.Status()).
			WithValue("requestBody", boardRandomInitializationRequest).
			WithHTTPCode(http.StatusInternalServerError)
	}

	var boardRandomInitializationResponseRawBody []byte = boardRandomInitializationResponse.Body()
	var boardRandomInitializationResponseBody BoardRandomInitializationResponse

	err = json.Unmarshal(boardRandomInitializationResponseRawBody, &boardRandomInitializationResponseBody)
	if err != nil {
		return nil, merry.New("error while unmarshalling the board fitness response body").
			WithValue("responseBody", string(boardRandomInitializationResponseRawBody)).
			WithHTTPCode(http.StatusInternalServerError)
	}

	return boardRandomInitializationResponseBody.Board, nil

}

/*
   This function uses the general solver functions api to mutate randomly a board based on its initial state, the mutation affect
   just the not fixed numbers on the board.
*/
func BoardRandomMutation(board [][]uint8, fixedNumbersBoard [][]uint8) (mutatedBoard [][]uint8, err error) {

	var boardRandomMutationApiUrl string = os.Getenv("RANDOM_MUTATION_LINK")
	var boardRandomMutationResponse *resty.Response

	boardRandomMutationRequest := &BoardRandomMutationRequest{
		FixedNumbersBoard: fixedNumbersBoard,
		BoardArray:        board,
	}

	boardRandomMutationResponse, err = resty.New().R().
		SetHeader("Content-Type", "application/json").
		SetHeader("Authorization", apiKey).
		SetBody(boardRandomMutationRequest).
		Get(boardRandomMutationApiUrl)

	if err != nil {
		return nil, merry.Wrap(err).Append("unable to mutate the board").
			WithValue("responseCode", boardRandomMutationResponse.Status()).
			WithValue("requestBody", boardRandomMutationRequest).
			WithHTTPCode(http.StatusInternalServerError)
	}

	if !boardRandomMutationResponse.IsSuccess() {
		return nil, merry.New("error while mutating the board").
			WithValue("responseCode", boardRandomMutationResponse.Status()).
			WithValue("requestBody", boardRandomMutationRequest).
			WithHTTPCode(http.StatusInternalServerError)
	}

	var boardRandomMutationResponseRawBody []byte = boardRandomMutationResponse.Body()
	var boardRandomMutationResponseBody BoardRandomInitializationResponse

	err = json.Unmarshal(boardRandomMutationResponseRawBody, &boardRandomMutationResponseBody)
	if err != nil {
		return nil, merry.New("error while unmarshalling the board fitness response body").
			WithValue("responseBody", string(boardRandomMutationResponseRawBody)).
			WithHTTPCode(http.StatusInternalServerError)
	}

	return boardRandomMutationResponseBody.Board, nil

}
