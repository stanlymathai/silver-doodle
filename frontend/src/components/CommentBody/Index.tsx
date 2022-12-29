import React from "react";
import { useContext, useState } from "react";

import InputField from "../InputField/Index";
import ReportAction from "../ReportAction/Index";
import { GlobalContext } from "../../context/Provider";

import moment from "moment";
import { Modal } from "react-responsive-modal";
import { Menu, MenuItem } from "@szhsin/react-menu";

import "./Style.scss";
import "@szhsin/react-menu/dist/index.css";
import "react-responsive-modal/styles.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

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
  const globalStore: any = useContext(GlobalContext);

  const likeButton = () => {
    let hasThumbsUp = Math.random() < 0.5;
    let hasBrilliant = Math.random() < 0.5;
    let hasThoughtFul = Math.random() < 0.5;

    return (
      <div className="likeBtn">
        <span>
          <Menu
            menuButton={<button className="likeBtn">Like</button>}
            position={"anchor"}
            viewScroll={"auto"}
            direction={"top"}
            align={"center"}
            arrow={true}
            transition
          >
            <MenuItem>
              <span
                // title='Thumbs Up'
                className={
                  hasThumbsUp
                    ? "emoji-selected emoji-blue"
                    : "emoji-un-selected emoji-blue"
                }
              >
                &#128077;
              </span>
              <span
                // title='Brilliant'
                className={
                  hasBrilliant ? "emoji-selected" : "emoji-un-selected"
                }
              >
                &#128161;
              </span>
              <span
                // title='Thoughtful'
                className={
                  hasThoughtFul ? "emoji-selected" : "emoji-un-selected"
                }
              >
                &#129300;
              </span>
            </MenuItem>
          </Menu>
        </span>
      </div>
    );
  };

  const reactions = () => {
    let reactionCount = Math.floor(Math.random() * 9 + 1) + "K";
    return (
      <div className="reactionGroup">
        <span className="emoji-blue">&#128077;</span>
        <span>&#128161;</span>
        <span>&#129300;</span>
        <span className="reaction-count-text">{reactionCount}</span>
      </div>
    );
  };

  const replyButton = () => {
    return (
      <div className="replyBtn">
        <span className="vertical-line" />
        {!info.replyComponent && (
          <span
            className="reply-btn-text"
            onClick={() => globalStore.handleReply(info.comId)}
          >
            Reply
          </span>
        )}
        <span className="published-time-text">{moment(info.timeStamp).fromNow()}</span>
      </div>
    );
  };

  const actionBar = () => {
    return (
      <div className="actionBar">
        <div className="actions">
          {likeButton()}
          {reactions()}
          {replyButton()}
        </div>
        <div className="flagBtn" onClick={onOpenModal} />
      </div>
    )
  }

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
        <InputField
          comId={info.comId}
          mode={"replyMode"}
          parentId={parentId}
        />
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
