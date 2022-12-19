import React from "react";
import { CommentSection } from "discussion-box";
import "discussion-box/dist/index.css";
import { useApiGet, TApiResponse } from "../library/hooks/useApiHook";

const CommentBox = () => {
  // call to the hook
  const data: TApiResponse = useApiGet("http://localhost:8000/api/comment/");

  return (
    <div style={{ width: "100%" }}>
      {!data.loading ? (
        <CommentSection
          currentUser={{
            currentUserId: "01a",
            currentUserImg:
              "https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/userplaceholder_5734b83bd0.png",
            currentUserFullName: "MoniTalks",
          }}
          commentData={data.data}

          currentData={(data: any) => {
            console.log("curent data", data);
          }}
          onSubmitAction={(data: {
            userId: string;
            comId: string;
            avatarUrl: string;
            fullName: string;
            text: string;
            replies: any;
          }) => {
            console.log("check submit, ", data);
          }}
          onReplyAction={(data: {
            userId: string;
            repliedToCommentId: string;
            avatarUrl: string;
            fullName: string;
            text: string;
          }) => console.log("check reply, ", data)}
          inputStyle={{ border: "1px solid rgb(208 208 208)", color: "red" }}
          submitBtnStyle={{
            fontSize: "12px",
            color: "#1cf399",
            marginRight: "10px",
            borderRadius: "8px",
            backgroundColor: "transparent",
            border: "1px solid rgb(208 208 208)",
          }}
          cancelBtnStyle={{
            fontSize: "12px",
            color: "#f8f8ff",
            borderRadius: "8px",
            backgroundColor: "transparent",
            border: "1px solid rgb(208 208 208)",
          }}
        />
      ) : (
        "loading..."
      )}
    </div>
  );
};

export default CommentBox;
