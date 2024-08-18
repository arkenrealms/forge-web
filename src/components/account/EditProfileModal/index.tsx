import React, { useEffect } from 'react'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import useEditProfile, { Views } from './reducer'
import StartView from './StartView'
import PauseProfileView from './PauseProfileView'
import ChangeProfilePicView from './ChangeProfilePicView'
import ApproveRuneView from './ApproveRuneView'

type EditProfileModalProps = InjectedModalProps & {
  defaultView?: string
}

const viewTitle = {
  [Views.START]: { id: 999, label: 'Edit Guild Membership' },
  [Views.CHANGE]: { id: 999, label: 'Change Active Character' },
  [Views.REMOVE]: { id: 999, label: 'Pause Guild Membership' },
  [Views.APPROVE]: { id: 999, label: 'Approve RXS' },
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ defaultView, onDismiss }) => {
  const { currentView, goView, goToChange, goToRemove, goToApprove, goPrevious } = useEditProfile(defaultView)
  const { t } = useTranslation()
  const { id, label } = viewTitle[currentView]

  const isStartView = currentView === Views.START
  const handleBack = isStartView ? null : () => goPrevious()

  // useEffect(() => {
  //   if (defaultView) {
  //     goView(defaultView)
  //   }
  // }, [goView, defaultView])

  return (
    <Modal title={t(label)} onBack={handleBack} onDismiss={onDismiss} hideCloseButton={!isStartView}>
      <div style={{ maxWidth: '400px' }}>
        {currentView === Views.START && (
          <StartView goToApprove={goToApprove} goToChange={goToChange} goToRemove={goToRemove} onDismiss={onDismiss} />
        )}
        {currentView === Views.REMOVE && <PauseProfileView onDismiss={onDismiss} />}
        {currentView === Views.CHANGE && <ChangeProfilePicView onDismiss={onDismiss} />}
        {currentView === Views.APPROVE && <ApproveRuneView goToChange={goToChange} onDismiss={onDismiss} />}
      </div>
    </Modal>
  )
}

export default EditProfileModal
