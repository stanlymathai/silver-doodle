import React, { useContext } from "react";

import { GlobalContext } from "../../context/Index";
import { ReactionView } from "../Action/Overview";

import "./Style.scss";

export const ArticleOverview = () => {
    const globalStore: any = useContext(GlobalContext);
    const totalCount: number = globalStore.totalCount

    return (
        <div className="article-overview">
            {totalCount > 0 && <div className="reactions-count">{ReactionView()}</div>}
            {totalCount > 0 && <div className="comments-count">{totalCount} Comment{totalCount != 1 && "s"}</div>}
        </div>
    )
}