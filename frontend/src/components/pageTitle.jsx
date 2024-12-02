import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import PropTypes from "prop-types";

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <Helmet title={title} />;
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
