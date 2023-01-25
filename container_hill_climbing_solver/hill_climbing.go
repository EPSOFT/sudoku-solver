package main

import (
	"sort"

	"github.com/ansel1/merry"
)

/*
   This function is the base of the solver, it implements a hill climbing algorithm with restarts that is the heart of the solver.
*/
func SolveUsingHillClimbingAlgorithm(hillClimbingRestarts, hillClimbingSearchs, zoneHeight, zoneLength uint16, initialBoard [][]uint8) (solutionBoard [][]uint8, err error) {

	var fixedNumbersBoard [][]uint8 = initialBoard
	var filledBoard [][]uint8
	var genomeList []Genome
	var genome Genome

	for restart := 0; restart < int(hillClimbingRestarts); restart++ {

		filledBoard, err = BoardRandomInitialization(fixedNumbersBoard, zoneHeight, zoneLength)
		if err != nil {
			return nil, merry.Wrap(err).WithValue("fixedNumbersBoard", fixedNumbersBoard).
				WithValue("zoneHeight", zoneHeight).
				WithValue("zoneLength", zoneLength)
		}

		for search := 0; search < int(hillClimbingSearchs); search++ {

			genome, err = mutateIfScoreImproves(filledBoard, fixedNumbersBoard, zoneHeight, zoneLength)
			if err != nil {
				return nil, merry.Wrap(err).WithValue("filledBoard", filledBoard).
					WithValue("fixedNumbersBoard", fixedNumbersBoard).
					WithValue("zoneHeight", zoneHeight).
					WithValue("zoneLength", zoneLength)
			}

			genomeList = append(genomeList, genome)

		}

	}

	sort.Slice(genomeList, func(i, j int) bool {
		return genomeList[i].Score < genomeList[j].Score
	})

	return genomeList[0].Board, nil

}

/*
   This function create a new board mutating the original board, if the mutated board have a lower fitness score than the original
   it returns the mutated board, in other way it return the original board.
*/
func mutateIfScoreImproves(initialBoard, fixedNumbersBoard [][]uint8, zoneHeight, zoneLength uint16) (genome Genome, err error) {

	var initialBoardLocal [][]uint8 = initialBoard
	var mutatedBoardLocal [][]uint8 = initialBoard
	var initialBoardScore uint16
	var mutatedBoardScore uint16

	mutatedBoardLocal, err = BoardRandomMutation(mutatedBoardLocal, fixedNumbersBoard)
	if err != nil {
		return Genome{}, merry.Wrap(err).WithValue("mutatedBoardLocal", mutatedBoardLocal).
			WithValue("fixedNumbersBoard", fixedNumbersBoard)
	}

	initialBoardScore, err = CalculateBoardFitnessSingle(initialBoardLocal, zoneHeight, zoneLength)
	if err != nil {
		return Genome{}, merry.Wrap(err).WithValue("initialBoardLocal", initialBoardLocal).
			WithValue("zoneHeight", zoneHeight).
			WithValue("zoneLength", zoneLength)
	}

	mutatedBoardScore, err = CalculateBoardFitnessSingle(mutatedBoardLocal, zoneHeight, zoneLength)
	if err != nil {
		return Genome{}, merry.Wrap(err).WithValue("mutatedBoardLocal", mutatedBoardLocal).
			WithValue("zoneHeight", zoneHeight).
			WithValue("zoneLength", zoneLength)
	}

	if mutatedBoardScore <= initialBoardScore {
		return Genome{Board: initialBoardLocal, Score: initialBoardScore}, nil
	}

	return Genome{Board: mutatedBoardLocal, Score: mutatedBoardScore}, nil

}
