import React, { useState } from "react";

import likeButton from "../Action/Like";
import replyButton from "../Action/Reply";

import InputField from "../InputField/Index";
import reactionView from "../Action/Overview";
import ReportAction from "../ReportAction/Index";

import { Modal } from "react-responsive-modal";

import "./Style.scss";
import "react-responsive-modal/styles.css";

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

const CommentBody = ({ info, parentId, replyMode }: ICommentBody) => {
  const actionBar = () => {
    return (
      <div className="actionBar">
        <div className="actions">
          {likeButton()}
          {reactionView()}
          {replyButton(info)}
        </div>
        <div className="flagBtn" onClick={onOpenModal} />
      </div>
    );
  };

  const commentBox = () => {
    return (
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
  };

  const commentBoxWithInput = () => {
    return (
      <div className="replysection">
        {commentBox()}
        <InputField comId={info.comId} mode={"replyMode"} parentId={parentId} />
      </div>
    );
  };

  // report action modal
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const flagAction = () => (
    <Modal open={open} onClose={onCloseModal} center>
      <ReportAction />
    </Modal>
  );

  return (
    <div className="comment-session-structure">
      {replyMode ? commentBoxWithInput() : commentBox()}
      {1 + 1 == 1 && flagAction()}
    </div>
  );
};

export default CommentBody;
