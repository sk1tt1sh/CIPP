import { useLazyGenericGetRequestQuery, useLazyGenericPostRequestQuery } from 'src/store/api/app.js'
import {
  CButton,
  CCallout,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CForm,
  CSpinner,
} from '@coreui/react'
import { Form } from 'react-final-form'
import { RFFSelectSearch, RFFCFormSwitch } from 'src/components/forms/index.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { CippCallout } from 'src/components/layout/index.js'

/**
 * Retrieves and sets the extension mappings for HaloPSA and NinjaOne.
 *
 * @returns {JSX.Element} - JSX component representing the settings extension mappings.
 */
export function SettingsExtensionMappings() {
  const [listHaloBackend, listBackendHaloResult = []] = useLazyGenericGetRequestQuery()
  const [setHaloExtensionconfig, extensionHaloConfigResult = []] = useLazyGenericPostRequestQuery()

  const [listAutotaskBackend, listBackendAutotaskResult = []] = useLazyGenericGetRequestQuery()
  const [listAutotaskManagedBackend, listBackendAutotaskManagedResult] =
    useLazyGenericGetRequestQuery()
  const [setAutotaskExtensionconfig, extensionAutotaskConfigResult] =
    useLazyGenericPostRequestQuery()
  const [setAutotaskManagedExtensionconfig, extensionAutotaskManagedConfigResult] =
    useLazyGenericPostRequestQuery()

  const [setIronScalesExtensionconfig, extensionIronScalesConfigResult] =
    useLazyGenericPostRequestQuery()
  const [listIronScalesBackend, listBackendIronScalesResult = []] = useLazyGenericGetRequestQuery()

  const [listNinjaOrgsBackend, listBackendNinjaOrgsResult] = useLazyGenericGetRequestQuery()
  const [listNinjaFieldsBackend, listBackendNinjaFieldsResult] = useLazyGenericGetRequestQuery()
  const [setNinjaOrgsExtensionconfig, extensionNinjaOrgsConfigResult] =
    useLazyGenericPostRequestQuery()
  const [setNinjaOrgsExtensionAutomap, extensionNinjaOrgsAutomapResult] =
    useLazyGenericPostRequestQuery()
  const [setNinjaFieldsExtensionconfig, extensionNinjaFieldsConfigResult] =
    useLazyGenericPostRequestQuery()

  const onHaloSubmit = (values) => {
    setHaloExtensionconfig({
      path: 'api/ExecExtensionMapping?AddMapping=Halo',
      values: { mappings: values },
    })
  }

  const onAutotaskSubmit = (values) => {
    console.log(JSON.stringify(values))
    setAutotaskExtensionconfig({
      path: 'api/ExecExtensionMapping?AddMapping=Autotask',
      values: { mappings: values },
    })
  }

  const onIronScalesSubmit = (values) => {
    setIronScalesExtensionconfig({
      path: 'api/ExecExtensionMapping?AddMapping=IronScales',
      values: { mappings: values },
    })
  }

  const onAutotaskManagedSubmit = (values) => {
    console.log(JSON.stringify(values))
    setAutotaskManagedExtensionconfig({
      path: 'api/ExecExtensionMapping?AddMapping=AutotaskManaged',
      values: values,
    })
  }

  const onNinjaOrgsSubmit = (values) => {
    setNinjaOrgsExtensionconfig({
      path: 'api/ExecExtensionMapping?AddMapping=NinjaOrgs',
      values: { mappings: values },
    })
  }

  const onNinjaOrgsAutomap = async (values) => {
    await setNinjaOrgsExtensionAutomap({
      path: 'api/ExecExtensionMapping?AutoMapping=NinjaOrgs',
      values: { mappings: values },
    })
    await listNinjaOrgsBackend({
      path: 'api/ExecExtensionMapping?List=NinjaOrgs',
    })
  }

  const onNinjaFieldsSubmit = (values) => {
    setNinjaFieldsExtensionconfig({
      path: 'api/ExecExtensionMapping?AddMapping=NinjaFields',

      values: { mappings: values },
    })
  }

  return (
    <div>
      {listBackendHaloResult.isUninitialized &&
        listHaloBackend({ path: 'api/ExecExtensionMapping?List=Halo' })}
      {listBackendNinjaOrgsResult.isUninitialized &&
        listNinjaOrgsBackend({ path: 'api/ExecExtensionMapping?List=NinjaOrgs' })}
      {listBackendNinjaFieldsResult.isUninitialized &&
        listNinjaFieldsBackend({ path: 'api/ExecExtensionMapping?List=NinjaFields' })}
      {listBackendAutotaskResult.isUninitialized &&
        listAutotaskBackend({ path: 'api/ExecExtensionMapping?List=Autotask' })}
      {listBackendAutotaskManagedResult.isUninitialized &&
        listAutotaskManagedBackend({ path: 'api/ExecExtensionMapping?List=AutotaskManaged' })}
      {listBackendIronScalesResult.isUninitialized &&
        listIronScalesBackend({ path: 'api/ExecExtensionMapping?List=IronScales' })}
      <>
        <CCard className="mb-3">
          <CCardHeader>
            <CCardTitle>Autotask Mapping Table</CCardTitle>
          </CCardHeader>
          <CCardBody>
            {listBackendAutotaskResult.isFetching ? (
              <CSpinner color="primary" />
            ) : (
              <Form
                id={'AT Mapping'}
                onSubmit={onAutotaskSubmit}
                initialValues={listBackendAutotaskResult.data?.Mappings}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm onSubmit={handleSubmit}>
                      <CCardText>
                        Use the table below to map your client to the correct PSA client
                        {listBackendAutotaskResult.isSuccess &&
                          listBackendAutotaskResult.data.Tenants?.map((tenant) => (
                            <RFFSelectSearch
                              key={tenant.displayName}
                              name={tenant.customerId}
                              label={tenant.displayName}
                              values={listBackendAutotaskResult.data.AutotaskCustomers}
                              placeholder="Select a client"
                            />
                          ))}
                      </CCardText>
                      <CCol className="me-2">
                        <CButton className="me-2" type="submit">
                          {extensionAutotaskConfigResult.isFetching && (
                            <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                          )}
                          Set Mappings
                        </CButton>
                        {(extensionAutotaskConfigResult.isSuccess ||
                          extensionAutotaskConfigResult.isError) && (
                          <CCallout
                            color={extensionAutotaskConfigResult.isSuccess ? 'success' : 'danger'}
                          >
                            {extensionAutotaskConfigResult.isSuccess
                              ? extensionAutotaskConfigResult.data.Results
                              : 'Error'}
                          </CCallout>
                        )}
                      </CCol>
                    </CForm>
                  )
                }}
              />
            )}
          </CCardBody>
        </CCard>
        <CCard className="mb-3">
          <CCardHeader>
            <CCardTitle>IronScales Mapping Table</CCardTitle>
          </CCardHeader>
          <CCardBody>
            {listBackendIronScalesResult.isFetching ? (
              <CSpinner color="primary" />
            ) : (
              <Form
                onSubmit={onIronScalesSubmit}
                initialValues={listBackendIronScalesResult.data?.Mappings}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm onSubmit={handleSubmit}>
                      <CCardText>
                        Use the table below to map your client to the correct PSA client
                        {listBackendIronScalesResult.isSuccess &&
                          listBackendIronScalesResult.data.Tenants?.map((tenant) => (
                            <RFFSelectSearch
                              key={tenant.displayName}
                              name={tenant.customerId}
                              label={tenant.displayName}
                              values={listBackendIronScalesResult.data.IronScalesCompanies}
                              placeholder="Select a client"
                            />
                          ))}
                      </CCardText>
                      <CCol className="me-2">
                        <CButton className="me-2" type="submit">
                          {extensionIronScalesConfigResult.isFetching && (
                            <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                          )}
                          Set Mappings
                        </CButton>
                        {(extensionIronScalesConfigResult.isSuccess ||
                          extensionIronScalesConfigResult.isError) && (
                          <CCallout
                            color={extensionIronScalesConfigResult.isSuccess ? 'success' : 'danger'}
                          >
                            {extensionIronScalesConfigResult.isSuccess
                              ? extensionIronScalesConfigResult.data.Results
                              : 'Error'}
                          </CCallout>
                        )}
                      </CCol>
                    </CForm>
                  )
                }}
              />
            )}
          </CCardBody>
        </CCard>
        <CCard className="mb-3">
          <CCardHeader>
            <CCardTitle>Autotask Managed Customers</CCardTitle>
          </CCardHeader>
          <CCardBody>
            {listBackendAutotaskManagedResult.isFetching ? (
              <CSpinner color="primary" />
            ) : (
              <Form
                onSubmit={onAutotaskManagedSubmit}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm onSubmit={handleSubmit}>
                      <CCardText>
                        Use the table below to toggle which customers are under Managed Services
                        {listBackendAutotaskManagedResult.isSuccess &&
                          listBackendAutotaskManagedResult.data.ManagedCusts?.map((at) => (
                            <RFFCFormSwitch
                              name={at.name}
                              label={at.label}
                              key={at.aid}
                              initialValue={at.value}
                            />
                          ))}
                      </CCardText>
                      <CCol className="me-2">
                        <CButton className="me-2" type="submit">
                          {extensionAutotaskManagedConfigResult.isFetching && (
                            <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                          )}
                          Set Mappings
                        </CButton>
                        <CButton
                          onClick={() =>
                            listAutotaskManagedBackend({
                              path: 'api/ExecExtensionMapping?List=AutotaskManaged',
                            })
                          }
                          className="me-2"
                        >
                          Reload Managed Customers
                        </CButton>
                        {(extensionAutotaskManagedConfigResult.isSuccess ||
                          extensionAutotaskManagedConfigResult.isError) && (
                          <CCallout
                            color={
                              extensionAutotaskManagedConfigResult.isSuccess ? 'success' : 'danger'
                            }
                          >
                            {extensionAutotaskManagedConfigResult.isSuccess
                              ? extensionAutotaskManagedConfigResult.data.Results
                              : 'Error'}
                          </CCallout>
                        )}
                      </CCol>
                    </CForm>
                  )
                }}
              />
            )}
          </CCardBody>
        </CCard>
        <CCard className="mb-3">
          <CCardHeader>
            <CCardTitle>HaloPSA Mapping Table</CCardTitle>
          </CCardHeader>
          <CCardBody>
            {listBackendHaloResult.isFetching ? (
              <CSpinner color="primary" />
            ) : (
              <Form
                onSubmit={onHaloSubmit}
                initialValues={listBackendHaloResult.data?.Mappings}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm onSubmit={handleSubmit}>
                      <CCardText>
                        Use the table below to map your client to the correct PSA client
                        {listBackendHaloResult.isSuccess &&
                          listBackendHaloResult.data.Tenants?.map((tenant) => (
                            <RFFSelectSearch
                              key={tenant.customerId}
                              name={tenant.customerId}
                              label={tenant.displayName}
                              values={listBackendHaloResult.data.HaloClients}
                              placeholder="Select a client"
                            />
                          ))}
                      </CCardText>
                      <CCol className="me-2">
                        <CButton className="me-2" type="submit">
                          {extensionHaloConfigResult.isFetching && (
                            <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                          )}
                          Set Mappings
                        </CButton>
                        {(extensionHaloConfigResult.isSuccess ||
                          extensionHaloConfigResult.isError) &&
                          !extensionHaloConfigResult.isFetching && (
                            <CippCallout
                              color={extensionHaloConfigResult.isSuccess ? 'success' : 'danger'}
                              dismissible
                              style={{ marginTop: '16px' }}
                            >
                              {extensionHaloConfigResult.isSuccess
                                ? extensionHaloConfigResult.data.Results
                                : 'Error'}
                            </CippCallout>
                          )}
                      </CCol>
                    </CForm>
                  )
                }}
              />
            )}
          </CCardBody>
        </CCard>
        <CCard className="mb-3">
          <CCardHeader>
            <CCardTitle>NinjaOne Field Mapping Table</CCardTitle>
          </CCardHeader>
          <CCardBody>
            {listBackendNinjaFieldsResult.isFetching ? (
              <CSpinner color="primary" />
            ) : (
              <Form
                onSubmit={onNinjaFieldsSubmit}
                initialValues={listBackendNinjaFieldsResult.data?.Mappings}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm onSubmit={handleSubmit}>
                      <CCardText>
                        <h5>Organization Global Custom Field Mapping</h5>
                        <p>
                          Use the table below to map your Organization Field to the correct NinjaOne
                          Field
                        </p>
                        {listBackendNinjaFieldsResult.isSuccess &&
                          listBackendNinjaFieldsResult.data.CIPPOrgFields.map((CIPPOrgFields) => (
                            <RFFSelectSearch
                              key={CIPPOrgFields.InternalName}
                              name={CIPPOrgFields.InternalName}
                              label={CIPPOrgFields.Type + ' - ' + CIPPOrgFields.Description}
                              values={listBackendNinjaFieldsResult.data.NinjaOrgFields.filter(
                                (item) => item.type === CIPPOrgFields.Type || item.type === 'unset',
                              )}
                              placeholder="Select a Field"
                            />
                          ))}
                      </CCardText>
                      <CCardText>
                        <h5>Device Custom Field Mapping</h5>
                        <p>
                          Use the table below to map your Device field to the correct NinjaOne
                          WYSIWYG Field
                        </p>
                        {listBackendNinjaFieldsResult.isSuccess &&
                          listBackendNinjaFieldsResult.data.CIPPNodeFields.map((CIPPNodeFields) => (
                            <RFFSelectSearch
                              key={CIPPNodeFields.InternalName}
                              name={CIPPNodeFields.InternalName}
                              label={CIPPNodeFields.Type + ' - ' + CIPPNodeFields.Description}
                              values={listBackendNinjaFieldsResult.data.NinjaNodeFields.filter(
                                (item) =>
                                  item.type === CIPPNodeFields.Type || item.type === 'unset',
                              )}
                              placeholder="Select a Field"
                            />
                          ))}
                      </CCardText>
                      <CCol className="me-2">
                        <CButton className="me-2" type="submit">
                          {extensionNinjaFieldsConfigResult.isFetching && (
                            <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                          )}
                          Set Mappings
                        </CButton>
                        {(extensionNinjaFieldsConfigResult.isSuccess ||
                          extensionNinjaFieldsConfigResult.isError) &&
                          !extensionNinjaFieldsConfigResult.isFetching && (
                            <CippCallout
                              color={
                                extensionNinjaFieldsConfigResult.isSuccess ? 'success' : 'danger'
                              }
                              dismissible
                              style={{ marginTop: '16px' }}
                            >
                              {extensionNinjaFieldsConfigResult.isSuccess
                                ? extensionNinjaFieldsConfigResult.data.Results
                                : 'Error'}
                            </CippCallout>
                          )}
                      </CCol>
                    </CForm>
                  )
                }}
              />
            )}
          </CCardBody>
        </CCard>
        <CCard className="mb-3">
          <CCardHeader>
            <CCardTitle>NinjaOne Organization Mapping Table</CCardTitle>
          </CCardHeader>
          <CCardBody>
            {listBackendNinjaOrgsResult.isFetching ? (
              <CSpinner color="primary" />
            ) : (
              <Form
                onSubmit={onNinjaOrgsSubmit}
                initialValues={listBackendNinjaOrgsResult.data?.Mappings}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm onSubmit={handleSubmit}>
                      <CCardText>
                        Use the table below to map your client to the correct NinjaOne Organization
                        {listBackendNinjaOrgsResult.isSuccess &&
                          listBackendNinjaOrgsResult.data.Tenants.map((tenant) => (
                            <RFFSelectSearch
                              key={tenant.customerId}
                              name={tenant.customerId}
                              label={tenant.displayName}
                              values={listBackendNinjaOrgsResult.data.NinjaOrgs}
                              placeholder="Select an Organization"
                            />
                          ))}
                      </CCardText>
                      <CCol className="me-2">
                        <CButton className="me-2" type="submit">
                          {extensionNinjaOrgsConfigResult.isFetching && (
                            <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                          )}
                          Set Mappings
                        </CButton>
                        <CButton onClick={() => onNinjaOrgsAutomap()} className="me-2">
                          {extensionNinjaOrgsAutomapResult.isFetching && (
                            <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                          )}
                          Automap NinjaOne Organizations
                        </CButton>
                        {(extensionNinjaOrgsConfigResult.isSuccess ||
                          extensionNinjaOrgsConfigResult.isError) &&
                          !extensionNinjaFieldsConfigResult.isFetching && (
                            <CippCallout
                              color={
                                extensionNinjaOrgsConfigResult.isSuccess ? 'success' : 'danger'
                              }
                              dismissible
                              style={{ marginTop: '16px' }}
                            >
                              {extensionNinjaOrgsConfigResult.isSuccess
                                ? extensionNinjaOrgsConfigResult.data.Results
                                : 'Error'}
                            </CippCallout>
                          )}
                        {(extensionNinjaOrgsAutomapResult.isSuccess ||
                          extensionNinjaOrgsAutomapResult.isError) && (
                          <CCallout
                            color={extensionNinjaOrgsAutomapResult.isSuccess ? 'success' : 'danger'}
                          >
                            {extensionNinjaOrgsAutomapResult.isSuccess
                              ? extensionNinjaOrgsAutomapResult.data.Results
                              : 'Error'}
                          </CCallout>
                        )}
                      </CCol>
                    </CForm>
                  )
                }}
              />
            )}
          </CCardBody>
        </CCard>
      </>
    </div>
  )
}
