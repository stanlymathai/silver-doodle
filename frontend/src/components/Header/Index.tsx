import React, { useContext } from "react";

import { GlobalContext } from "../../context/Provider";

import "./Style.scss"

const Header = () => {
    const INITIAL_FETCH = 10
    const globalStore: any = useContext(GlobalContext);
    const previosComments: number = globalStore.totalCount - INITIAL_FETCH;
    const showLoadMore =
        previosComments > 0 && globalStore.data.length < globalStore.totalCount;

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