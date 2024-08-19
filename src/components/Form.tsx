import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Input, InputNumber } from 'antd';
import { Form, Col, Divider, Steps, Row, Spin, Select, Tag } from 'antd';
import { Result } from 'antd';
import dayjs from 'dayjs';
import { AiOutlinePlus, AiOutlineCloseCircle } from 'react-icons/ai';
import qs from 'qs';
import { evaluate } from 'mathjs';
import _ from 'lodash';
import Button from './Button2';
import { getComponentsByKey } from '@arken/node/util/object';
import { usePrompt } from '@arken/forge-ui/hooks/usePrompt';
import { get, set } from '@arken/node/util/object';
import { generateUuid } from '@arken/node/util/guid';
import useSettings from '@arken/forge-ui/hooks/useSettings';
import FormFieldPassword from '@arken/forge-ui/components/FormFieldPassword';
import FormFieldText from '@arken/forge-ui/components/FormFieldText';
import FormFieldNumber from '@arken/forge-ui/components/FormFieldNumber';
import FormFieldSelect from '@arken/forge-ui/components/FormFieldSelect';
import FormFieldTextArea from '@arken/forge-ui/components/FormFieldTextarea';
import FormFieldToggle from '@arken/forge-ui/components/FormFieldToggle';
import FormFieldCheckbox from '@arken/forge-ui/components/FormFieldCheckbox';
import FormFieldChoice from '@arken/forge-ui/components/FormFieldChoice';
import FormFieldButton from '@arken/forge-ui/components/FormFieldButton';
import FormFieldDate from '@arken/forge-ui/components/FormFieldDate';
import FormFieldDataTable from '@arken/forge-ui/components/FormFieldDataTable';
import FormFieldContent from '@arken/forge-ui/components/FormFieldContent';
import FormFieldUpload from '@arken/forge-ui/components/FormFieldUpload';
import {
  useModel,
  useGetModelCall,
  useGetModel,
  useSearchModels,
  useSearchModelsCall,
  useCreateModel,
  useUpdateModel,
  useUpsertModel,
  useDeleteModel,
} from '@arken/forge-ui/hooks';
import useDocumentTitle from '@arken/forge-ui/hooks/useDocumentTitle';
// @ts-ignore
import logo from '../assets/logo-dark.png';

const { Option } = Select;
const { Step } = Steps;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const validateMessages = {
  required: '${label} is required',
  types: {
    email: '${label} is not valid',
    number: '${label} is not a valid number',
  },
};

const customizeRequiredMark: any = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
    {label}
  </>
);

function hasFormErrors(fieldsError: any) {
  return Object.keys(fieldsError).some((field) => fieldsError[field].errors.length > 0);
}

function Header({ title }: any) {
  return (
    <div
      className="header"
      css={css`
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      padding-left 37.5px;
      padding-right 37.5px;
      font-family: "Open Sans Condensed", Helvetica, sans-serif;
    `}>
      <Link
        to="/"
        css={css`
          -ms-flex-negative: 0;
          display: inline-block;
          filter: grayscale(1);
          margin-left: 20px;
          cursor: pointer;
          width: 160px;
        `}>
        <img src={logo} />
      </Link>

      <h1
        css={css`
      font-size: 24px;
      font-weight 700;
      font-family: "Open Sans Condensed", Helvetica, sans-serif;
      `}>
        {title}
      </h1>
    </div>
  );
}

function isNexus() {
  return window.self !== window.top;
}

function Loading() {
  return (
    <>
      {!isNexus() ? <Header /> : null}
      <h1
        css={css`
          text-align: center;
        `}>
        <Spin size="large" />
        <br />
        <br />
        Loading form...
      </h1>
    </>
  );
}

const connectors: any = {};

export default function FormDetails({ form, submission, isLoading }: any) {
  const { settings } = useSettings();
  const history = useNavigate();
  const localParams = qs.parse(window.location.search.replace('?', ''));
  // @ts-ignore
  const [antForm] = Form.useForm();
  const [cacheKey, setCacheKey] = useState('0');

  const [submitFormData, setSubmitFormData] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);

  const [root, setRoot] = useState(undefined);
  const { prompt } = usePrompt();

  const { data: submitFormResult, errors }: any = useGetModel({
    key: 'SubmitFormResolver',
    action: 'saveSubmission',
    variables: submitFormData,
    gql: `
      query SubmitFormResolver($data: FormSubmitInput!) {
        saveSubmission(data: $data) {
          id
          formKey
        }
      }
    `,
  });

  const { call: serviceValidate } = useGetModelCall({
    key: 'serviceValidate',
    action: 'serviceValidate',
    variables: { args: {} } as any,
    gql: `
      query serviceValidate($args: JSON) {
        serviceValidate(args: $args)
      }
    `,
  });

  const onFinish = async (values: any, isDraft = false) => {
    console.log('Finish', values, root);

    const componentsByKey = getComponentsByKey(root.components);

    function cleanData(d: any) {
      for (const key in d) {
        // TODO: fix
        const primaryKey = 'Well License Number'; // d.dataPrimaryKey

        if (!['key', 'value', 'data', 'components'].includes(key)) {
          delete d[key];
        }

        if (key === 'data') {
          console.log('cdcd', d);
          const originalData = _.keyBy((componentsByKey[d.key] as any).__original_data, primaryKey) as any;
          const newData = [];
          // console.log('vfvfvf', originalData)
          for (const i in d.__original_data) {
            const row = {} as any;
            for (const dataKey in d.__original_data[i]) {
              if (
                d.__data?.[i]?.[dataKey] &&
                d.__data?.[i]?.[dataKey] !== originalData[d.__original_data[i][primaryKey]][dataKey]
              ) {
                row[dataKey] = d.__data[i][dataKey];
              }
            }
            newData.push(row);
          }
          console.log('cdcd333', d.__data, d.__original_data, originalData, newData);
          d.data = newData;
        }

        if (key === 'components') {
          for (const component of d[key]) {
            cleanData(component);
          }
        }
      }

      return d;
    }

    const components = cleanData(JSON.parse(JSON.stringify(root))).components;

    setSubmitFormData({
      data: {
        submissionId: submission?.id,
        formId: form.id,
        components,
        isDraft,
      },
    });
  };

  useEffect(function () {
    antForm.setFieldsValue(qs.parse(window.location.search.replace('?', '')));
  }, []);

  // console.log('Form Data', data)

  const formFieldTypes = {
    Password: FormFieldPassword,
    'Text Box': FormFieldText,
    'Text Area': FormFieldTextArea,
    Email: FormFieldText,
    Phone: FormFieldText,
    Postal: FormFieldText,
    Currency: FormFieldText,
    Number: FormFieldNumber,
    Checkbox: FormFieldCheckbox,
    Select: FormFieldSelect,
    Choice: FormFieldChoice,
    Toggle: FormFieldToggle,
    Radio: FormFieldChoice,
    Button: FormFieldButton,
    Date: FormFieldDate,
    Content: FormFieldContent,
    'File Upload': FormFieldUpload,
  };

  useEffect(() => {
    if (submitFormResult?.id) {
      history(
        `/${form.status === 'Published' ? 'view' : 'preview'}/${
          form.status === 'Published' ? form.key : form.id
        }/result/${submitFormResult.id}`
      );
    }
  }, submitFormResult?.id);

  // {"Tabs":[],"Designer":{},"Preview":{},"Data":{"Id":"a","Template":{"Id":"dds1","Name":"Template: DDS 1","Grid":[{"ColumnStart":"1","ColumnEnd":"span 4","RowStart":"1","RowEnd":"span 1"},{"ColumnStart":"5","ColumnEnd":"span 4","RowStart":"1","RowEnd":"span 1"},{"ColumnStart":"1","ColumnEnd":"8","RowStart":"2","RowEnd":"span 1"},{"ColumnStart":"1","ColumnEnd":"span 8","RowStart":"3","RowEnd":"span 1"},{"ColumnStart":"1","ColumnEnd":"span 8","RowStart":"4","RowEnd":"span 1"}]},"Name":"Example: 1","Components":[{"Id":"vvv","Type":"Text Box","Label":"Text Box Label","Validation":{"Id":"8C4E00B7-C2D7-41B5-8B89-4874D8473A7A"},"GridIndex":0,"isDisabled":true,"Placeholder":"Text Box Placeholder"},{"Id":"yyy","Type":"Checkbox","Validation":{"Id":"1B38E2DF-B896-4810-9495-405A197621FF"},"Label":"Checkbox Label","GridIndex":1,"isDisabled":true},{"Id":"zzz","Type":"Text Area","Validation":{"Id":"D0838102-F0A6-4C4C-B13B-75BA751F019A"},"Label":"Text Area Label","GridIndex":2,"isDisabled":true,"Placeholder":"Text Area Placeholder"},{"Id":"zzz2","Type":"Text Box","Label":"Text Label","Validation":{"Id":"7EDB5931-B001-4A70-A8F5-F8434064C4E9"},"GridIndex":3,"isDisabled":false,"Placeholder":"Text Box Placeholder"},{"Id":"zzz3","Type":"Toggle","Label":"Toggle Label","Validation":{"Id":"40C85170-3DDC-4BA5-9F9F-AE909EE5DAEE"},"GridIndex":4,"isDisabled":false}],"Validation":{}}}

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  function resetForm(targetRoot: any) {
    // const componentsByKey = getComponentsByKey(targetRoot.components)

    // for (const componentKey of Object.keys(componentsByKey)) {
    //   antForm.setFieldValue(componentKey, '')
    // }

    antForm.resetFields();
  }

  useEffect(
    function () {
      if (!form?.components) return;
      if (!submission) return;

      const newRoot = _.merge(JSON.parse(JSON.stringify(form)), JSON.parse(JSON.stringify(submission)));
      setRoot(newRoot);
      resetForm(newRoot);
      processForm(newRoot);
      setCacheKey('cache' + Math.random());

      document.body.classList.add(`theme-${newRoot.theme}`);
    },
    [form, submission]
  );

  useDocumentTitle(form?.title || 'HR');

  if (!form) {
    return <Loading />;
  }

  if (!form.components) {
    return (
      <Result
        status="500"
        title="Error"
        subTitle="Sorry, the form you loaded has not been configured."
        extra={
          <Button type="primary" onClick={() => history('/')}>
            Back To Home
          </Button>
        }
      />
    );
  }

  const resolvedComponents: any = {};

  if (form.components) {
    for (const c1 of form.components) {
      resolvedComponents[c1.key] = c1;

      if (c1.components) {
        for (const c2 of c1.components) {
          if (!c2) continue;
          resolvedComponents[`${c2.key}`] = { text: c2.value, component: c2 };

          if (c2.components) {
            for (const c3 of c2.components) {
              if (!c3) continue;
              resolvedComponents[`${c3.key}`] = { text: c3.value, component: c3 };
              resolvedComponents[`${c3.key}[value]`] = { text: c3.value, component: c3 };
              resolvedComponents[`${c3.key}[label]`] = { text: c3.label, component: c3 };
              resolvedComponents[`${c3.key}[placeholder]`] = { text: c3.placeholder, component: c3 };
              resolvedComponents[`${c3.key}[note]`] = { text: c3.note, component: c3 };
            }
          }
        }
      }
    }
  }

  function processFormula(text: any) {
    let text1 = text
      .replace('=Now', dayjs(new Date()).format('MMMM D, YYYY'))
      .replace('=Today', dayjs(new Date()).format('MMMM D, YYYY'));

    const text2 = text1
      .replace(/[a-zA-Z]+/g, function (match: any) {
        // if (!initialFormValues[resolvedComponents[match]?.component?.key]) return '0'

        const value = antForm.getFieldValue(resolvedComponents[match]?.component?.key);
        return typeof value === 'string' ? value : '0';
      })
      .replace(/\++/g, '+') // replace excess +
      .replace(/\+$/g, ''); // replace trailing +

    console.log('VVVV5', text2);

    // Replace with regex that confirms the string is just numbers and math operators
    if (text2.indexOf('=') === 0) {
      if (/^=[\d()-+.,]+$/.test(text2)) {
        // Don't kill me, this is the best way to do mathematical formulas
        text1 = evaluate(text2.slice(1).replace(/[,$]/g, '')) + ''; // eval(text2.slice(1)) + ''
      } else {
        // text = ' '
      }
    }

    const varsList = [...text1.matchAll(/=(.*)/g)]; // [...text.matchAll(/=([^ ]*)/g)]
    const components = [];
    console.log('vvbvb', connectors, text1, varsList);
    for (const vars of varsList) {
      const variable = vars[1];
      if (resolvedComponents[variable]) {
        text1 = text1.replace('=' + variable, resolvedComponents[variable].text);

        components.push(resolvedComponents[variable].component);
      }
      console.log(444, connectors, variable, connectors[variable]);
      if (connectors[variable]) {
        text1 = text1.replace('=' + variable, connectors[variable]);
        console.log('bnbnbn', text1);
        // components.push(resolvedComponents[variable].component)
      }
    }

    if (text1 === text) return;

    // Replace text for now because formula didn't work, so user doesn't see formula
    if (text1.indexOf('=') === 0) {
      text1 = ' ';
    }

    return { text: text1, components };
  }

  const initialFormValues = {} as any;

  function processComponents(index: any, cachedList: any, originalList: any) {
    if (originalList[index]?.value && typeof originalList[index]?.value === 'string') {
      // const res1 = processFormula(cachedList[index].value)
      const res2 = processFormula(originalList[index].value);

      // if (JSON.stringify(res1) === JSON.stringify(res2)) {
      // Something needs to be done here to propagate changes to dependency formulas
      // TODO fix this, its overriding local input
      //   cachedList[index].value = res2.text
      if (!cachedList[index]?.value) {
        cachedList[index].value = originalList[index].value;
      }

      // initialFormValues[cachedList[index].key] = cachedList[index].value
      console.log(`Setting ${cachedList[index].key} to ${cachedList[index].value}`);
      antForm.setFieldValue(cachedList[index].key, cachedList[index].value);

      if (res2) {
        cachedList[index].value = res2.text;
        // originalList[index].value = res2.text
        // initialFormValues[originalList[index].key] = res2.text
        // TODO: why is it 0?
        cachedList[index].__original = res2.components[0];

        console.log(`Setting ${originalList[index].key} to ${res2.text}`);
        antForm.setFieldValue(originalList[index].key, res2.text);
        console.log(
          '77777',
          'a',
          cachedList[index],
          'b',
          originalList[index],
          'c',
          res2.text,
          'd',
          initialFormValues[originalList[index].key],
          'e',
          initialFormValues[cachedList[index].key]
        );
      }

      setCacheKey('cache' + Math.random());
      // antForm.setFieldValue(cachedList[index].id, cachedList[index].value)
      // }
    }

    if (originalList[index]?.label) {
      const newLabel = processFormula(originalList[index].label)?.text;

      if (newLabel) cachedList[index].label = newLabel;
    }

    if (cachedList[index]?.components) {
      for (const index2 in cachedList[index].components) {
        if (originalList?.[index]?.components) {
          processComponents(index2, cachedList[index].components, originalList[index].components);
        }
      }
    }
  }

  function processForm(targetRoot: any = undefined) {
    if (!targetRoot) return;

    for (const index in targetRoot.components) {
      processComponents(index, targetRoot.components, form.components);
    }
  }

  console.log(33333, initialFormValues, root);

  if (!root) return <Loading />;

  function renderComponent(component: any) {
    if (component.type === 'Grid') {
      return (
        <div
          css={css`
            display: grid;
            grid-template-columns: repeat(${component.gridColumns}, minmax(0, 1fr));
            grid-column-gap: 20px;
            grid-row-gap: ${isNexus() ? '0' : '0px'};
            margin-bottom: 10px;
          `}>
          {Array.from(Array(component.gridRows)).map((row: any, rowIndex: any) => {
            return (
              <>
                {Array.from(Array(component.gridColumns)).map((column: any, columnIndex: any) => {
                  const componentIndex = rowIndex * component.gridColumns + columnIndex;
                  const c = component?.components[componentIndex];
                  if (c === undefined) return null;
                  if (c === null) return <div></div>;

                  return renderComponent(c);
                })}
              </>
            );
          })}
        </div>
      );
    } else if (component.type === 'List') {
      return (
        <div
          key={component.key}
          css={css`
            margin-bottom: 20px;
          `}>
          <div css={css``}>
            {Array.from(Array(component.gridRows)).map((row: any, rowIndex: any) => {
              const components = Array.from(Array(component.gridColumns))
                .map((column: any, columnIndex: any) => {
                  const componentIndex = rowIndex * component.gridColumns + columnIndex;
                  const c = component?.components[componentIndex];

                  if (!c) return null;

                  return renderComponent(c);
                })
                .filter((c) => !!c);

              if (components.length === 0) return null;

              return (
                <div
                  key={rowIndex}
                  css={css`
                    position: relative;
                    padding: 15px 15px 15px ${component.gridRows > 1 ? '40px' : '15px'};
                    background: ${rowIndex % 2 === 0 ? '#f5f5f5' : '#fff'};
                    border: 2px solid #f5f5f5;
                    margin-bottom: 10px;
                  `}>
                  {component.gridRows > 1 ? (
                    <div
                      onClick={() => {
                        component.components.splice(rowIndex, component.gridColumns);

                        component.gridRows = component.gridRows - 1;

                        setCacheKey('cache' + Math.random());

                        console.log('Removed list item', component);
                      }}
                      css={css`
                        position: absolute;
                        top: 19px;
                        left: 13px;
                        font-size: 20px;
                        cursor: pointer;
                      `}>
                      <AiOutlineCloseCircle />
                    </div>
                  ) : null}
                  <h2>
                    {component.label} {rowIndex + 1}
                  </h2>
                  <div
                    css={css`
                      display: grid;
                      grid-template-columns: repeat(${component.gridColumns}, minmax(0, 1fr));
                      grid-column-gap: 20px;
                      grid-row-gap: 10px;
                    `}>
                    {components}
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            onClick={() => {
              for (let i = 0; i < component.gridColumns; i++) {
                const repeatedComponent = JSON.parse(
                  JSON.stringify(component.components[component.components.length - component.gridColumns])
                );

                const counter =
                  (parseInt(repeatedComponent.key.match(/(\d+)$/)?.[0] || '0', 10) || component.gridRows) + 1;

                repeatedComponent.key = repeatedComponent.key.replace(/(\d+)$/, '') + counter;
                repeatedComponent.value = undefined;
                console.log('vvvvvv', typeof component.gridRows, repeatedComponent.key);
                // antForm.setFieldValue(repeatedComponent.key, undefined)

                const repeatedComponentComponents: any = repeatedComponent.components
                  ? getComponentsByKey(repeatedComponent.components)
                  : {};

                for (const repeatedComponentComponentKey of Object.keys(repeatedComponentComponents)) {
                  const repeatedComponentComponent = repeatedComponentComponents[repeatedComponentComponentKey];

                  repeatedComponentComponent.key = repeatedComponentComponent.key.replace(/(\d+)$/, '') + counter;
                  repeatedComponentComponent.value = undefined;

                  // antForm.setFieldValue(repeatedComponentComponent.key, undefined)
                }

                component.components.push(repeatedComponent);
              }

              component.gridRows = component.gridRows + 1;

              // processForm(root)
              setCacheKey('cache' + Math.random());

              console.log('Added list item', component);
            }}>
            <AiOutlinePlus />
            Add {component.label}
          </Button>
        </div>
      );
    } else if (component.type === 'Data Table') {
      return (
        <FormFieldDataTable
          scrollToFirstError
          key={component.key}
          label={component.label}
          isEditing={component.isEditable}
          isDisabled={component.isDisabled}
          defaultValue={component.data || []}
          connector={component.connector}
          dataPrimaryKey={component.dataPrimaryKey}
          dataSourceSearchConnector={component.dataSourceSearchConnector}
          dataSourceSearchPrimaryKey={component.dataSourceSearchPrimaryKey}
          onFetched={(data: any) => {
            for (const index in data) {
              for (const key in data[index]) {
                connectors[`${component.connector}[${index}]["${key}"]`] = data[index][key];
                connectors[`${component.key}[${index}]["${key}"]`] = data[index][key];
              }
            }
            console.log('merging', component.data, data);
            component.__data = _.defaultsDeep(component.data || {}, data);
            component.__original_data = JSON.parse(JSON.stringify(data || []));

            processForm(root);
            setCacheKey('cache' + Math.random());
          }}
          params={{
            current: 1,
            pageSize: 10,
            // ...params,
          }}
          columns={
            component.components
              ?.filter((option: any) => option.isVisible)
              .map((option: any) => ({
                title: (
                  <div css={css``}>
                    {option.text}
                    <div
                      css={css`
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        padding: 2px 10px 0 10px;
                        height: 50px;
                        // background: #eee;
                        border-top: 1px solid rgba(0, 0, 0, 0.3);
                      `}
                      onClick={(e: any) => {
                        e.stopPropagation();
                      }}>
                      {option.type === 'Select' ? (
                        <FormFieldSelect
                          name={`Select-${cacheKey}`}
                          options={() =>
                            component.options.map((option: any) => ({
                              text: option,
                              value: option,
                            })) || []
                          }
                          onChange={(value: any) => {
                            // setFieldConfiguration({
                            //   ...fieldConfiguration,
                            //   Value: value,
                            // });
                          }}
                          isEditing
                          defaultValue={localParams[`DataSource-${component.connector}-${option.text}`]}
                          elementCss={css`
                            // border-radius: 0;
                          `}
                        />
                      ) : option.type === 'Date' ? (
                        <FormFieldDate
                          name={`Date-${cacheKey}`}
                          onChange={(value: any) => {
                            // setFieldConfiguration({
                            //   ...fieldConfiguration,
                            //   Value: value,
                            // });
                          }}
                          isEditing
                          defaultValue={localParams[`DataSource-${component.connector}-${option.text}`]}
                          elementCss={css`
                            // border-radius: 0;
                          `}
                        />
                      ) : option.type === 'Text Box' ? (
                        <FormFieldText
                          name={`Text-${cacheKey}`}
                          defaultValue={localParams[`DataSource-${component.connector}-${option.text}`]}
                          isEditing
                          onChange={(text: any) => {
                            if (component.connector) {
                              history(
                                `${window.location.pathname.replace('/interfaces', '')}?${qs.stringify({
                                  ...localParams,
                                  [`DataSource-${component.connector}-${option.text}`]: text,
                                })}`
                              );
                            }
                          }}
                          elementCss={css`
                            // border-radius: 0;
                            box-shadow: 0px 0px 5px #ddd;
                          `}
                          css={css`
                            min-width: 100px;
                          `}
                        />
                      ) : null}
                    </div>
                  </div>
                ),
                filterIcon: (filtered: boolean) => <></>,
                onFilter: (value: string, record: any) =>
                  record[option.text].toLowerCase().indexOf(value.toLowerCase()) !== -1,
                filteredValue: localParams[`DataSource-${component.connector}-${option.text}`]
                  ? [localParams[`DataSource-${component.connector}-${option.text}`]]
                  : [],
                dataIndex: option.text,
                key: option.text,
                // align: 'center',
                render: (text: any, record: any, xx: any) => {
                  return option.type === 'Select' ? (
                    <div>select</div>
                  ) : option.type === 'Date' ? (
                    <FormFieldDate
                      name={`Date-${cacheKey}`}
                      onChange={(value: any) => {
                        // setFieldConfiguration({
                        //   ...fieldConfiguration,
                        //   Value: value,
                        // });
                      }}
                      isEditing
                      defaultValue={localParams[`DataSource-${component.connector}-${option.text}`]}
                      elementCss={css`
                        // border-radius: 0;
                      `}
                    />
                  ) : option.type === 'Text Box' ? (
                    <FormFieldText
                      name={text}
                      defaultValue={text}
                      isEditing={component.isEditable}
                      onChange={(text2: any, something: any, xxx: any) => {
                        record[option.text] = text2;
                      }}
                      elementCss={css`
                        // border-radius: 0;
                        box-shadow: 0px 0px 5px #ddd;
                      `}
                      css={css`
                        min-width: 100px;
                      `}
                    />
                  ) : null;
                },

                sorter: (a: any, b: any) => {
                  return a[option.text].localeCompare(b[option.text]);
                },
              })) || []
          }
          isLoading={isLoading}
        />
      );
    } else if (component.type === 'Section') {
      return (
        <div className="form-field-section" key={component.key}>
          <h2>{component.label}</h2>
          <div
            onClick={(e) => {
              console.log('setting new component');
              setCacheKey('cache' + Math.random());

              e.stopPropagation();
            }}
            css={css`
              margin-top: 10px;
            `}>
            {renderComponent({
              id: generateUuid(),
              key: generateUuid(),
              type: 'Grid',
              isRequired: true,
              isEditable: true,
              isDisabled: false,
              hasValidation: false,
              hasAttachment: false,
              gridRows: 1,
              gridColumns: 1,
              actions: [],
              options: [],
              components: component.components,
            })}
          </div>
        </div>
      );
    } else if (component.type === 'Page Break') {
      return <div key={component.key}>---</div>;
    } else {
      // @ts-ignore
      const C = formFieldTypes[component.type];

      if (!C) {
        console.log('Component type not found: ' + component.type);
        return <>Component type not found.</>;
      }
      console.log('22222', component);
      return (
        <div css={isNexus() && component.type === 'Content' && component.value ? css`` : css``}>
          <C
            Item={Form.Item}
            key={component.key + (component.isEditable ? '' : component.value)}
            name={component.key + (component.isEditable ? '' : component.value)}
            form={antForm}
            label={component.label}
            placeholder={component.placeholder || ''}
            defaultValue={component.value}
            colon={false}
            isEditing={component.isEditable}
            isEditable={component.isEditable}
            isRequired={component.isRequired}
            isDisabled={component.isDisabled}
            isCustomAllowed={component.isCustomAllowed}
            validation={component.validation}
            type={component.subType}
            note={component.note}
            record={component}
            onChange={(value: any) => {
              console.log(`Setting ${component.key} to ${value}`);
              antForm.setFieldValue(component.key, value);
              set(component, 'value', value);

              if (component.__original) {
                component.__original.value = value;
                console.log(`Setting ${component.__original.key} to ${value}`);
                antForm.setFieldValue(component.__original.key, value);
              }

              processForm(root);
            }}
            onClick={() => {
              console.log('Clicked');
              if (component.actions?.includes('Go Home')) {
                history('/');
              }
            }}
            options={() =>
              component.options?.map((option: any) => ({
                text: option,
                value: option,
              })) || []
            }>
            {component.label}
          </C>
        </div>
      );
    }
  }

  console.log('5555', root);

  const connectorsByEvent: any = {
    'On Submit': [],
    'On Change': [],
  };

  if (root.connectors) {
    for (const connector of root.connectors) {
      connectorsByEvent[connector.event] = connector;
    }
  }

  const next = async () => {
    if (settings.Validation) {
      console.log('33333', root);
      processForm(root);
      console.log('3333 44444', root);

      await antForm
        .validateFields()
        .then(async (values: any) => {
          console.log('ghghgh', values);
          for (const connector of connectorsByEvent['On Submit']) {
            const res = await serviceValidate({
              args: {
                key: connector.endpoint.replace('=$designer/', ''),
                form: root,
              },
            });

            if (!res) {
              prompt.error({
                message: 'Error',
                description: 'Could not get data (E302)',
                placement: 'topRight' as any,
                duration: 5,
              });
              return;
            }

            // Override form values with service response
            for (const c1 of root.components) {
              for (const c2 of c1.components) {
                if (res.values[c2.key]) {
                  c2.value = res.values[c2.key];
                  antForm.setFieldValue(c2.key, res.values[c2.key]);
                }
              }
            }

            // for (const name in res.values) {
            //   antForm.setFieldValue(name, res.values[name])
            // }

            // Processes calculated fields and such
            processForm(root);

            if (!res.success) {
              console.log('Not successful', res);

              prompt.error({
                message: 'Error',
                description: 'Please fix the errors',
                placement: 'topRight' as any,
                duration: 5,
              });

              for (const name in res.errors) {
                console.log(`Field ${name} = ${res.errors[name].message}`);

                antForm.setFields([
                  {
                    name,
                    errors: [res.errors[name].message],
                  },
                ]);
              }

              return;
            }

            // root.services[0].endpoint.replace('=$designer', '')
          }

          window.scrollTo(0, 0);
          setCurrentStep(currentStep + 1);
        })
        .catch((err) => {
          console.warn(err);
          prompt.error({
            message: 'Error',
            description: 'Please fix the errors (E302)',
            placement: 'topRight' as any,
            duration: 5,
          });
        });
    } else {
      window.scrollTo(0, 0);
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const components = root.components;
  const componentGroups = [];
  const componentStepItems = [];
  const containsPageBreaks = !!components.find((c: any) => c.type === 'Page Break');

  if (containsPageBreaks) {
    let groupIndex = -1;

    for (const component of components) {
      if (component.type === 'Page Break') {
        groupIndex++;
        componentStepItems.push({ key: component.key, title: component.label });
        continue;
      }

      if (!componentGroups[groupIndex]) componentGroups[groupIndex] = [];

      componentGroups[groupIndex].push(component);
    }
  } else {
    componentGroups.push(components);
  }

  return (
    <>
      <div
        css={
          isNexus()
            ? css`
        overflow-wrap break-word;
        padding-left 37.5px;
        padding-right 37.5px;
        text-align: left;

        .ant-checkbox-wrapper {
          align-self: center;
        }
    
        .ant-form-item .ant-form-item-label >label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
          padding-top: 5px;
        }
            `
            : css`
        overflow-wrap break-word;
        padding-left 37.5px;
        padding-right 37.5px;

        .ant-checkbox-wrapper {
          align-self: center;
        }

        // .ant-col {
        //   overflow: visible !important;
        // }

        .ant-col p {
          margin: 12px 0;
        }

        .ant-col p:first-child {
          margin: 0 0 12px;
        }

        .ant-col p:last-child {
          margin: 12px 0 0;
        }

        .ant-col p, span.ant-radio, span.ant-radio+* {
          font-size: 14px;
        }

        label.ant-form-item-required {
          position: relative;
        }

        .ant-form-item .ant-form-item-label >label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
          // position: absolute;
          // top: 0;
          // right: -15px;
        }

        // .ant-form-item .ant-form-item-label >label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
        //   display: none;
        // }

        .ant-form-item .ant-form-item-control-input {
          min-height: auto;
        }

        .ant-radio-wrapper .ant-radio-inner, .ant-input {
          border-color: rgb(204, 204, 204);
        }

        .ant-form-item-control:not(:first-child) {
          padding-top: 6px;
        }
        
        .ant-input {
          // border-radius: 0;
        }

        .ant-form-item {
          margin: 6px 0;
        }

        h1, h2, h3, h4, h5 {
          font-family: "Open Sans Condensed",Helvetica,sans-serif;
          font-weight: 700;
        }

        .ant-form-item-label {
          // padding: 6px 0 0 0;
          // line-height: 22px;
        }

        .ant-form-item-label >label {
          height: auto;
          font-size: 16px;
          line-height: 20px;
          font-weight: 700;
          font-family: "Open Sans Condensed",Helvetica,sans-serif;

          &:before {
            font-size: 20px !important;
          }
        }
      `
        }>
        <Form
          {...layout}
          name="main-form"
          form={antForm}
          initialValues={initialFormValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          // requiredMark={customizeRequiredMark}
          // validateTrigger={['onSubmit', 'onChange']}
          style={{
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            color: '#000',
            margin: '10px auto',
          }}
          validateMessages={validateMessages}
          scrollToFirstError
          autoComplete="off">
          {componentGroups.length > 0 ? (
            <Steps
              labelPlacement="vertical"
              size="small"
              current={currentStep}
              css={css`
                margin: 20px 0 40px;
              `}>
              {componentStepItems.map((step: any) => (
                <Step key={step.key} title={step.title} />
              ))}
            </Steps>
          ) : null}
          {componentGroups.length > 0
            ? componentGroups[currentStep].map((component: any) => renderComponent(component))
            : null}
          <Row justify="space-between" style={{ width: '100%', marginTop: 40 }}>
            {submission?.status !== 'Submitted' ? (
              <Button
                type="primary"
                onClick={() => {
                  console.log('vvv2222', antForm.getFieldsValue());
                  onFinish(antForm.getFieldsValue(), true);

                  // antForm
                  //   .validateFields()
                  //   .then((values: any) => {
                  //     console.log(antForm.getFieldsValue(), values)
                  //     onFinish(values, true)
                  //   })
                  //   .catch((err) => {
                  //     prompt.error({
                  //       message: 'Error',
                  //       description: 'Please fix the errors (E303)',
                  //       placement: 'topRight' as any,
                  //       duration: 5,
                  //     })
                  //   })
                }}>
                Save Draft
              </Button>
            ) : null}
            {componentGroups.length > 0 ? (
              <div>
                {currentStep > 0 && (
                  <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                    Previous
                  </Button>
                )}
                {currentStep < componentGroups.length - 1 && (
                  <Button type="primary" onClick={() => next()}>
                    Next
                  </Button>
                )}
                {(componentGroups.length === 0 || currentStep === componentGroups.length - 1) &&
                submission?.status !== 'Submitted' ? (
                  <SubmitButton type="primary" htmlType="submit">
                    Submit
                  </SubmitButton>
                ) : null}
                {/* {currentStep === componentGroups.length - 1 && (
                <Button type="primary" onClick={() => alert('Processing complete!')}>
                  Done
                </Button>
              )} */}
              </div>
            ) : null}
          </Row>
        </Form>

        <div style={{ color: '#fff' }}>{cacheKey}</div>
      </div>
    </>
  );
}

const SubmitButton = styled(Button)``;

const CancelButton = styled(Button)``;
