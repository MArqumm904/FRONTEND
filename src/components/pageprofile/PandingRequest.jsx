import ConfirmedMembers from './ConfirmedMembers'
import LetterAttached from './LetterAttached'
import NoLetterYet from './NoLetterYet'
import RequestCompanies from './RequestCompanies'
import UserResponse from './UserResponse'

const PandingRequest = () => {
  return (
    <div>
        <ConfirmedMembers />
        <UserResponse />
        <RequestCompanies />
    </div>
  )
}

export default PandingRequest
