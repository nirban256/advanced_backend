// it is done so that it can be used in all the files where it is required without writing the code for mutiple times.

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

// export { asyncHandler };


// another way of writing the above function is to use Promise resolve and reject.

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err)); // if the promise is resolved then it will call the next function otherwise it will call the next function with the error.
    }
}

export { asyncHandler };