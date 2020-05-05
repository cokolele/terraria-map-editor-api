module.exports = function createResponses(res) {
    return {
        generic: (msg) => {
            res.status(200).send(msg);
        },
        success: (msg, data) => {
            res.status(200).json({
                status: "ok",
                message: msg,
                ...data
            });
        },
        successData: (data) => {
            res.status(200).json(data);
        },
        successFile: (path) => {
            res.type("application/octet-stream").status(200).sendFile(path, { maxAge: 2592000000 });
        },
        created: (msg, data) => {
            res.status(201).json({
                status: "ok",
                message: msg,
                ...data
            });
        },
        createdData: (data) => {
            res.status(201).json(data);
        },
        badRequest: (msg = "Unexpected bad request") => {
            res.status(400).json({
                status: "error",
                message: msg
            });
        },
        unauthorized: (msg = "Not authorized") => {
            res.status(401).json({
                status: "error",
                message: msg
            })
        },
        notFound: (msg = "Resource not found") => {
            res.status(404).json({
                status: "error",
                message: msg
            });
        },
        unprocessable: (msg = "Bad request") => {
            res.status(422).json({
                status: "error",
                message: msg
            });
        },
        internalError: (msg = "Unexpected server error") => {
            res.status(500).json({
                status: "error",
                message: msg
            });
        },
        notImplemented: (msg = "Endpoint or method not implemented") => {
            res.status(501).json({
                status: "error",
                message: msg
            });
        },
        serviceUnavailable: (msg = "Unexpected fatal server error. Please try again later") => {
            res.status(500).json({
                status: "error",
                message: msg
            });
        }
    }
}
