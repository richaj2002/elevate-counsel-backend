export const responseRenderer = (res, statusCode, message, data = null, error = null) => {
    const response = {
        success: statusCode >= 200 && statusCode < 300,
        message,
        data,
        error,
        statusCode
    };
    res.status(statusCode).json(response);
};
