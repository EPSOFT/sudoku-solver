import print_log from "./general_utilities.mjs";

const script_firm = "hvl";

/**
 * This function makes all the request header necessary validations, it returns  a status message that indicates if the request 
 * header is accepted or rejected and why and a boolean that indicates if the request header is or not valid.
 * 
 * @param request_header {object} The original request header.
 * @returns {object} A list with the status message from the validator and a boolean that indicates if the header is or not correct.
 */
export default function check_header_request_mandatory_requirements(request_header) {

    print_log("starting request header validations", script_firm);

    // Control vars declarations.

    let valid_request_header, message;

    // Header general validations and use vars declarations.

    try {
        var request_header_keys = Object.keys(request_header);
        var necessary_fields_in_request = ["authorization"];
        print_log(
            "request header checked successfully, the request header is a dict",
            script_firm
        );
        valid_request_header = true;
    } catch (error) {
        message =
            "request header check unsuccessfully, the request body isn't a dict";
        print_log(message, script_firm);
        valid_request_header = false;
    }

    // Mandatory parameters existanse validations.

    if (valid_request_header == true) {
        if (
            necessary_fields_in_request.every((elem) =>
                request_header_keys.includes(elem)
            ) == true
        ) {
            print_log("the request header have all the necesary labels", script_firm);
        } else {
            message = "the request header dosn't have all the necessary labels";
            print_log(message, script_firm);
            valid_request_header = false;
        }
    }

    // Mandatory parameters type validations.

    if (valid_request_header == true) {
        if (typeof request_header.authorization == "string") {
            print_log(
                "the variable authorization has the correct data type",
                script_firm
            );
        } else {
            message = "the variable authorization hasn't the correct data type";
            print_log(message, script_firm);
            valid_request_header = false;
        }
    }

    // Authorization validation.

    if (valid_request_header == true) {
        if (request_header.authorization == process.env.ACCESS_KEY) {
            print_log("the authorization is valid", script_firm);
        } else {
            message = "the authorization isn't valid";
            print_log(message, script_firm);
            valid_request_header = false;
        }
    }

    return [valid_request_header, message];

}