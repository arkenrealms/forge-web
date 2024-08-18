import React from 'react'
import { CharacterPlaceholderIcon, Flex, Heading } from '~/ui'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'

interface ComingSoonProps {
  children?: React.ReactNode
}

const ComingSoon: React.FC<ComingSoonProps> = ({ children }) => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" p="24px">
      {/* <CharacterPlaceholderIcon width="72px" height="72px" /> */}
      <Heading as="h5" size="md" color="textDisabled">
        {children || t('Coming Soon!')}
      </Heading>
    </Flex>
  )
}

export default ComingSoon
