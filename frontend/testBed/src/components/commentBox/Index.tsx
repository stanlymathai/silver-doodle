import React, { useState, useEffect } from "react";
import { CommentSection } from "discussion-box";
import "discussion-box/dist/index.css";

import style from "./customStyle";
import API from "./service/api.service";
import { CommentBoxProps, ICommentData } from "./service/interface.service";

const CommentBox = (props: CommentBoxProps) => {
  
  const INITIAL_LIMIT = 6;
  const ARTICLE_ID = props.articleId;
  const [comments, setComments] = useState<any>()
  const [totalCount, setTotal] = useState<number>(0);
  const [articleData, setArticleData] = useState<any>();
  const [commentData, setCommentData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getCommentData = () => {
    setLoading(true);
    API.fetchCommentData(ARTICLE_ID).then((res: any) => {
      const data = Object.values(res.data?.commentData);
      setArticleData(res.data?.articleData);
  
      if (data) {
        setComments(data);
        setTotal(data.length);
        setCommentData(data.slice(0, INITIAL_LIMIT));
      }
    });
    setLoading(false);
  };  

  const loadMore = () => setCommentData(comments)

  const onSubmitAction = (data: ICommentData) => {
    setTotal(totalCount + 1);
    API.handleComment(data);
  };  

  useEffect(() => {
    if (ARTICLE_ID) getCommentData();
    // eslint-disable-next-line
  }, [ARTICLE_ID]);    

  return (
    <div style={style.main}>
      <CommentSection
        loading={loading}
        loadMore={loadMore}
        totalCount={totalCount}
        commentData={commentData}
        articleData={articleData}
        currentUser={props.currentUser}
        onSubmitAction={onSubmitAction}
        onReplyAction={API.handleComment}
        onReportAction={API.handleReport}
        onUserRection={API.handleReaction}
        cancelBtnStyle={style.cancelButton}
      />
    </div>
  );  
};

export default CommentBox;