import React from "react";

import likeButton from "../Action/Like";
import replyButton from "../Action/Reply";

import InputField from "../InputField/Index";
import reactionView from "../Action/Overview";


import "./Style.scss";

interface ICommentBody {
  info: {
    userId: string;
    comId: string;
    fullName: string;
    avatarUrl: string;
    text: string;
    timeStamp?: string;
    userProfile?: string;
    replies?: Array<object> | undefined;
    replyComponent?: boolean | undefined;
  };
  parentId?: string;
  replyMode: boolean;
}

const handleClickTest = (e: any) => {
  console.log(e, "e")

  let el = document.getElementById("rpt-btn")
  console.log(el, "el")
  el?.click()
}

const CommentBody = ({ info, parentId, replyMode }: ICommentBody) => {
  const actionBar = () => (
    <div className="actionBar">
      <div className="actions">
        {likeButton()}
        {reactionView()}
        {replyButton(info)}
      </div>
      <div className="flagBtn" onClick={() => handleClickTest(info)} />
    </div>
  );

  const commentBox = () => (
    <div className="comment-box">
      <div className="username">{info.fullName} </div>
      <div className="userInfo">
        <div className="image">
          <img alt="userIcon" className="avatar" src={info.avatarUrl} />
        </div>
        <div className="comment">{info.text}</div>
      </div>
      {actionBar()}
    </div>
  );

  const commentBoxWithInput = () => (
    <div className="replysection">
      {commentBox()}
      <InputField
        mode={"replyMode"}
        comId={info.comId}
        parentId={parentId}
      />
    </div>
  );


  return (
    <div className="comment-session-structure">
      {replyMode ? commentBoxWithInput() : commentBox()}
    </div>
  );
};

export default CommentBody;
