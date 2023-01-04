import React, { useContext } from "react";

import "./Style.scss";

import Loader from "../Loader/Index"
import DiscussionBox from "./DiscussionBox";
import { ReactionBar } from "../ReactionBar/Index";
import ArticleOverview from "../ArticleOverview/Index";
import { GlobalContext } from "../../context/Provider";


export const SessionBox = () => {
  const globalStore: any = useContext(GlobalContext);
  const loading = globalStore.loading
  const showDiscussionBox =
    globalStore.showDiscussionBox && !loading

  return (
    <div className="cs-wrapper">
      <ArticleOverview />
      <ReactionBar />
      {loading && <Loader />}
      {showDiscussionBox && <DiscussionBox />}
    </div>
  );
};