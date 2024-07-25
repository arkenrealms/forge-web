import React from 'react'

interface ISpinner {
  message?: string
}

const Spinner = ({ message = 'Loading' }: ISpinner) => {
  return <section>{message}</section>
}

export default Spinner
