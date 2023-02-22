import React from 'react';

import './Style.scss';
import { LikeButton } from '../../Action/Like';
import { ReportFlag } from '../../Action/Report';
import { ReplyButton } from '../../Action/Reply';
import { ReactionView } from '../../Action/Overview';
import { InputField } from '../../InputField/Index';

interface ICommentBody {
  info: {
    comId: string,
    fullName: string,
    avatarUrl: string,
    text: string,
    timeStamp: string,
    userProfile?: string,
    moderated?: boolean,
    reaction: {
      like: boolean,
      brilliant: boolean,
      thoughtful: boolean,
    },
    reactionCount: number,
    replies?: Array<object> | undefined,
    replyComponent?: boolean | undefined,
  };
  replyMode?: boolean;
}

export const CommentBody = ({ info, replyMode }: ICommentBody) => {
  const wraperClass = `actionBar ${info.moderated ? 'disable-div' : ''}`;
  const actionBar = () => (
    <div className={wraperClass}>
      <div className="actions">
        {LikeButton(info)}
        {ReactionView(info.reactionCount)}
        {ReplyButton(info)}
      </div>
      <ReportFlag info={info} />
    </div>
  );

  const commentBox = () => (
    <div className="comment-box">
      <div className="username">{info.fullName} </div>
      <div className="userInfo">
        <div className="image">
          <img
            alt="avatar"
            className="avatar"
            src={info.avatarUrl}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src =
                'https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/userplaceholder_5734b83bd0.png';
            }}
          />
        </div>
        {info.moderated ? (
          <div className="moderate">MODERATED</div>
        ) : (
          <div className="comment">{info.text}</div>
        )}
      </div>
      {actionBar()}
    </div>
  );

  const commentBoxWithInput = () => (
    <div className="replysection">
      {commentBox()}
      <div className="replyInput">
        <InputField mode={'replyMode'} comId={info.comId} />
      </div>
    </div>
  );

  return (
    <div className="session-body">
      {replyMode ? commentBoxWithInput() : commentBox()}
    </div>
  );
};
