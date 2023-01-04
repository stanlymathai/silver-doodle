import React from "react"
import { useContext } from "react"
import { GlobalContext } from "../../context/Index"

interface InputComponentProps {
  text: string
  mode?: string
  comId?: string
  setText: Function
  handleSubmit: Function
}

const InputComponent = ({
  text,
  mode,
  comId,
  setText,
  handleSubmit,
}: InputComponentProps) => {
  const globalStore: any = useContext(GlobalContext)

  return (
    <form
      className='session-form'
      onSubmit={() => handleSubmit}
    >
      <img
        alt='userIcon'
        className='userImg'
        src={globalStore.currentUserData.currentUserImg}

      />
      <input
        type='text'
        value={text}
        className='inputField'
        placeholder='Write a comment....'
        onChange={(e) => setText(e.target.value)}
      />

      <button
        type='submit'
        className='submitBtn'
        onClick={(e) => handleSubmit(e)}
        disabled={text != "" ? false : true}
      />

      {mode && (
        <button
          type='button'
          style={globalStore.cancelBtnStyle}
          onClick={() => globalStore.handleReply(comId)}
        >
          Cancel
        </button>
      )}
    </form>
  )
}

export default InputComponent
