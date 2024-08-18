import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { ChevronLeftIcon, Flex, Text, ButtonMenu, ButtonMenuItem } from '~/ui'
import useWeb3 from '~/hooks/useWeb3'

interface MenuProps {
  params: any
  activeIndex?: number
}

const Menu: React.FC<MenuProps> = ({ params, activeIndex = 0 }) => {
  const { id }: { id: string } = params
  const { address: _account, library } = useWeb3()
  const account = id ? id : _account
  const { t } = useTranslation()

  return (
    <>
      <Flex mb="24px" justifyContent="center">
        <ButtonMenu activeIndex={activeIndex} scale="sm">
          <ButtonMenuItem as={RouterLink} to={id ? `/user/${id}/account` : `/account`}>
            {t('Overview')}
          </ButtonMenuItem>
          <ButtonMenuItem as={RouterLink} to={id ? `/user/${id}/inventory` : `/account/inventory`}>
            {t('Inventory')}
          </ButtonMenuItem>
          <ButtonMenuItem as={RouterLink} to={id ? `/user/${id}/achievements` : `/account/achievements`}>
            {t('Achievements')}
          </ButtonMenuItem>
          <ButtonMenuItem as={RouterLink} to={id ? `/user/${id}/quests` : `/account/quests`}>
            {t('Quests')}
          </ButtonMenuItem>
          <ButtonMenuItem as={RouterLink} to={id ? `/user/${id}/rewards` : `/account/rewards`}>
            {t('Rewards')}
          </ButtonMenuItem>
          <ButtonMenuItem as={RouterLink} to={id ? `/user/${id}/stats` : `/account/stats`}>
            {t('Stats')}
          </ButtonMenuItem>
        </ButtonMenu>
      </Flex>
    </>
  )
}

export default Menu
