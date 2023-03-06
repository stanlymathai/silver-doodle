import { useContext, useState } from "react"

import React from "react"
import moment from "moment";
const { v4: uuidv4 } = require("uuid")

import { GlobalContext } from "../../context/Index"
import { InputComponent } from "./InputForm"
import "./Style.scss"

interface InputFieldProps {
  comId?: string
  mode?: string
}

export const InputField = ({ mode, comId }: InputFieldProps) => {

  const globalStore: any = useContext(GlobalContext)
  const [text, setText] = useState("")

  const handleSubmit = async () => {
  
    const formData = {
      timeStamp: moment().format(),
      comId: uuidv4(),
      text,
    };
    const parentId = comId;
    const articleId = globalStore.article.articleId;
  
    setText('');
  
    if (mode) {
      return (
        await globalStore.handleReply({
          ...formData,
          parentId,
          avatarUrl: globalStore.currentUserData.avatar,
          fullName: globalStore.currentUserData.fullName,
        }),
        await globalStore.onReplyAction({
          ...formData,
          articleId,
          parentId,
        })
      );
    } else {
      return (
        await globalStore.handleSubmit({
          ...formData,
          avatarUrl: globalStore.currentUserData.avatar,
          fullName: globalStore.currentUserData.fullName,
        }),
        await globalStore.onSubmitAction({ ...formData, articleId })
      );
    }
  };  
  
  return (
    <InputComponent
      text={text}
      mode={mode}
      setText={setText}
      handleSubmit={handleSubmit}
    />
  )
}