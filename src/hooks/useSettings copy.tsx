import { useState, useCallback } from 'react';
import useMatchBreakpoints from './useMatchBreakpoints';

const defaultSettings = {
  LocalMode: false,
  DeveloperMode: false,
  DarkMode: false,
  ShowDataTrees: false,
  RemoveConfirmation: true,
  Validation: true,
  ContentEditor: 'standalone',
  TableWidth: 400,
  ...JSON.parse(window.localStorage.getItem('Settings') || '{}'),
};

export default function useSettings() {
  const { isMobile } = useMatchBreakpoints();
  const [settings, setSettings] = useState(defaultSettings);

  if (isMobile) {
    settings.ContentEditor = 'modal';
  }

  // useEffect(function () {
  //   if (settings) return
  //   if (!window?.localStorage) return

  //   setSettings(JSON.parse(window.localStorage.getItem('Settings') || '{}'))
  // }, [])
  // console.log(settings)

  const set = useCallback(
    function (key: string, value: any) {
      settings[key] = value;
      defaultSettings[key] = value;
      setSettings({ ...settings });

      console.log('Settings set', key, value, settings);

      // setSettings(settings)
      // setSettings((v: any) => ({ ...v, [key]: value }))
    },
    [settings]
  );

  const save = useCallback(
    function (values?: any) {
      console.log('Saving settings', values || settings);
      window.localStorage.setItem('Settings', JSON.stringify(values || settings));
    },
    [settings]
  );

  return {
    settings,
    set,
    save,
  };
}
