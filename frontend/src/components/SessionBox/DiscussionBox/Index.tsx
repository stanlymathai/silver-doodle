import React from "react";
import { useContext } from "react";

import "./Style.scss";

import { Header } from "./Header";
import { CommentBody } from "./CommentBody";
import { ReportMenu } from "../../Action/Report"
import { InputField } from "../../InputField/Index";

import { GlobalContext } from "../../../context/Index";

export const DiscussionBox = () => {
    const globalStore: any = useContext(GlobalContext);

    return (
        <div className="cs-overlay">
            <Header />
            <InputField />
            <div className="report-menu">
                {ReportMenu()}
            </div>
            {globalStore.data.map(
                (i: {
                    text: string;
                    comId: string;
                    fullName: string;
                    avatarUrl: string;
                    timeStamp: string;
                    replies: Array<any>;
                    moderated?: boolean;
                    reaction: {
                        like: boolean;
                        brilliant: boolean;
                        thoughtful: boolean;
                    };
                    reactionCount: number
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
                                            <CommentBody info={j} />
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
