from general_solvers_functions import calculate_board_fitness_report
from general_solvers_functions import calculate_board_fitness_single
from general_solvers_functions import board_random_initialization
from general_solvers_functions import board_random_mutation

from logger import setup_logger

from aiohttp.web_request import Request
from aiohttp import web
from json import dumps
from os import environ
import os

api_routes = web.RouteTableDef()
api = web.Application()

logger = setup_logger(logger_name=os.path.basename(__file__).split(".")[0])


async def check_request_mandatory_requirements(request: Request) -> bool:

    """Check Request Mandatory Requirements

    This function is the incharge of checking if the requests made to any path of this api have all the mandatory requirements, its
    main function is to check the security parameters as the Authorization.

    Args:
        request (Request): An http request made from any solver for accessing any solver general function.

    Returns:
        bool: A boolean that indicates if the request is valid or not.
    """

    logger.debug(msg=r"starting request headers and body validations")

    # Request general validations.

    try:
        await request.json()
        request_header_keys = [key for key in request.headers.keys()]
        api_key = str(environ["ACCESS_KEY"])
        request_headers = request.headers
        continue_process = True
        logger.debug(msg=r"the request headers and body are correct")

    except:
        continue_process = False
        logger.exception(msg=r"the request headers and body are not correct")

    # Authorization header validations.

    if continue_process is True:
        if "Authorization" in request_header_keys:
            logger.debug(msg=r"the authorization header exists")
        else:
            logger.warn(msg=r"the authorization header dosn't exists")
            continue_process = False

    if continue_process is True:
        if api_key == request_headers["Authorization"]:
            logger.debug(msg=r"the authorization header is valid")
        else:
            logger.warn(msg=r"the authorization header isn't valid")
            continue_process = False

    return continue_process


@api_routes.get(r"/calculate_board_fitness_single")
async def get_board_fitness_single(request: Request) -> web.Response:

    """Get Board Fitness Single

    This function calculates and packages the count of all the collisions on the board in a json file on the response body.

    Args:
        request (Request): An http request made from any solver for accessing this functionality.

    Returns:
        web.Response: The response of the api, 400 for unauthorized requests, 500 if the api fails or 200 with the response in a
        json body if everything goes right.
    """

    try:

        logger.debug(msg=r"new request recived at: /calculate_board_fitness_single")

        continue_process = await check_request_mandatory_requirements(request)

        if continue_process is True:

            request_body = await request.json()

            fitness_score = calculate_board_fitness_single(
                zone_height=request_body["zone_height"],
                zone_length=request_body["zone_length"],
                board=request_body["board"],
            )

            response_dict = {
                "fitness_score": fitness_score,
            }

            headers = {"Content-Type": "application/json"}

            return web.Response(
                body=dumps(obj=response_dict, indent=None),
                headers=headers,
                status=200,
            )

        else:
            return web.Response(
                status=400,
            )

    except:

        logger.exception(msg=r"exception in the calculate_board_fitness_single api")

        return web.Response(
            status=500,
        )


@api_routes.get(r"/calculate_board_fitness_report")
async def get_board_fitness_report(request: Request) -> web.Response:

    """Get Board Fitness Report

    This function calculates the count of all the collisions on the board separating them by the collision type an packages them
    in a json file on the response body.

    Args:
        request (Request): An http request made from any solver for accessing this functionality.

    Returns:
        web.Response: The response of the api, 400 for unauthorized requests, 500 if the api fails or 200 with the response in a
        json body if everything goes right.
    """

    try:

        logger.debug(msg=r"new request recived at: /calculate_board_fitness_report")

        continue_process = await check_request_mandatory_requirements(request)

        if continue_process is True:

            request_body = await request.json()

            (
                total_collisions,
                zone_collisions,
                row_collisions,
                column_collisions,
            ) = calculate_board_fitness_report(
                zone_height=request_body["zone_height"],
                zone_length=request_body["zone_length"],
                board=request_body["board"],
            )

            response_dict = {
                "column_collisions": column_collisions,
                "total_collisions": total_collisions,
                "zone_collisions": zone_collisions,
                "row_collisions": row_collisions,
            }

            headers = {"Content-Type": "application/json"}

            return web.Response(
                body=dumps(obj=response_dict, indent=None),
                headers=headers,
                status=200,
            )

        else:
            return web.Response(
                status=400,
            )

    except:

        logger.exception(msg=r"exception in the calculate_board_fitness_report api")

        return web.Response(
            status=500,
        )


@api_routes.get(r"/board_random_initialization")
async def get_random_initialization(request: Request) -> web.Response:

    """Get Random Initialization

    This function initializes a board with empty spaces and package the full filled board in the response body.

    Args:
        request (Request): An http request made from any solver for accessing this functionality.

    Returns:
        web.Response: The response of the api, 400 for unauthorized requests, 500 if the api fails or 200 with the response in a
        json body if everything goes right.
    """

    try:

        logger.debug(msg=r"new request recived at: /board_random_initialization")

        continue_process = await check_request_mandatory_requirements(request)

        if continue_process is True:

            request_body = await request.json()

            board = board_random_initialization(
                fixed_numbers_board=request_body["fixed_numbers_board"],
                zone_height=request_body["zone_height"],
                zone_length=request_body["zone_length"],
            )

            response_dict = {
                "board": board,
            }

            headers = {"Content-Type": "application/json"}

            return web.Response(
                body=dumps(obj=response_dict, indent=None),
                headers=headers,
                status=200,
            )

        else:
            return web.Response(
                status=400,
            )

    except:

        logger.exception(msg=r"exception in the board_random_initialization api")

        return web.Response(
            status=500,
        )


@api_routes.get(r"/board_random_mutation")
async def get_random_mutation(request: Request) -> web.Response:

    """Get Random Mutation

    This function mutate and package the mutated board in the response body.

    Args:
        request (Request): An http request made from any solver for accessing this functionality.

    Returns:
        web.Response: The response of the api, 400 for unauthorized requests, 500 if the api fails or 200 with the response in a
        json body if everything goes right.
    """

    try:

        logger.debug(msg=r"new request recived at: /board_random_mutation")

        continue_process = await check_request_mandatory_requirements(request)

        if continue_process is True:

            request_body = await request.json()

            board = board_random_mutation(
                fixed_numbers_board=request_body["fixed_numbers_board"],
                board=request_body["board"],
            )

            response_dict = {
                "board": board,
            }

            headers = {"Content-Type": "application/json"}

            return web.Response(
                body=dumps(obj=response_dict, indent=None),
                headers=headers,
                status=200,
            )

        else:
            return web.Response(
                status=400,
            )

    except:

        logger.exception(msg=r"exception in the board_random_mutation api")

        return web.Response(
            status=500,
        )


api.add_routes(api_routes)
web.run_app(app=api, port=int(environ["ACCESS_PORT"]))
