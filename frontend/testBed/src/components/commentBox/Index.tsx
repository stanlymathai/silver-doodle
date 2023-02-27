import React, { useState, useEffect } from "react";
import { CommentSection } from "../dist/index"
import "../dist/index.css";

import style from "./customStyle";
import API from "./service/api.service";
import { CommentBoxProps } from "./service/interface.service";

const CommentBox = (props: CommentBoxProps) => {
  
  const INITIAL_LIMIT = 6;
  const ARTICLE_ID: string = props.articleId;
  const USER_ID: string = props.currentUser.userId;

  const [comments, setComments] = useState<any>()
  const [totalCount, setTotal] = useState<number>(0);
  const [articleData, setArticleData] = useState<any>();
  const [commentData, setCommentData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getCommentData = () => {
    setLoading(true);
    API.fetchCommentData(ARTICLE_ID, USER_ID).then((res: any) => {
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


  const handler = {
    loadMore: () => setCommentData(comments),
    
    submit: (data: any) => {
      setTotal(totalCount + 1);
      API.handleComment({ ...data, userId: USER_ID });
    },
    report: (data: any) => API.handleReport({ ...data, userId: USER_ID }),
    reply: (data: any) => API.handleComment({ ...data, userId: USER_ID }),
    react: (data: any) => API.handleReaction({ ...data, userId: USER_ID }),
  };

  useEffect(() => {
    if (ARTICLE_ID) getCommentData();
    // eslint-disable-next-line
  }, [ARTICLE_ID]);    

  return (
    <div style={style.main}>
      <CommentSection
        loading={loading}
        totalCount={totalCount}
        commentData={commentData}
        articleData={articleData}
        loadMore={handler.loadMore}
        onUserRection={handler.react}
        onReplyAction={handler.reply}
        onSubmitAction={handler.submit}
        onReportAction={handler.report}
        currentUser={props.currentUser}
        cancelBtnStyle={style.cancelButton}
      />
    </div>
  );  
};

export default CommentBox;