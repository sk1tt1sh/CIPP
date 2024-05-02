import { useLazyGenericGetRequestQuery, useLazyGenericPostRequestQuery } from 'src/store/api/app.js'
import { CButton, CCallout, CCardText, CCol, CForm, CRow, CSpinner, CTooltip } from '@coreui/react'
import { Form } from 'react-final-form'
import { RFFSelectSearch, RFFCFormSwitch } from 'src/components/forms/index.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect } from 'react'
import { CippCallout } from 'src/components/layout/index.js'
import CippButtonCard from 'src/components/contentcards/CippButtonCard'
import { CippTable } from 'src/components/tables'
import { CellTip } from 'src/components/tables/CellGenericFormat'

/**
 * Retrieves and sets the extension mappings for HaloPSA and NinjaOne.
 *
 * @returns {JSX.Element} - JSX component representing the settings extension mappings.
 */
export function SettingsExtensionMappings() {
  const [addedAttributes, setAddedAttribute] = React.useState(1)
  const [mappingArray, setMappingArray] = React.useState('defaultMapping')
  const [mappingValue, setMappingValue] = React.useState({})
  const [haloMappingsArray, setHaloMappingsArray] = React.useState([])
  const [ninjaMappingsArray, setNinjaMappingsArray] = React.useState([])
  const [HaloAutoMap, setHaloAutoMap] = React.useState(false)
  const [listHaloBackend, listBackendHaloResult = []] = useLazyGenericGetRequestQuery()
  const [setHaloExtensionconfig, extensionHaloConfigResult = []] = useLazyGenericPostRequestQuery()

  const [AutotaskAutoMap, setAutotaskAutoMap] = React.useState(false)
  const [autotaskMappingsArray, setAutotaskMappingsArray] = React.useState([])
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

  const [setAutotaskExtensionAutomap, extensionAutotaskAutomapResult] =
    useLazyGenericPostRequestQuery()

  const onHaloSubmit = () => {
    const originalFormat = haloMappingsArray.reduce((acc, item) => {
      acc[item.Tenant?.customerId] = { label: item.haloName, value: item.haloId }
      return acc
    }, {})
    setHaloExtensionconfig({
      path: 'api/ExecExtensionMapping?AddMapping=Halo',
      values: { mappings: originalFormat },
    })
  }

  const onAutotaskSubmit = () => {
    const originalFormat = autotaskMappingsArray.reduce((acc, item) => {
      acc[item.Tenant?.customerId] = { label: item.autotaskname, value: item.autotaskId }
      return acc
    }, {})
    setAutotaskExtensionconfig({
      path: 'api/ExecExtensionMapping?AddMapping=Autotask',
      values: { mappings: originalFormat },
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
  const onNinjaOrgsSubmit = () => {
    const originalFormat = ninjaMappingsArray.reduce((acc, item) => {
      acc[item.Tenant?.customerId] = { label: item.ninjaName, value: item.ninjaId }
      return acc
    }, {})

    setNinjaOrgsExtensionconfig({
      path: 'api/ExecExtensionMapping?AddMapping=NinjaOrgs',
      values: { mappings: originalFormat },
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

  const onHaloAutomap = () => {
    const newMappings = listBackendHaloResult.data?.Tenants.map(
      (tenant) => {
        const haloClient = listBackendHaloResult.data?.HaloClients.find(
          (client) => client.name === tenant.displayName,
        )
        if (haloClient) {
          console.log(haloClient)
          console.log(tenant)
          return {
            Tenant: tenant,
            haloName: haloClient.name,
            haloId: haloClient.value,
          }
        }
      },
      //filter out any undefined values
    ).filter((item) => item !== undefined)
    setHaloMappingsArray((currentHaloMappings) => [...currentHaloMappings, ...newMappings])

    setHaloAutoMap(true)
  }

  const onAutotaskAutomap = () => {
    // const newMappings = listBackendHaloResult.data?.Tenants.map(
    //   (tenant) => {
    //     const haloClient = listBackendHaloResult.data?.HaloClients.find(
    //       (client) => client.name === tenant.displayName,
    //     )
    //     if (haloClient) {
    //       console.log(haloClient)
    //       console.log(tenant)
    //       return {
    //         Tenant: tenant,
    //         haloName: haloClient.name,
    //         haloId: haloClient.value,
    //       }
    //     }
    //   },
    //   //filter out any undefined values
    // ).filter((item) => item !== undefined)
    // setHaloMappingsArray((currentHaloMappings) => [...currentHaloMappings, ...newMappings])
    // setHaloAutoMap(true)
  }

  useEffect(() => {
    if (listBackendHaloResult.isSuccess) {
      setHaloMappingsArray(
        Object.keys(listBackendHaloResult.data?.Mappings).map((key) => ({
          Tenant: listBackendHaloResult.data?.Tenants.find((tenant) => tenant.customerId === key),
          haloName: listBackendHaloResult.data?.Mappings[key].label,
          haloId: listBackendHaloResult.data?.Mappings[key].value,
        })),
      )
    }
  }, [listBackendHaloResult.isSuccess])

  useEffect(() => {
    if (listBackendAutotaskResult.isSuccess) {
      setAutotaskMappingsArray(
        Object.keys(listBackendAutotaskResult.data?.Mappings).map((key) => ({
          Tenant: listBackendAutotaskResult.data?.Tenants.find(
            (tenant) => tenant.customerId === key,
          ),
          autotaskname: listBackendAutotaskResult.data?.Mappings[key].label,
          autotaskId: listBackendAutotaskResult.data?.Mappings[key].value,
        })),
      )
    }
  }, [
    listBackendAutotaskResult.data?.Mappings,
    listBackendAutotaskResult.data?.Tenants,
    listBackendAutotaskResult.isSuccess,
  ])

  useEffect(() => {
    if (listBackendNinjaOrgsResult.isSuccess) {
      setNinjaMappingsArray(
        Object.keys(listBackendNinjaOrgsResult.data?.Mappings).map((key) => ({
          Tenant: listBackendNinjaOrgsResult.data?.Tenants.find(
            (tenant) => tenant.customerId === key,
          ),
          ninjaName: listBackendNinjaOrgsResult.data?.Mappings[key].label,
          ninjaId: listBackendNinjaOrgsResult.data?.Mappings[key].value,
        })),
      )
    }
  }, [
    listBackendNinjaOrgsResult.data?.Mappings,
    listBackendNinjaOrgsResult.data?.Tenants,
    listBackendNinjaOrgsResult.isSuccess,
  ])

  const Offcanvas = (row, rowIndex, formatExtraData) => {
    return (
      <>
        <CTooltip content="Remove Mapping">
          <CButton
            size="sm"
            variant="ghost"
            color="danger"
            onClick={() =>
              row.haloId
                ? setHaloMappingsArray((currentHaloMappings) =>
                    currentHaloMappings.filter((item) => item !== row),
                  )
                : setNinjaMappingsArray((currentNinjaMappings) =>
                    currentNinjaMappings.filter((item) => item !== row),
                  )
            }
          >
            <FontAwesomeIcon icon={'trash'} href="" />
          </CButton>
        </CTooltip>
      </>
    )
  }
  const halocolumns = [
    {
      name: 'Tenant',
      selector: (row) => row.Tenant?.displayName,
      sortable: true,
      cell: (row) => CellTip(row.Tenant?.displayName),
      exportSelector: 'Tenant',
    },
    {
      name: 'TenantId',
      selector: (row) => row.Tenant?.customerId,
      sortable: true,
      exportSelector: 'Tenant/customerId',
      omit: true,
    },
    {
      name: 'Halo Client Name',
      selector: (row) => row['haloName'],
      sortable: true,
      cell: (row) => CellTip(row['haloName']),
      exportSelector: 'haloName',
    },
    {
      name: 'Halo ID',
      selector: (row) => row['haloId'],
      sortable: true,
      cell: (row) => CellTip(row['haloId']),
      exportSelector: 'haloId',
    },
    {
      name: 'Actions',
      cell: Offcanvas,
      maxWidth: '80px',
    },
  ]

  const autotaskcolumns = [
    {
      name: 'Tenant',
      selector: (row) => row.Tenant?.displayName,
      sortable: true,
      cell: (row) => CellTip(row.Tenant?.displayName),
      exportSelector: 'Tenant',
    },
    {
      name: 'TenantId',
      selector: (row) => row.Tenant?.customerId,
      sortable: true,
      exportSelector: 'Tenant/customerId',
      omit: true,
    },
    {
      name: 'Autotask Client Name',
      selector: (row) => row['autotaskname'],
      sortable: true,
      cell: (row) => CellTip(row['autotaskname']),
      exportSelector: 'autotaskname',
    },
    {
      name: 'Autotask ID',
      selector: (row) => row['autotaskId'],
      sortable: true,
      cell: (row) => CellTip(row['autotaskId']),
      exportSelector: 'autotaskId',
    },
    {
      name: 'Actions',
      cell: Offcanvas,
      maxWidth: '80px',
    },
  ]

  const ninjacolumns = [
    {
      name: 'Tenant',
      selector: (row) => row.Tenant?.displayName,
      sortable: true,
      cell: (row) => CellTip(row.Tenant?.displayName),
      exportSelector: 'Tenant',
    },
    {
      name: 'TenantId',
      selector: (row) => row.Tenant?.customerId,
      sortable: true,
      exportSelector: 'Tenant/customerId',
      omit: true,
    },
    {
      name: 'NinjaOne Organization Name',
      selector: (row) => row['ninjaName'],
      sortable: true,
      cell: (row) => CellTip(row['ninjaName']),
      exportSelector: 'ninjaName',
    },
    {
      name: 'NinjaOne Organization ID',
      selector: (row) => row['ninjaId'],
      sortable: true,
      cell: (row) => CellTip(row['ninjaId']),
      exportSelector: 'ninjaId',
    },
    {
      name: 'Actions',
      cell: Offcanvas,
      maxWidth: '80px',
    },
  ]

  return (
    <CRow>
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
        <CCol className="mb-3" xs={6}>
          <CippButtonCard
            title={'Autotask Mapping'}
            titleType="big"
            isFetching={listAutotaskBackend.isFetching}
            CardButton={
              <>
                <CButton form="autotaskform" className="me-2" type="submit">
                  {extensionAutotaskConfigResult.isFetching && (
                    <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                  )}
                  Save Mappings
                </CButton>
                <CButton onClick={() => onAutotaskAutomap()} className="me-2">
                  {extensionAutotaskAutomapResult.isFetching && (
                    <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                  )}
                  Automap Autotask Clients
                </CButton>
              </>
            }
          >
            {listAutotaskBackend.isFetching ? (
              <CSpinner color="primary" />
            ) : (
              <Form
                onSubmit={onAutotaskSubmit}
                initialValues={listBackendAutotaskResult.data?.Mappings}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm id="autotaskform" onSubmit={handleSubmit}>
                      <CCardText>
                        Use the table below to map your client to the correct PSA client.
                        {
                          //load all the existing mappings and show them first in a table.
                          listBackendAutotaskResult.isSuccess && (
                            <CippTable
                              showFilter={true}
                              reportName="none"
                              columns={autotaskcolumns}
                              data={autotaskMappingsArray}
                              isModal={true}
                            />
                          )
                        }
                        <CRow>
                          <CCol xs={5}>
                            <RFFSelectSearch
                              placeholder="Select a Tenant"
                              name={`tenant_selector`}
                              values={listBackendAutotaskResult.data?.Tenants.map((tenant) => ({
                                name: tenant.displayName,
                                value: tenant.customerId,
                              }))}
                              onChange={(e) => {
                                setMappingArray(e.value)
                              }}
                            />
                          </CCol>
                          <CCol xs="1" className="d-flex justify-content-center align-items-center">
                            <FontAwesomeIcon icon={'link'} size="xl" className="my-4" />
                          </CCol>
                          <CCol xs="5">
                            <RFFSelectSearch
                              name={mappingArray}
                              values={listBackendAutotaskResult.data?.AutotaskCustomers.map(
                                (client) => ({
                                  name: client.name,
                                  value: client.value,
                                }),
                              )}
                              onChange={(e) => setMappingValue(e)}
                              placeholder="Select an Autotask Client"
                            />
                          </CCol>
                          <CButton
                            onClick={() =>
                              //set the new mapping in the array
                              setAutotaskMappingsArray([
                                ...autotaskMappingsArray,
                                {
                                  Tenant: listBackendAutotaskResult.data?.Tenants.find(
                                    (tenant) => tenant.customerId === mappingArray,
                                  ),
                                  autotaskname: mappingValue.label,
                                  autotaskId: mappingValue.value,
                                },
                              ])
                            }
                            className={`my-4 circular-button`}
                            title={'+'}
                          >
                            <FontAwesomeIcon icon={'plus'} />
                          </CButton>
                        </CRow>
                      </CCardText>
                      <CCol className="me-2">
                        {AutotaskAutoMap && (
                          <CCallout dismissible color="success">
                            Automapping has been executed. Remember to check the changes and save
                            them.
                          </CCallout>
                        )}
                        {(extensionAutotaskConfigResult.isSuccess ||
                          extensionAutotaskConfigResult.isError) &&
                          !extensionAutotaskConfigResult.isFetching && (
                            <CippCallout
                              color={extensionAutotaskConfigResult.isSuccess ? 'success' : 'danger'}
                              dismissible
                              style={{ marginTop: '16px' }}
                            >
                              {extensionAutotaskConfigResult.isSuccess
                                ? extensionAutotaskConfigResult.data.Results
                                : 'Error'}
                            </CippCallout>
                          )}
                      </CCol>
                      <small>
                        <FontAwesomeIcon icon={'triangle-exclamation'} className="me-2" />
                        After editing the mappings you must click Save Mappings for the changes to
                        take effect. The table will be saved exactly as presented.
                      </small>
                    </CForm>
                  )
                }}
              />
            )}
          </CippButtonCard>
        </CCol>
        <CCol className="mb-3" xs={6}>
          <CippButtonCard
            title={'IronScales Mapping'}
            titleType="big"
            isFetching={listIronScalesBackend.isFetching}
            CardButton={
              <>
                <CButton form="ironscalesform" className="me-2" type="submit">
                  {extensionIronScalesConfigResult.isFetching && (
                    <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                  )}
                  Save Mappings
                </CButton>
              </>
            }
          >
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
          </CippButtonCard>
        </CCol>
        <CCol className="mb-3" xs={6}>
          <CippButtonCard
            title={'Autotask Managed Mapping'}
            titleType="big"
            isFetching={listAutotaskManagedBackend.isFetching}
            CardButton={
              <>
                <CButton form="autotaskmanagedform" className="me-2" type="submit">
                  {extensionAutotaskManagedConfigResult.isFetching && (
                    <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                  )}
                  Save Mappings
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
              </>
            }
          >
            {listBackendAutotaskManagedResult.isFetching ? (
              <CSpinner color="primary" />
            ) : (
              <Form
                onSubmit={onAutotaskManagedSubmit}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm id="autotaskmanagedform" onSubmit={handleSubmit}>
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
          </CippButtonCard>
        </CCol>
        <CCol className="mb-3" xs={6}>
          <CippButtonCard
            title={'HaloPSA Mapping'}
            titleType="big"
            isFetching={listHaloBackend.isFetching}
            CardButton={
              <>
                <CButton form="haloform" className="me-2" type="submit">
                  {extensionHaloConfigResult.isFetching && (
                    <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                  )}
                  Save Mappings
                </CButton>
                <CButton onClick={() => onHaloAutomap()} className="me-2">
                  {extensionNinjaOrgsAutomapResult.isFetching && (
                    <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                  )}
                  Automap HaloPSA Clients
                </CButton>
              </>
            }
          >
            {listBackendHaloResult.isFetching ? (
              <CSpinner color="primary" />
            ) : (
              <Form
                onSubmit={onHaloSubmit}
                initialValues={listBackendHaloResult.data?.Mappings}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm id="haloform" onSubmit={handleSubmit}>
                      <CCardText>
                        Use the table below to map your client to the correct PSA client.
                        {
                          //load all the existing mappings and show them first in a table.
                          listBackendHaloResult.isSuccess && (
                            <CippTable
                              showFilter={true}
                              reportName="none"
                              columns={halocolumns}
                              data={haloMappingsArray}
                              isModal={true}
                            />
                          )
                        }
                        <CRow>
                          <CCol xs={5}>
                            <RFFSelectSearch
                              placeholder="Select a Tenant"
                              name={`tenant_selector`}
                              values={listBackendHaloResult.data?.Tenants.map((tenant) => ({
                                name: tenant.displayName,
                                value: tenant.customerId,
                              }))}
                              onChange={(e) => {
                                setMappingArray(e.value)
                              }}
                            />
                          </CCol>
                          <CCol xs="1" className="d-flex justify-content-center align-items-center">
                            <FontAwesomeIcon icon={'link'} size="xl" className="my-4" />
                          </CCol>
                          <CCol xs="5">
                            <RFFSelectSearch
                              name={mappingArray}
                              values={listBackendHaloResult.data?.HaloClients.map((client) => ({
                                name: client.name,
                                value: client.value,
                              }))}
                              onChange={(e) => setMappingValue(e)}
                              placeholder="Select a HaloPSA Client"
                            />
                          </CCol>
                          <CButton
                            onClick={() =>
                              //set the new mapping in the array
                              setHaloMappingsArray([
                                ...haloMappingsArray,
                                {
                                  Tenant: listBackendHaloResult.data?.Tenants.find(
                                    (tenant) => tenant.customerId === mappingArray,
                                  ),
                                  haloName: mappingValue.label,
                                  haloId: mappingValue.value,
                                },
                              ])
                            }
                            className={`my-4 circular-button`}
                            title={'+'}
                          >
                            <FontAwesomeIcon icon={'plus'} />
                          </CButton>
                        </CRow>
                      </CCardText>
                      <CCol className="me-2">
                        {HaloAutoMap && (
                          <CCallout dismissible color="success">
                            Automapping has been executed. Remember to check the changes and save
                            them.
                          </CCallout>
                        )}
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
                      <small>
                        <FontAwesomeIcon icon={'triangle-exclamation'} className="me-2" />
                        After editing the mappings you must click Save Mappings for the changes to
                        take effect. The table will be saved exactly as presented.
                      </small>
                    </CForm>
                  )
                }}
              />
            )}
          </CippButtonCard>
        </CCol>
        <CCol className="mb-3" xs={6}>
          {' '}
          <CippButtonCard
            title={'NinjaOne Organization Mapping'}
            titleType="big"
            isFetching={listBackendNinjaOrgsResult.isFetching}
            CardButton={
              <>
                <CButton form="NinjaOrgs" className="me-2" type="submit">
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
              </>
            }
          >
            {listBackendNinjaOrgsResult.isFetching ? (
              <CSpinner color="primary" />
            ) : (
              <Form
                onSubmit={onNinjaOrgsSubmit}
                initialValues={listBackendHaloResult.data?.Mappings}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm id="NinjaOrgs" onSubmit={handleSubmit}>
                      <CCardText>
                        Use the table below to map your client to the correct NinjaOne Organization.
                        {
                          //load all the existing mappings and show them first in a table.
                          listBackendNinjaOrgsResult.isSuccess && (
                            <CippTable
                              showFilter={true}
                              reportName="none"
                              columns={ninjacolumns}
                              data={ninjaMappingsArray}
                              isModal={true}
                            />
                          )
                        }
                        <CRow>
                          <CCol xs={5}>
                            <RFFSelectSearch
                              placeholder="Select a Tenant"
                              name={`tenant_selector`}
                              values={listBackendNinjaOrgsResult.data?.Tenants.map((tenant) => ({
                                name: tenant.displayName,
                                value: tenant.customerId,
                              }))}
                              onChange={(e) => {
                                setMappingArray(e.value)
                              }}
                            />
                          </CCol>
                          <CCol xs="1" className="d-flex justify-content-center align-items-center">
                            <FontAwesomeIcon icon={'link'} size="xl" className="my-4" />
                          </CCol>
                          <CCol xs="5">
                            <RFFSelectSearch
                              name={mappingArray}
                              values={listBackendNinjaOrgsResult.data?.NinjaOrgs.map((client) => ({
                                name: client.name,
                                value: client.value,
                              }))}
                              onChange={(e) => setMappingValue(e)}
                              placeholder="Select a NinjaOne Organization"
                            />
                          </CCol>
                          <CButton
                            onClick={() =>
                              //set the new mapping in the array
                              setNinjaMappingsArray([
                                ...ninjaMappingsArray,
                                {
                                  Tenant: listBackendNinjaOrgsResult.data?.Tenants.find(
                                    (tenant) => tenant.customerId === mappingArray,
                                  ),
                                  ninjaName: mappingValue.label,
                                  ninjaId: mappingValue.value,
                                },
                              ])
                            }
                            className={`my-4 circular-button`}
                            title={'+'}
                          >
                            <FontAwesomeIcon icon={'plus'} />
                          </CButton>
                        </CRow>
                      </CCardText>
                      <CCol className="me-2">
                        {(extensionNinjaOrgsAutomapResult.isSuccess ||
                          extensionNinjaOrgsAutomapResult.isError) &&
                          !extensionNinjaOrgsAutomapResult.isFetching && (
                            <CippCallout
                              color={
                                extensionNinjaOrgsAutomapResult.isSuccess ? 'success' : 'danger'
                              }
                              dismissible
                              style={{ marginTop: '16px' }}
                            >
                              {extensionNinjaOrgsAutomapResult.isSuccess
                                ? extensionNinjaOrgsAutomapResult.data.Results
                                : 'Error'}
                            </CippCallout>
                          )}
                        {(extensionNinjaOrgsConfigResult.isSuccess ||
                          extensionNinjaOrgsConfigResult.isError) &&
                          !extensionNinjaOrgsConfigResult.isFetching && (
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
                      </CCol>
                      <small>
                        <FontAwesomeIcon icon={'triangle-exclamation'} className="me-2" />
                        After editing the mappings you must click Save Mappings for the changes to
                        take effect. The table will be saved exactly as presented.
                      </small>
                    </CForm>
                  )
                }}
              />
            )}
          </CippButtonCard>
        </CCol>
        <CCol className="mb-3" xs={6}>
          <CippButtonCard
            title={'Ninjaone Field Mapping'}
            titleType="big"
            isFetching={listBackendNinjaFieldsResult.isFetching}
            CardButton={
              <CButton form="ninjaFields" className="me-2" type="submit">
                {extensionNinjaFieldsConfigResult.isFetching && (
                  <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
                )}
                Set Mappings
              </CButton>
            }
          >
            {listBackendNinjaFieldsResult.isFetching ? (
              <CSpinner color="primary" />
            ) : (
              <Form
                onSubmit={onNinjaFieldsSubmit}
                initialValues={listBackendNinjaFieldsResult.data?.Mappings}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm id="ninjaFields" onSubmit={handleSubmit}>
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
          </CippButtonCard>
        </CCol>
      </>
    </CRow>
  )
}
