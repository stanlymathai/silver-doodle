import React, { useContext } from "react";

import "./Style.scss";

import Loader from "../Loader/Index"
import DiscussionBox from "./DiscussionBox";
import ReactionBar from "../ReactionBar/Index";
import ArticleOverview from "../ArticleOverview/Index";
import { GlobalContext } from "../../context/Provider";


const CommentSection = () => {
  const globalStore: any = useContext(GlobalContext);
  const showDiscussionBox =
    globalStore.showDiscussionBox && !globalStore.loading

  return (
    <div className="cs-wrapper">
      <ArticleOverview />
      <ReactionBar />
      {globalStore.loading && <Loader />}
      {showDiscussionBox && <DiscussionBox />}
    </div>
  );
};

export default CommentSection;
