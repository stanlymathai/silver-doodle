import React, { useState, useEffect } from "react";
import { CommentSection } from "discussion-box";
import "discussion-box/dist/index.css";

import style from "./customStyle";
import apiHandler from "./service/api.service";
import { CommentBoxProps } from "./service/interface.service";

const CommentBox = (props: CommentBoxProps) => {
  const [commentData, setComments] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getCommentData = () => {
    setLoading(true);
    apiHandler
      .getAll(props.articleId)
      .then((res: any) => setComments(res.data));

    setLoading(false);
  };

  // eslint-disable-next-line
  useEffect(() => getCommentData(), []);

  return (
    <div style={{ width: "100%" }}>
      {!loading ? (
        <CommentSection
          commentData={commentData}
          articleId={props.articleId}
          currentUser={props.currentUser}
          onReplyAction={apiHandler.reply}
          onSubmitAction={apiHandler.submit}
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