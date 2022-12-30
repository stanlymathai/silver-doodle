import React, { useContext } from "react";

import { GlobalContext } from "../../context/Provider";

import "./Style.scss"

const Header = () => {
    const globalStore: any = useContext(GlobalContext);
    const previosComments = globalStore.totalCount - 10;
    const showLoadMore =
        previosComments > 0 && globalStore.data.length != globalStore.totalCount;

    return (
        <div className="session-header">
            {showLoadMore ? (
                <div className="prev-comments" onClick={globalStore.loadMore}>
                    View {previosComments} previous comments
                </div>
            ) : (
                <div>{""}</div>
            )}
            <div className="all-comments">All comments</div>
        </div>
    );
};
export default Header;