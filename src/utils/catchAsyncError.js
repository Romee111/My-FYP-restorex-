

export let catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      console.log(err);
      // Make sure no response has already been sent before calling next()
      if (!res.headersSent) {
        next(err);
      }
    });
  };
};

