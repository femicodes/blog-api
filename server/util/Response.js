/**
 * @class Response
 */
class Response {
  /**
   * @static
   * @param {*} res
   * @param {*} code
   * @param {*} message
   * @returns {json} json
   */
  static error(res, code, message) {
    return res.status(code).json({
      status: code,
      errors: {
        message,
      },
    });
  }

  /**
   * @static
   * @param {*} res
   * @param {*} code
   * @param {*} payload
   * @param {*} message
   * @returns {object} object
   * @memberof Response
   */
  static success(res, code, data, message = 'success') {
    return res.status(code).json({
      status: code,
      message,
      data,
    });
  }
}

export default Response;
