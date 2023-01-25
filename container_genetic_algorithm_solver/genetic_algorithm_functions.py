from copy import deepcopy
import random


async def tournament_selection(population: list) -> tuple:

    """Roulette Selection

    This function is used to select an individual from all the population based on it's fitness score for making the crossover.

    Args:
        population (list): The probability of the event occurrence.

    Returns:
        tuple: An individual chromosome representation for the crossover.
    """

    tournament_size = len(population) // 2

    if tournament_size == 0:
        tournament_size = 2

    population = sorted(population, key=lambda individual: individual[0])

    tournament_members = population[:tournament_size]

    return random.choice(tournament_members)


async def exchange_random_row(individual_1: list, individual_2: list) -> list:

    """Exchange Random Row

    This function is used for making the crossover between two individuals, in picks a random row an exchange it between the two
    given individuals.

    Args:
        individual_1 (list): The representation of the first individual.
        individual_2 (list): The representation of the second individual.

    Returns:
        tuple: one of the individuals after making the rows exchange.
    """

    exchange_index = random.randrange(len(individual_1))

    individual_1[exchange_index], individual_2[exchange_index] = (
        deepcopy(individual_2[exchange_index]),
        deepcopy(individual_1[exchange_index]),
    )

    return random.choice([individual_1, individual_2])
