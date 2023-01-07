import React, { useContext } from "react";

import "./Style.scss";

import { Loader } from "../Loader/Index"
import { ReactionBox } from "./ReactionBox/Index";
import { GlobalContext } from "../../context/Index";
import { DiscussionBox } from "./DiscussionBox/Index";

export const SessionBox = () => {
  const globalStore: any = useContext(GlobalContext);
  const loading = globalStore.isLoading
  const showDiscussionBox =
    globalStore.showDiscussionBox && !loading

  return (
    <div className="cs-wrapper">
      <ReactionBox />
      {loading && <Loader />}
      {showDiscussionBox && <DiscussionBox />}
    </div>
  );
};