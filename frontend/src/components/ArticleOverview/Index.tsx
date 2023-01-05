import React, { useContext } from "react";

import { GlobalContext } from "../../context/Index";
import { ReactionView } from "../Action/Overview";

import "./Style.scss";

export const ArticleOverview = () => {
    const globalStore: any = useContext(GlobalContext);
    const totalComments: number = globalStore.totalCount

    return (
        <div className={totalComments > 0 ? "article-overview" : "hidden"}>
            {ReactionView(globalStore.article.reactionCount)}
            {<div className="comments-count">{totalComments} Comment{totalComments != 1 && "s"}</div>}
        </div>
    )
}