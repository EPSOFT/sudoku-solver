from asyncio.tasks import gather
import os


async def buffered_gather(promises_array: list) -> list:

    """Buffered Gather

    This function recives a list of promiese, and then make the requiered tasks using a buffer defined by an
    environment variable.

    Args:
        promises_array (list): A list with promises.

    Returns:
        list: A list with the promiese solution.
    """

    buffer_size = int(os.environ["BUFFER_SIZE"])
    buffered_promises_array = list()
    responses = list()

    for index in range(0, len(promises_array), buffer_size):
        buffered_promises_array.append(promises_array[index : index + buffer_size])

    for promises_array in buffered_promises_array:
        responses.extend(await gather(*promises_array))

    return responses
