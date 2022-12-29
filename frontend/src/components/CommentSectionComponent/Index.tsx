import React from "react";
import { useContext } from "react";

import "./Style.scss";
import _ from "lodash";

import Header from "../Header/Index";
import InputField from "../InputField/Index";
import CommentBody from "../CommentBody/Index";
import { GlobalContext } from "../../context/Provider";

const CommentSection = () => {
  const globalStore: any = useContext(GlobalContext);

  return (
    <div className="cs-overlay">
      <Header />
      <InputField />
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
              <CommentBody
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
                      <CommentBody
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
    </div>
  );
};

export default CommentSection;
