import React from 'react'
import NoLetterYet from './NoLetterYet'
import LetterAttached from './LetterAttached'

const RequestCompanies = () => {
  return (
    <>
    <div className=" py-4 sm:py-6 px-10  mx-auto mt-4">
      <h1 className="text-3xl font-bold font-sf mb-12">Requests to Companies</h1>

      <NoLetterYet />
      <LetterAttached />
    </div> 
    </>
  )
}

export default RequestCompanies
