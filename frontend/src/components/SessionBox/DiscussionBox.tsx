import React from "react";
import { useContext } from "react";

import { GlobalContext } from "../../context/Index";

import InputField from "../InputField/Index";
import { CommentBody } from "../CommentBody/Index";
import CommentHeader from "../CommentHeader/Index";

export const DiscussionBox = () => {
    const globalStore: any = useContext(GlobalContext);

    return (
        <div className="cs-overlay">
            <CommentHeader />
            <InputField />
            {globalStore.data.map(
                (i: {
                    text: string;
                    comId: string;
                    userId: string;
                    fullName: string;
                    avatarUrl: string;
                    timeStamp: string;
                    replies: Array<any>;
                    reaction: {
                        like: boolean;
                        brilliant: boolean;
                        thoughtful: boolean;
                    };
                }) => {
                    return (
                        <div className="main-thread" key={i.comId}>
                            <CommentBody
                                info={i}
                                replyMode={globalStore.replyThreadId == i.comId}
                            />
                            {i.replies &&
                                i.replies.length > 0 &&
                                i.replies.map((j) => {
                                    return (
                                        <div className="reply-section" key={j.comId}>
                                            <CommentBody
                                                info={j}
                                                parentId={i.comId}
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    );
                }
            )}
        </div>
    );
}; 
