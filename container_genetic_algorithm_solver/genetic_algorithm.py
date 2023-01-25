from general_solver_functions_access_custom import calculate_board_fitness_single

from general_solver_functions_access import board_random_initialization
from general_solver_functions_access import board_random_mutation

from genetic_algorithm_functions import tournament_selection
from genetic_algorithm_functions import exchange_random_row

from buffered_gather import buffered_gather

from logger import setup_logger

from copy import deepcopy
import itertools
import random
import os

logger = setup_logger(logger_name=os.path.basename(__file__).split(".")[0])


async def random_decision(probability: float) -> bool:

    """Random Decision

    This function is used to decide if a random event based on a probability should or not occur.

    Args:
        probability (float): The probability of the event occurrence.

    Returns:
        bool: Indicates if the random event based on the probability should or not occur.
    """

    occurrence = random.uniform(0, 1)

    if occurrence > probability:
        return False

    else:
        return True


async def crossover(
    filled_board: list, population: list, crossover_probability: float
) -> list:

    """Crossover

    This function create two new boards exchanging one of their rows depending on it's crossover probability.

    Args:
        filled_board (list): A full filled board representation.
        population (list): All the current population.
        crossover_probability (float): The crossover probability of the individual.

    Returns:
        list: The crossover board or a None if the board dosn't mutate.
    """

    occurrence = await random_decision(probability=crossover_probability)

    if occurrence is True:

        crossover_individual = await tournament_selection(population=population)
        return await exchange_random_row(filled_board, crossover_individual[1])

    else:

        return None


async def mutate(
    filled_board: list, fixed_numbers_board: list, mutation_probability: float
) -> list:

    """Mutate

    This function create a new board mutating the original board based on it's mutation probability.

    Args:
        filled_board (list): A full filled board representation.
        fixed_numbers_board (list): A board representation that includes just the fixed numbers.
        mutation_probability (float): The mutation probability of the individual.

    Returns:
        list: The mutated board or a None if the board dosn't mutate.
    """

    occurrence = await random_decision(probability=mutation_probability)

    if occurrence is True:

        return await board_random_mutation(
            board=filled_board, fixed_numbers_board=fixed_numbers_board
        )

    else:

        return None


async def solve_using_genetic_algorithm(
    genetic_algorithm_crossover: float,
    genetic_algorithm_generations: int,
    genetic_algorithm_population: int,
    genetic_algorithm_mutation: float,
    zone_height: int,
    zone_length: int,
    board: list,
) -> list:

    """Solve Using Genetic Algorithm

    This function uses a genetic algorithm to solve sudoku boards, its based on chromosomes and threading for solving the board as
    fast as possible avoiding local highs as much as possible.

    Args:
        genetic_algorithm_crossover (float): The crossover probability.
        genetic_algorithm_generations (int): The generations number.
        genetic_algorithm_population (int): The population number.
        genetic_algorithm_mutation (float): The mutation probability.
        zone_height (int): The zones height.
        zone_length (int): The zones length.
        board (list): A full filled board representation.

    Returns:
        list: The best finded board.
    """

    logger.debug(msg=r"starting to solve using genetic algorithm")

    fixed_numbers_board = deepcopy(board)

    population = await buffered_gather(
        [
            board_random_initialization(
                fixed_numbers_board=fixed_numbers_board,
                zone_height=zone_height,
                zone_length=zone_length,
            )
            for _ in itertools.repeat(None, genetic_algorithm_population)
        ]
    )

    population = await buffered_gather(
        [
            calculate_board_fitness_single(
                board=individual, zone_height=zone_height, zone_length=zone_length
            )
            for individual in population
        ]
    )

    for _ in itertools.repeat(None, genetic_algorithm_generations):

        # Creating mutated population.

        mutated_population = await buffered_gather(
            [
                mutate(
                    mutation_probability=genetic_algorithm_mutation,
                    fixed_numbers_board=fixed_numbers_board,
                    filled_board=individual[1],
                )
                for individual in population
            ]
        )

        # Filtering the mutated population.

        mutated_population = [
            mutation
            for mutation in filter(
                lambda mutated_individual: mutated_individual is not None,
                mutated_population,
            )
        ]

        # Ranking the mutated population.

        mutated_population = await buffered_gather(
            [
                calculate_board_fitness_single(
                    zone_height=zone_height,
                    zone_length=zone_length,
                    board=individual,
                )
                for individual in mutated_population
            ]
        )

        # Craeting crossover population.

        population_copy = deepcopy(population)

        crossover_population = await buffered_gather(
            [
                crossover(
                    crossover_probability=genetic_algorithm_crossover,
                    population=population_copy,
                    filled_board=individual[1],
                )
                for individual in population
            ]
        )

        # Filtering the crossover population.

        crossover_population = [
            crossover
            for crossover in filter(
                lambda mutated_individual: mutated_individual is not None,
                crossover_population,
            )
        ]

        # Ranking the crossover population.

        crossover_population = await buffered_gather(
            [
                calculate_board_fitness_single(
                    zone_height=zone_height,
                    zone_length=zone_length,
                    board=individual,
                )
                for individual in crossover_population
            ]
        )

        # Extending and sorting population by individuals rank.

        population.extend(crossover_population)
        population.extend(mutated_population)

        population = sorted(
            population, key=lambda individual: individual[0], reverse=False
        )

        # Removing the not apt individuals.

        population = population[:genetic_algorithm_population]

        # Increasing generations counter.

    logger.debug(msg=r"ending to solve using genetic algorithm")

    return population[0][1]
