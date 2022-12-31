import React, { useContext } from "react";

import { GlobalContext } from "../../context/Provider";


import reactionView from "../Action/Overview";


import "./Style.scss";

const ArticleOverview = () => {
    const globalStore: any = useContext(GlobalContext);
    const totalCount: number = globalStore.totalCount

    return (
        <div className="article-overview">
            {totalCount > 0 && <div className="reactions-count">{reactionView()}</div>}
            {totalCount > 0 && <div className="comments-count">{totalCount} comment{totalCount != 1 && "s"}</div>}
        </div>
    )
}

export default ArticleOverview