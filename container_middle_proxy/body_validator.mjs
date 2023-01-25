import print_log from "./general_utilities.mjs";

const script_firm = "bvl";

/**
 * This function check that all the elements on the board are numbers and are in range.
 *
 * @param request_body {object} The original request body.
 * @param board_dimensions {number} A number that indicates the length of the columns, rows an the product of the zones measures.
 * @returns {object} A boolean that indicates if the rows are valid or not and a message.
 */
function check_board_elements(request_body, board_dimensions) {
    let valid_request_body = true;
    let message = null;

    for (
        let row_index = 0; row_index < request_body.initial_board.length; row_index++
    ) {
        if (valid_request_body == true) {
            for (
                let column_index = 0; column_index < request_body.initial_board.length; column_index++
            ) {
                let board_element = request_body.initial_board[row_index][column_index];
                if (valid_request_body == true) {
                    if (Number.isInteger(board_element) == false) {
                        message = `the board have an element that isn't a number: ${board_element} isn't a number, data type ${typeof board_element}`;
                        print_log(message, script_firm);
                        valid_request_body = false;
                        break;
                    }
                }
                if (valid_request_body == true) {
                    if (board_element != 0) {
                        if (board_element > board_dimensions || board_element < 1) {
                            message = `the board have a number out of range: ${board_element} isn't in range of ${1} and ${board_dimensions}`;
                            print_log(message, script_firm);
                            valid_request_body = false;
                            break;
                        }
                    }
                }
            }
        } else {
            break;
        }
    }

    return [valid_request_body, message];

}

/**
 * A function that check if the columns of the board are or not correct.
 *
 * @param request_body {object} The original request body.
 * @returns {object} A boolean that indicates if the rows are valid or not and a message.
 */
function check_board_columns(request_body) {
    let valid_request_body = true;
    let message = null;

    for (
        let row_index = 0; row_index < request_body.initial_board.length; row_index++
    ) {
        if (valid_request_body == true) {
            let col_dict = new Object();
            for (
                let column_index = 0; column_index < request_body.initial_board.length; column_index++
            ) {
                let current_number = request_body.initial_board[column_index][row_index];
                if (current_number != 0 && !(current_number in col_dict)) {
                    col_dict[current_number] = [row_index, column_index];
                } else if (current_number != 0 && current_number in col_dict) {
                    message = `the board have a fixed number repeated: ${current_number} is in te position (${col_dict[current_number][0]}, ${col_dict[current_number][1]}) and (${row_index}, ${column_index})`;
                    print_log(message, script_firm);
                    valid_request_body = false;
                    break;
                }
            }
        } else {
            break;
        }
    }

    return [valid_request_body, message];

}

/**
 * A function that check if the rows of the board are or not correct.
 *
 * @param request_body {object} The original request body.
 * @returns {object} A boolean that indicates if the rows are valid or not and a message.
 */
function check_board_rows(request_body) {
    let valid_request_body = true;
    let message = null;

    for (
        let row_index = 0; row_index < request_body.initial_board.length; row_index++
    ) {
        if (valid_request_body == true) {
            let row_dict = new Object();
            for (
                let column_index = 0; column_index < request_body.initial_board.length; column_index++
            ) {
                let current_number = request_body.initial_board[row_index][column_index];
                if (current_number != 0 && !(current_number in row_dict)) {
                    row_dict[current_number] = [row_index, column_index];
                } else if (current_number != 0 && current_number in row_dict) {
                    message = `the board have a fixed number repeated: ${current_number} is in the position (${row_dict[current_number][0]}, ${row_dict[current_number][1]}) and (${row_index}, ${column_index})`;
                    print_log(message, script_firm);
                    valid_request_body = false;
                    break;
                }
            }
        } else {
            break;
        }
    }

    return [valid_request_body, message];

}

/**
 * This function makes all the request body necessary validations, it returns  a status message that indicates if the request body
 * is accepted or rejected and why and a boolean that indicates if the request body is or not valid.
 *
 * @param request_body {object} The original request body.
 * @returns {object} A list with the status message from the validator and a boolean that indicates if the body is or not correct.
 */
export default function check_body_request_mandatory_requirements(request_body) {
    print_log("starting request body validations", script_firm);

    // Control vars declarations.

    let valid_request_body, message;

    // Body general validations and use vars declarations.

    try {
        var request_body_keys = Object.keys(request_body);
        var necessary_fields_in_request = [
            "initial_board",
            "zone_length",
            "zone_height",
        ];
        print_log(
            "request body checked successfully, the request body is a dict",
            script_firm
        );
        valid_request_body = true;
    } catch (error) {
        message = "request body check unsuccessfully, the request body isn't a dict";
        print_log(message, script_firm);
        valid_request_body = false;
    }

    // Mandatory parameters existanse validations.

    if (valid_request_body == true) {
        if (
            necessary_fields_in_request.every((elem) =>
                request_body_keys.includes(elem)
            ) == true
        ) {
            print_log("the request body have all the necesary labels", script_firm);
        } else {
            message = "the request body dosn't have all the necessary labels";
            print_log(message, script_firm);
            valid_request_body = false;
        }
    }

    // Mandatory parameters type validations.

    if (valid_request_body == true) {
        if (Array.isArray(request_body.initial_board) == true) {
            print_log(
                "the variable initial_board has the correct data type",
                script_firm
            );
        } else {
            message = "the variable initial_board hasn't the correct data type";
            print_log(message, script_firm);
            valid_request_body = false;
        }
    }
    if (valid_request_body == true) {
        if (Number.isInteger(request_body.zone_length) == true) {
            print_log(
                "the variable zone_length has the correct data type",
                script_firm
            );
        } else {
            message = "the variable zone_length hasn't the correct data type";
            print_log(message, script_firm);
            valid_request_body = false;
        }
    }
    if (valid_request_body == true) {
        if (Number.isInteger(request_body.zone_height) == true) {
            print_log(
                "the variable zone_height has the correct data type",
                script_firm
            );
        } else {
            message = "the variable zone_height hasn't the correct data type";
            print_log(message, script_firm);
            valid_request_body = false;
        }
    }
    if (valid_request_body == true) {
        if (request_body.zone_length > 0) {
            print_log("the variable zone_length is positive", script_firm);
        } else {
            message = "the variable zone_length needs to be positive";
            print_log(message, script_firm);
            valid_request_body = false;
        }
    }
    if (valid_request_body == true) {
        if (request_body.zone_height > 0) {
            print_log("the variable zone_height is positive", script_firm);
        } else {
            message = "the variable zone_height needs to be positive";
            print_log(message, script_firm);
            valid_request_body = false;
        }
    }

    // Board dimensions validations.

    const board_dimensions = request_body.zone_height * request_body.zone_length;

    if (valid_request_body == true) {
        if (board_dimensions >= process.env.MIN_BOARD_SIZE) {
            print_log(
                "the board size is over or equal to the minimum supported size",
                script_firm
            );
        } else {
            message = `the board size is not over or equal to the minimum supported size, the minimum supported size is ${process.env.MIN_BOARD_SIZE}x${process.env.MIN_BOARD_SIZE} and the board is ${board_dimensions}x${board_dimensions}`;
            print_log(message, script_firm);
            valid_request_body = false;
        }
    }
    if (valid_request_body == true) {
        if (board_dimensions <= process.env.MAX_BOARD_SIZE) {
            print_log(
                "the board size is less or equal to the maximum supported size",
                script_firm
            );
        } else {
            message = `the board size is not less or equal to the maximum supported size, the maximum supported size is ${process.env.MAX_BOARD_SIZE}x${process.env.MAX_BOARD_SIZE} and the board is ${board_dimensions}x${board_dimensions}`;
            print_log(message, script_firm);
            valid_request_body = false;
        }
    }
    if (valid_request_body == true) {
        if (request_body.initial_board.length == board_dimensions) {
            print_log("the board columns dimensions are correct", script_firm);
        } else {
            message = "the board columns dimensions aren't correct";
            print_log(message, script_firm);
            valid_request_body = false;
        }
    }
    if (valid_request_body == true) {
        let board_lenght_summation = 0;
        request_body.initial_board.forEach(function (board_row) {
            board_lenght_summation += board_row.length;
        });
        if (board_lenght_summation / board_dimensions == board_dimensions) {
            print_log("the board rows dimensions are correct", script_firm);
        } else {
            message = "the board rows dimensions aren't correct";
            print_log(message, script_firm);
            valid_request_body = false;
        }
    }

    // Board elements validations.

    if (valid_request_body == true) {
        [valid_request_body, message] = check_board_elements(
            request_body,
            board_dimensions
        );
    }
    if (valid_request_body == true) {
        print_log("all the board dimensions are correct", script_firm);
    }

    // Checking if the board can be solved.

    if (valid_request_body == true) {
        [valid_request_body, message] = check_board_rows(request_body);
    }
    if (valid_request_body == true) {
        [valid_request_body, message] = check_board_columns(request_body);
    }
    if (valid_request_body == true) {
        print_log("the board can be solved", script_firm);
    }

    // end message.

    if (valid_request_body == true) {
        print_log("request body validation end successfully", script_firm);
    } else if (valid_request_body == false) {
        print_log("request body validation dosn't end successfully", script_firm);
    }

    return [valid_request_body, message];

}