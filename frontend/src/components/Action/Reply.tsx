import React, { useContext } from "react";
import { GlobalContext } from "../../context/Provider";

import moment from "moment";

interface IInfo {
    comId: string;
    timeStamp?: string;
    replyComponent?: boolean | undefined;
}

const ReplyButton = (info: IInfo) => {
    const globalStore: any = useContext(GlobalContext);

    return (
        <div className="replyBtn">
            <span className="vertical-line" />
            {!info.replyComponent && (
                <span
                    className="reply-btn-text"
                    onClick={() => globalStore.handleReply(info.comId)}
                >
                    Reply
                </span>
            )}
            <span className="published-time-text">
                {moment(info.timeStamp).fromNow()}
            </span>
        </div>
    );
};

export default ReplyButton;
