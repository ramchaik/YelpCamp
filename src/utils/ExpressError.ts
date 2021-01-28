class ExpressError extends Error {
  constructor(public message: string, public statusCode: number) {
    super();
  }
}

export { ExpressError };
