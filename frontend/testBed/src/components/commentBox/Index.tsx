import React, { useState, useEffect } from "react";
import { CommentSection } from "discussion-box";
import "discussion-box/dist/index.css";

import style from "./customStyle";
import API from "./service/api.service";
import { CommentBoxProps } from "./service/interface.service";

const CommentBox = (props: CommentBoxProps) => {
  const [commentData, setComments] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getCommentData = () => {
    setLoading(true);
    API.fetchComments(props.articleId).then((res: any) =>
      setComments(Object.values(res.data.threads))
    );
    setLoading(false);
  };

  useEffect(() => {
    if (!!props.articleId) getCommentData()
    // eslint-disable-next-line
  }, [props.articleId]);

  return (
    <div style={{ width: "100%" }}>
      {!loading ? (
        <CommentSection
          commentData={commentData}
          articleId={props.articleId}
          currentUser={props.currentUser}
          onReplyAction={API.handleAction}
          onSubmitAction={API.handleAction}
          submitBtnStyle={style.submitButton}
          cancelBtnStyle={style.cancelButton}
        />
      ) : (
        "loading..."
      )}
    </div>
  );
};

export default CommentBox;