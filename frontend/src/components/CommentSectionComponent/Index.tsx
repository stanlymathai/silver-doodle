import React from "react";

import DiscussionBox from "./DiscussionBox";
import ReactionBox from "../ReactionBox/Index";

const CommentSection = () => {

  return (
    <div className="cs-wrapper">
      <ReactionBox />
      <DiscussionBox />
    </div>
  );
};

export default CommentSection;
