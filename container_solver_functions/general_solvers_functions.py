from random import randrange
from copy import deepcopy


def calculate_board_fitness_single(
    board: list, zone_height: int, zone_length: int
) -> int:

    """Calculate Board Fitness Single

    This function calculates and returns the summation of all the collisions on a board.

    Args:
        board (list): A full filled board representation.
        zone_height (int): The zones height.
        zone_length (int): The zones length.

    Returns:
        int: Total collisions on the board.
    """

    collisions = 0

    for row in range(len(board)):
        row_set = set()
        for column in range(len(board[row])):
            row_set.add(board[row][column])
        row_repetitions = abs(len(board[row]) - len(row_set))
        collisions += row_repetitions

    for row in range(len(board)):
        column_set = set()
        for column in range(len(board[row])):
            column_set.add(board[column][row])
        column_repetitions = abs(len(board[row]) - len(column_set))
        collisions += column_repetitions

    for row in range(0, len(board), zone_height):
        for column in range(0, len(board[row]), zone_length):
            zone_set = set()
            for i in range(zone_height):
                sub1 = board[row + i][column : column + zone_length]
                zone_set.update(set(sub1))
            zone_repetitions = abs((zone_length * zone_height) - len(zone_set))
            collisions += zone_repetitions

    return collisions


def calculate_board_fitness_report(
    board: list, zone_height: int, zone_length: int
) -> list:

    """Calculate Board Fitness Report

    This function calculates all the collisions on a board and returns the count separated by total, zone, row and column.

    Args:
        board (list): A full filled board representation.
        zone_height (int): The zones height.
        zone_length (int): The zones length.

    Returns:
        int: Total collisions on the board.
        int: Total collisions on the board zones.
        int: Total collisions on the board rows.
        int: Total collisions on the board columns.
    """

    row_collisions, column_collisions, zone_collisions = 0, 0, 0

    for row in range(len(board)):
        row_set = set()
        for column in range(len(board[row])):
            row_set.add(board[row][column])
        row_repetitions = abs(len(board[row]) - len(row_set))
        row_collisions += row_repetitions

    for row in range(len(board)):
        column_set = set()
        for column in range(len(board[row])):
            column_set.add(board[column][row])
        column_repetitions = abs(len(board[row]) - len(column_set))
        column_collisions += column_repetitions

    for row in range(0, len(board), zone_height):
        for column in range(0, len(board[row]), zone_length):
            zone_set = set()
            for i in range(zone_height):
                sub1 = board[row + i][column : column + zone_length]
                zone_set.update(set(sub1))
            zone_repetitions = abs((zone_length * zone_height) - len(zone_set))
            zone_collisions += zone_repetitions

    total_collisions = zone_collisions + row_collisions + column_collisions

    return total_collisions, zone_collisions, row_collisions, column_collisions


def board_random_initialization(
    fixed_numbers_board: list, zone_height: int, zone_length: int
) -> list:

    """Board Random Initialization

    This function initializes a board that is not full filled, it checks the number range of the rows, columns and zones based on
    the product of the zone measure for filling the white positions with numbers on the range that are not in the row, this
    function fill the board row by row, it does not care the columns, the function just check when filling that the numbers in the
    rows are not repeated, in this way the collision of the board rows are zero since the board initialization.

    Args:
        fixed_numbers_board (list): A board representation that includes just the fixed numbers.
        zone_height (int): The zones height.
        zone_length (int): The zones length.

    Returns:
        list: A full filled board representation.
    """

    filled_board = deepcopy(fixed_numbers_board)

    for row_index in range(len(filled_board)):
        for column_index in range(len(filled_board[row_index])):
            if filled_board[row_index][column_index] == 0:
                while True:
                    new_number = randrange(1, (zone_height * zone_length) + 1)
                    if new_number not in filled_board[row_index]:
                        filled_board[row_index][column_index] = new_number
                        break

    return filled_board


def board_random_mutation(board: list, fixed_numbers_board: list) -> list:

    """Board Random Mutation

    This function mutates a board representation, the mutation that makes this functions consist in select one random row first,
    after select the row the function select two random positions of the selected row (columns) and exchange its positions, the
    positions that the function select in the row have one restriction, the selected positions can not be filled with a fixed
    number.

    Args:
        board (list): A full filled board representation.
        fixed_numbers_board (list): A board representation that includes just the fixed numbers.

    Returns:
        list: A full filled board representation with a mutation in one of its rows.
    """

    row_index = randrange(len(board))

    while True:
        column_index_1 = randrange(len(board[row_index]))
        if fixed_numbers_board[row_index][column_index_1] == 0:
            number_1 = deepcopy(board[row_index][column_index_1])
            break

    while True:
        column_index_2 = randrange(len(board[row_index]))
        if fixed_numbers_board[row_index][column_index_2] == 0:
            number_2 = deepcopy(board[row_index][column_index_2])
            break

    board[row_index][column_index_1] = number_2
    board[row_index][column_index_2] = number_1

    return board
