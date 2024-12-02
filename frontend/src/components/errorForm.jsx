import PropTypes from "prop-types";

const ErrorForm = ({ error }) => {
  return error !== "" ? <span className="text-red-500 text-3xs font-medium">{error}</span> : null;
};

ErrorForm.propTypes = {
  error: PropTypes.string,
};

export default ErrorForm;
