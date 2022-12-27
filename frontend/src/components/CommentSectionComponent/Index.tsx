import React from "react";
import { useContext } from "react";

import _ from "lodash";
import "./CommentSection.scss";

import NoComments from "./NoComments";
import InputField from "../InputField/Index";
import { GlobalContext } from "../../context/Provider";
import CommentStructure from "../CommentStructure/Index";



const CommentSection = () => {
  const globalStore: any = useContext(GlobalContext);

  return (
    <div className="comment-session-overlay">

      <InputField />

      {globalStore.data.length > 0 ? (
        globalStore.data.map(
          (i: {
            userId: string;
            comId: string;
            fullName: string;
            avatarUrl: string;
            text: string;
            timeStamp: string;
            replies: Array<any> | undefined;
          }) => {
            return (
              <div key={i.comId}>
                <CommentStructure
                  info={i}
                  replyMode={
                    _.indexOf(globalStore.replyArr, i.comId) === -1
                      ? false
                      : true
                  }
                />
                {i.replies &&
                  i.replies.length > 0 &&
                  i.replies.map((j) => {
                    return (
                      <div className="reply-section" key={j.comId}>
                        <CommentStructure
                          info={{ ...j, replyComponent: true }}
                          parentId={i.comId}
                          replyMode={
                            _.indexOf(globalStore.replyArr, j.comId) === -1
                              ? false
                              : true
                          }
                        />
                      </div>
                    );
                  })}
              </div>
            );
          }
        )
      ) : (
        <NoComments />
      )}
    </div>
  );
};

export default CommentSection;
