import React from 'react'
import { SvgProps } from '../../Svg'
import Text from '../../Text/Text'
import Dropdown from '../../Dropdown/Dropdown'
import Button from '../../Button/Button'
import * as IconModule from '../icons'
import { LangType } from '../types'
import MenuButton from './MenuButton'

const Icons = IconModule as unknown as { [key: string]: React.FC<SvgProps> }
const { LanguageIcon } = Icons

interface Props {
  currentLang: string
  langs: LangType[]
  setLang: (lang: LangType) => void
}

const LangSelector: React.FC<Props> = ({ currentLang, langs, setLang }) => (
  <Dropdown
    position="top-right"
    target={
      <Button variant="text" startIcon={<LanguageIcon color="textSubtle" width="24px" />} style={{ padding: '0px' }}>
        <Text color="textSubtle">{currentLang?.toUpperCase()}</Text>
      </Button>
    }
  >
    {langs.map((lang) => (
      <MenuButton
        key={lang.code}
        fullWidth
        onClick={() => setLang(lang)}
        // Safari fix
        style={{ minHeight: '32px', height: 'auto' }}
      >
        {lang.language}
      </MenuButton>
    ))}
  </Dropdown>
)

export default React.memo(LangSelector, (prev, next) => prev.currentLang === next.currentLang)
