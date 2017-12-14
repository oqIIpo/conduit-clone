import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { fetchArticles, fetchArticle } from "../actions/";
import { getArticles, getCurrTab } from "../reducers/";
import View from "./View";

class Articles extends Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { currTab: prevCurrTab } = prevProps;
    const { currTab: currCurrTab } = this.props;
    if (
      prevCurrTab.type !== currCurrTab.type ||
      prevCurrTab.pagination.page !== currCurrTab.pagination.page ||
      prevCurrTab.tag !== currCurrTab.tag
    ) {
      this.fetchData();
    }
  }

  fetchData() {
    const { fetchArticles, currTab } = this.props;
    const { pagination: { limit, page } } = currTab;
    const params = {
      limit,
      offset: limit * page
    };
    let endpoint = "/api/articles";
    if (currTab.type === "feed") {
      endpoint = "/api/articles/feed";
    }
    if (currTab.type === "user") params["user"] = currTab.user;
    if (currTab.type === "tag") params["tag"] = currTab.tag;
    return fetchArticles(endpoint, params);
  }

  render() {
    const { onArticleClick } = this.props;
    return <View {...this.props} />;
  }
}

Articles.propTypes = {
  currTab: PropTypes.object
};
const mapStateToProps = (state, ownProps) => {
  return {
    currTab: getCurrTab(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetchArticles: (...params) => dispatch(fetchArticles(...params)),
    onArticleClick: slug => {
      dispatch(fetchArticle(slug));
      dispatch(push(`/article/${slug}`));
    }
  };
};

Articles = connect(mapStateToProps, mapDispatchToProps)(Articles);

export default Articles;
