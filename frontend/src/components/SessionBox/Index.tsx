import React, { useContext } from "react";

import "./Style.scss";

import { Loader } from "../Loader/Index"
import { ReactionBar } from "./ReactionBar";
import { DiscussionBox } from "./DiscussionBox/Index";
import { ArticleOverview } from "./ArticleOverview";
import { GlobalContext } from "../../context/Index";

export const SessionBox = () => {
  const globalStore: any = useContext(GlobalContext);
  const loading = globalStore.isLoading
  const showDiscussionBox =
    globalStore.showDiscussionBox && !loading

  return (
    <div className="cs-wrapper">
      {!loading && <ArticleOverview />}
      <ReactionBar />
      {loading && <Loader />}
      {showDiscussionBox && <DiscussionBox />}
    </div>
  );
};