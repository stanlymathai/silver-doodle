import React from "react";
import { useContext } from "react";

import _ from "lodash";
import "./CommentSection.scss";

import InputField from "../InputField/Index";
import InfiniteScroll from 'react-infinite-scroller'
import { GlobalContext } from "../../context/Provider";
import CommentStructure from "../CommentStructure/Index";

const loadFunc = (offset: Number) => {
  console.log(offset, "offset")
}
const CommentSection = () => {
  const globalStore: any = useContext(GlobalContext);

  return (
    <div className="comment-session-overlay">
      <div className="session-header">
        <div>View {globalStore.data.length} previous comments</div>
        <div>All comments</div>
      </div>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadFunc}
        hasMore={true || false}
      // loader={<div className="loader" key={0}>...</div>}
      >
        {globalStore.data.map(
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
                    _.indexOf(globalStore.replyArr, i.comId) === -1 ? false : true
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
        )}
        <InputField />
      </InfiniteScroll>

    </div>
  );
};

export default CommentSection;
