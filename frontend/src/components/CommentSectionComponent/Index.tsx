import React from "react";

import "./Style.scss";

import DiscussionBox from "./DiscussionBox";
import ReactionBox from "../ReactionBox/Index";
import ArticleOverview from "../ArticleOverview/Index";


const CommentSection = () => {

  return (
    <div className="cs-wrapper">
      <ArticleOverview />
      <ReactionBox />
      <DiscussionBox />
    </div>
  );
};

export default CommentSection;
