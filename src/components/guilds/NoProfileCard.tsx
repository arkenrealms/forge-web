import React from 'react'
import { Button, Card, CardBody, Flex, Heading, Text } from '~/ui'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const NoProfileCard = () => {
  const { t } = useTranslation()

  return (
    <Flex
      alignItems={['start', null, 'center']}
      justifyContent={['start', null, 'space-between']}
      flexDirection={['column', null, 'row']}
    >
      <div>
        <Heading size="lg" mb="8px">
          {t("You haven't set up your profile yet!")}
        </Heading>
        <Text>{t('You can do this at any time by clicking on your profile picture in the menu')}</Text>
      </div>
      <Button as={Link} to="/profile" mt={['16px', null, 0]}>
        {t('Set up now')}
      </Button>
    </Flex>
  )
}

export default NoProfileCard
