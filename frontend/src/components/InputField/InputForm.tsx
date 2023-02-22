import React from "react"
import { useContext } from "react"
import { GlobalContext } from "../../context/Index"

interface InputComponentProps {
  text: string
  mode?: string
  setText: Function
  handleSubmit: Function
}

export const InputComponent = ({
  text,
  mode,
  setText,
  handleSubmit,
}: InputComponentProps) => {
  const globalStore: any = useContext(GlobalContext)
  return (
    <form
      className='session-form'>
      <img
        alt='userIcon'
        className='user-img'
        src={globalStore.currentUserData.avatar}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src="https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/userplaceholder_5734b83bd0.png";
        }}

      />
      <input
        autoFocus
        type='text'
        value={text}
        className='input-field'
        placeholder='Write a comment....'
        onChange={(e) => setText(e.target.value)}
      />

      <button
        type='submit'
        className='hidden'
        onClick={(e) => handleSubmit(e)}
        disabled={text != "" ? false : true}
      />

      {mode && (
        <button
          type='button'
          style={globalStore.cancelBtnStyle}
          onClick={() => globalStore.onReplyThread("")}
        >
          Cancel
        </button>
      )}
    </form>
  )
}