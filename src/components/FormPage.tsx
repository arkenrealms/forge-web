import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetModel } from '@arken/forge-ui/hooks'
import Form from '~/components/Form'
import Layout from '~/components/Layout'
import Error from '~/components/Error'

export default ({ formKey }: any) => {
  const {
    isLoading,
    data: form,
    error,
    refetch,
  }: any = useGetModel({
    key: 'Form',
    action: 'findFirstForm',
    gql: `
      query findFirstForm($where: FormWhereInput!) {
        findFirstForm(where: $where) {
          id
          key
          title
          version
          meta
          status
          showInNav
          theme
          components {
            ...componentFields
            components {
              ...componentFields
              components {
                ...componentFields
                components {
                  ...componentFields
                  components {
                    ...componentFields
                  }
                }
              }
            }
          }
          connectors {
            key
            type
            event
            protocol
            endpoint
          }
        }
      }
        
      fragment componentFields on FormComponent {
        id
        key
        type
        subType
        label
        note
        placeholder
        value
        isRequired
        isEditable
        isHidden
        isDisabled
        isCustomAllowed
        hasValidation
        hasAttachment
        gridRows
        gridColumns
        connector
        dataPrimaryKey
        data
        actions
        options
        validation {
          numberFormat
          currencyFormat
          dateFormat
          emailFormat
          phoneFormat
          postalFormat
          range
          endpoint
        }
      }
  `,
    variables: {
      where: {
        key: { equals: formKey },
      },
    },
  })

  if (error || form === null) {
    return (
      <Layout>
        <Error />
      </Layout>
    )
  }

  return (
    <Layout>
      <Form form={form} isLoading={isLoading} submission={{}} />
    </Layout>
  )
}
