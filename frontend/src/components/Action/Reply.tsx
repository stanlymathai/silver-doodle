import React, { useContext } from "react";
import { GlobalContext } from "../../context/Index";

import moment from "moment";

interface IInfo {
    comId: string;
    timeStamp: string;
    replies?: Array<any>
}

export const ReplyButton = (info: IInfo) => {
    const globalStore: any = useContext(GlobalContext);

    return (
        <div className="reply-btn icn-dft">
            <span className="vertical-line" />
            {info.replies && (
                <span
                    className="reply-btn-text"
                    onClick={() => globalStore.handleReply(info.comId)}
                >
                    Reply
                </span>
            )}
            <small className="time-stamp">
                {moment(info.timeStamp).fromNow()}
            </small>
        </div>
    );
};