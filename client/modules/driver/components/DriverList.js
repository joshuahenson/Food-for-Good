import React, {Component} from 'react'
import {connect} from 'react-redux'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'


import selectors from '../../../store/selectors'
import {loadVolunteers} from '../../volunteer/reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import {Page, PageBody} from '../../../components/page'

const mapStateToProps = state => ({
  drivers: selectors.volunteer.getAllDrivers(state),
  loading: selectors.volunteer.loading(state) ||
    selectors.questionnaire.loading(state),
  loadError: selectors.volunteer.loadError(state) ||
    selectors.questionnaire.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadVolunteers: () => dispatch(loadVolunteers()),
  loadQuestionnaires: () => dispatch(loadQuestionnaires())
})

class DriverAdmin extends Component {
  componentWillMount() {
    this.props.loadVolunteers()
    this.props.loadQuestionnaires()
  }

  getStatusLabel = (_, driver) =>
    <span className={labelClass(driver.deliveryStatus)}>
      {driver.deliveryStatus}
    </span>

  render() {
    const {drivers, loading, loadError} = this.props

    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader heading="Drivers" />
            <BoxBody
              loading={loading}
              error={loadError}
            >
              <BootstrapTable
                data={drivers || []}
                keyField="id"
                options={{
                  defaultSortName: "id",
                  defaultSortOrder: 'desc',
                  noDataText: loading ? '' : 'No drivers found'
                }}
                hover
                striped
                pagination
                search
              >
                <TableHeaderColumn dataField="id" width="70px" dataSort>#</TableHeaderColumn>
                <TableHeaderColumn dataField="fullName" dataSort>Name</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="deliveryStatus"
                  dataFormat={this.getStatusLabel}
                  dataAlign="center"
                  width="90px"
                  dataSort
                >
                  Status
                </TableHeaderColumn>
              </BootstrapTable>

            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverAdmin)

function labelClass(status) {
  if (status === 'Completed') return 'label label-success'
  return 'label label-warning'
}
