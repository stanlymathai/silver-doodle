import React, { useState, useEffect } from "react";
import { CommentSection } from "discussion-box";
import "discussion-box/dist/index.css";

import style from "./customStyle";
import API from "./service/api.service";
import { CommentBoxProps } from "./service/interface.service";

const CommentBox = (props: CommentBoxProps) => {

  const FETCH_LIMIT = 6;
  const ARTICLE_ID = props.articleId;

  const [commentData, setComments] = useState<any>();
  const [totalCount, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getCommentData = () => {
    setLoading(true);
    API.fetchComments(ARTICLE_ID, FETCH_LIMIT).then((res: any) =>
      setComments(Object.values(res.data.threads))
    );
    setLoading(false);
  };

  const getCommentCount = () =>
    API.totalCount(ARTICLE_ID).then((res: any) => setTotal(res.data.count));
  const loadMore = () =>
    API.fetchComments(ARTICLE_ID).then((res: any) =>
      setComments(Object.values(res.data.threads))
    );

  useEffect(() => {
    if (!ARTICLE_ID) return;
    getCommentData();
    getCommentCount();
    // eslint-disable-next-line
  }, [ARTICLE_ID]);

  return (
    <div style={{ width: "100%" }}>
      {!loading && (
        <CommentSection
          loadMore={loadMore}
          articleId={ARTICLE_ID}
          totalCount={totalCount}
          commentData={commentData}
          currentUser={props.currentUser}
          onReplyAction={API.handleAction}
          onSubmitAction={API.handleAction}
          cancelBtnStyle={style.cancelButton}
        />
      )}
    </div>
  );
};

export default CommentBox;