import React, { useEffect, useState, useContext, createContext } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import _ from 'lodash';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import useNexusSettings from '~/hooks/useSettings2';
import Settings from '../components/Settings';
import { SettingsContext as SettingsContext2 } from '~/contexts/SettingsContext';
import { useCallback } from 'react';
import useMatchBreakpoints from './useMatchBreakpoints';

const { Option } = Select;

const zzz = styled.div``;

const useSettings = () => {
  const cont: any = useContext(SettingsContext2);
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
    ...cont,
    settings,
    set,
    save,
  };
};

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

const SettingsContext = createContext<any>({
  settings: {},
  show: () => {},
});

const SettingsProvider = ({ children }: any) => {
  const { settings } = useNexusSettings();
  const [open, setOpen] = useState(false);

  const show = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        show,
      }}>
      {children}
      <Drawer
        title="Settings"
        width={720}
        onClose={onClose}
        open={open}
        css={css`
          .ant-drawer-body {
            padding: 0 !important;
          }
        `}
        // extra={
        //   <Space>
        //     <Button onClick={onClose}>Cancel</Button>
        //     <Button onClick={onClose} type="primary">
        //       Submit
        //     </Button>
        //   </Space>
        // }
      >
        {/* <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter user name' }]}
              >
                <Input placeholder="Please enter user name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="url"
                label="Url"
                rules={[{ required: true, message: 'Please enter url' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  addonBefore="http://"
                  addonAfter=".com"
                  placeholder="Please enter url"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="owner"
                label="Owner"
                rules={[{ required: true, message: 'Please select an owner' }]}
              >
                <Select placeholder="Please select an owner">
                  <Option value="xiao">Xiaoxiao Fu</Option>
                  <Option value="mao">Maomao Zhou</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please choose the type' }]}
              >
                <Select placeholder="Please choose the type">
                  <Option value="private">Private</Option>
                  <Option value="public">Public</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="approver"
                label="Approver"
                rules={[{ required: true, message: 'Please choose the approver' }]}
              >
                <Select placeholder="Please choose the approver">
                  <Option value="jack">Jack Ma</Option>
                  <Option value="tom">Tom Liu</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label="DateTime"
                rules={[{ required: true, message: 'Please choose the dateTime' }]}
              >
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  getPopupContainer={(trigger) => trigger.parentElement!}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'please enter url description',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="please enter url description" />
              </Form.Item>
            </Col>
          </Row>
        </Form> */}
        <Settings />
      </Drawer>
    </SettingsContext.Provider>
  );
};

export { useSettings, SettingsProvider, SettingsContext };

export default useSettings;
