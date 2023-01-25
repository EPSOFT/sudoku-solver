import check_header_request_mandatory_requirements from "./header_validator.mjs";

import check_body_request_mandatory_requirements from "./body_validator.mjs";

import print_log from "./general_utilities.mjs";

import express from "express";
import axios from "axios";

const connection_event_firm = "con";
const script_firm = "api";
const error_firm = "err";
const end_firm = "end";

const api = express();

api.use(express.json());

/**
 * This function is the incharge of act as a proxy in the middle proxy container, it receives as inputs the mandatory parameters 
 * from the original request and uses them for making a new request to the correct solver, it also checks before that the required 
 * solver is working, if it's not working the function returns a 500 error code, if the solver solves the board correctly it 
 * returns a 200 status code and the solved board data, in any other way it returns the response code and a status message from 
 * the respective solver.
 * 
 * @param authorization {string} The needed authorization for use the respective solver.
 * @param body {object} The original request body.
 * @param destination_url {string} The solver url.
 * @param origin_url {string} The url that generates the original request.
 * @param response {express.response} The express response object.
 * @param health_test_url {string} The solver health test url.
 * @returns {express.response} The response from the solver or from the method if the solver fails.
 */
async function proxy_redirect(authorization, body, destination_url, origin_url, response, health_test_url) {

    // Control variables.

    let resume;

    print_log(
        `making server health test using the path: ${health_test_url}`,
        script_firm
    );

    // Health check request.

    try {
        const health_test_response = await axios({
            url: health_test_url,
            method: "get",
            timeout: 0,
        });
        print_log(`reciving response from: ${health_test_url}`, script_firm);
        print_log(`health test code: ${health_test_response.status}`, script_firm);
        if (health_test_response.status == 200) {
            resume = true;
        }
    } catch (error) {
        if (typeof error === "object") {
            print_log(`health test error: ${error.message}`, script_firm);
        }
        print_log(`health test failed to: ${health_test_url}`, script_firm);
        resume = false;
    }

    // Proxy request if health check goes wright.

    if (resume == true) {
        print_log(`starting to solve using: ${destination_url}`, script_firm);
        print_log(`making request to: ${destination_url}`, script_firm);

        const solver_response = await axios({
            headers: {
                "Content-Type": "application/json",
                "Authorization": authorization,
            },
            url: destination_url,
            method: "get",
            data: body,
        }).catch(function (error) {
            print_log(
                `there was an error while requesting to: ${destination_url}`,
                error_firm
            );
            return {
                statusText: "request to solver failed, please use other solver or request it later",
                status: 500,
            };
        });

        print_log(`reciving response from: ${destination_url}`, script_firm);
        print_log(`response code from: ${destination_url} is: ${solver_response.status}`, script_firm);
        print_log(`routing from: ${destination_url} to: ${origin_url}`, script_firm);

        if (solver_response.status == 200) {
            response.statusMessage = "ok";
            return response.status(solver_response.status).json(solver_response.data);
        } else {
            response.statusMessage = solver_response.statusText.toLowerCase();
            return response.status(solver_response.status).end();
        }

    } else if (resume == false) {
        print_log(`failed to solve using: ${destination_url}`, script_firm);
        response.statusMessage = `the requested solver is not currently working, please use other solver or request it later`;
        return response.status(500).end();
    }

}

/**
 * This function acts as an api gateway for the middle proxy, for this reason it receives request in multiple paths and it's only 
 * accessible using http request, this function uses functions from other modules and from this one to validate the request body 
 * and header and reject the request if something goes wrong in the validations or redirect the request if the validation ends 
 * correctly.
 * 
 * @param request {express.request} The express request object.
 * @param response {express.response} The express response object.
 * @returns {express.response} The response from the solver or from the function if the solver fails.
 */
api.get(["/hill_climbing", "/genetic_algorithm", "/simulated_annealing", "/neuronal_network"], async (request, response) => {

    // Try catch for keep the api running even if something goes wrong.

    try {

        print_log(`new request received at: ${request.path}`, script_firm);

        const origin_url = request.protocol + "://" + request.get("host") + request.originalUrl;

        print_log(`request origin url: ${origin_url}`, script_firm);

        // Validating request header.

        const [valid_request_header, header_validation_message] =
        check_header_request_mandatory_requirements(request.headers);

        print_log(
            `request header validation status: ${valid_request_header}`,
            script_firm
        );

        if (valid_request_header == true) {

            // Validating request body.

            const [valid_request_body, body_validation_message] =
            check_body_request_mandatory_requirements(request.body);

            print_log(
                `request body validation status: ${valid_request_body}`,
                script_firm
            );

            if (valid_request_body == true) {

                // Routing variables.

                const original_path = request.path;
                let destination_url, authorization, health_test_url;

                // Redirecting the request using built in proxy function using the original request mandatory parameters.

                if (original_path == "/hill_climbing") {
                    health_test_url = process.env.HILL_CLIMBING_SOLVER_HEALTH_TEST_LINK;
                    destination_url = process.env.HILL_CLIMBING_SOLVER_LINK;
                    authorization = process.env.HILL_CLIMBING_SOLVER_KEY;
                    return proxy_redirect(
                        authorization,
                        request.body,
                        destination_url,
                        origin_url,
                        response,
                        health_test_url
                    );

                } else if (original_path == "/genetic_algorithm") {
                    health_test_url = process.env.GENETIC_ALGORITHM_SOLVER_HEALTH_TEST_LINK;
                    destination_url = process.env.GENETIC_ALGORITHM_SOLVER_LINK;
                    authorization = process.env.GENETIC_ALGORITHM_SOLVER_KEY;
                    return proxy_redirect(
                        authorization,
                        request.body,
                        destination_url,
                        origin_url,
                        response,
                        health_test_url
                    );

                } else if (original_path == "/simulated_annealing") {
                    health_test_url = process.env.HILL_CLIMBING_SOLVER_HEALTH_TEST_LINK;
                    destination_url = process.env.HILL_CLIMBING_SOLVER_LINK;
                    authorization = process.env.HILL_CLIMBING_SOLVER_KEY;
                    return proxy_redirect(
                        authorization,
                        request.body,
                        destination_url,
                        origin_url,
                        response,
                        health_test_url
                    );

                } else if (original_path == "/neuronal_network") {
                    health_test_url = process.env.HILL_CLIMBING_SOLVER_HEALTH_TEST_LINK;
                    destination_url = process.env.HILL_CLIMBING_SOLVER_LINK;
                    authorization = process.env.HILL_CLIMBING_SOLVER_KEY;
                    return proxy_redirect(
                        authorization,
                        request.body,
                        destination_url,
                        origin_url,
                        response,
                        health_test_url
                    );
                }

            } else if (valid_request_body == false) {
                print_log(
                    `request body validation failed: ${body_validation_message}`,
                    script_firm
                );
                response.statusMessage = body_validation_message.toLowerCase();
                return response.status(400).end();
            }

        } else if (valid_request_header == false) {
            print_log(
                `request header validation failed: ${header_validation_message}`,
                script_firm
            );
            response.statusMessage = header_validation_message.toLowerCase();
            return response.status(400).end();
        }

    } catch (error) {
        const error_stack = error.stack.split("\n");
        for (let error_index = 0; error_index < error_stack.length; error_index++) {
            print_log(error_stack[error_index].trim(), error_firm);
        }
        response.statusMessage = "internal server error";
        return response.status(500).end();
    }

});

const server = api.listen(process.env.ACCESS_PORT);

let connections = [];

/**
 * This function is the incharge of manage the connections array, the connections array need to be update for being able to make 
 * a graceful shutdown.
 */
server.on("connection", (connection) => {

    connections.push(connection);
    print_log(
        `a new connection was started, count of active connections: ${connections.length}`,
        connection_event_firm
    );

    connection.on("close", () => {

        connections = connections.filter(
            (current_connection) => current_connection !== connection
        );
        print_log(
            `a connection was closed, count of active connections: ${connections.length}`,
            connection_event_firm
        );

    });

});

/**
 * This function is the incharge of make a graceful shutdown if the container is called to be down while some connections are 
 * active.
 */
process.on("SIGTERM", () => {

    print_log("sigterm signal received, closing http server gracefully", end_firm);

    server.close(() => {
        print_log("http server is closing out remaining connections", end_firm);
        process.exit(0);
    });

    setTimeout(() => {
        print_log(
            "http server could't close remaining connections in time, forcefully shutting down", end_firm
        );
        process.exit(1);
    }, 5000);

    connections.forEach((current_connection) => current_connection.end());
    setTimeout(() => connections.forEach((current_connection) => current_connection.destroy()), 1000);

});